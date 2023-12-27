import { Store } from 'plume2';
import ListActor from './actor/list-actor';
import * as webapi from './webapi';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import TableKeyActor from './actor/table-key-actor';
import EditActor from './actor/edit-actor';
import ViewActor from './actor/view-actor';
import ModalListActor from './actor/modal-list-actors';
import { fromJS } from 'immutable';
import momnet from 'moment';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new VisibleActor(),
      new EditActor(),
      new ViewActor(),
      new TableKeyActor(),
      new ModalListActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }
  onWareHousePage = async () => {
    let { res }: any = await webapi.wareHousePage({
      pageNum: 0,
      pageSize: 10000,
      defaultFlag:1
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('start-form', {
        key: 'warehouseList',
        value: fromJS(res.context?.wareHouseVOPage?.content || [])
      });
    } else {
      message.error(res.message);
      return;
    }
  };

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async ({ isInit }) => {
    this.dispatch('loading:start');
    const param = {
      pageSize: this.state().get('pageSize'),
      pageNum: this.state().get('current'),
      queryTab: this.state().get('queryTab'),
      popupName: this.state().get('prevPopupName'),
      wareId: this.state().get('wareId')
    };
    await this.fetchModlList(param);
  };
  //查询
  onSearch = async () => {
    const queryTab = this.state().get('queryTab');
    const pageSize = this.state().get('pageSize');
    this.dispatch('prevPopupName', this.state().get('popupName'));
    const popupName = this.state().get('prevPopupName');
    const wareId = this.state().get('wareId');
    await this.fetchModlList({
      popupName,
      queryTab,
      pageSize,
      pageNum: 0,
      wareId
    });
  };
  onFormFieldChange = (key, value) => {
    this.dispatch('start-form', { key, value });
  };
  //查询弹窗列表
  fetchModlList = async (params) => {
    const { res } = await webapi.fetchModalList(params);
    // (res as any).context.popupAdministrationVOS.content.forEach((e) => {
    //   if(e.beginTime && e.endTime) {
    //     e.beginTime = e.beginTime.slice(0,-4)
    //     e.endTime = e.endTime.slice(0,-4)
    //   }
    // })
    console.log(res, 'datalistdatalis');

    this.transaction(() => {
      this.dispatch('modalList:init', res);
      this.dispatch('pageSize', params.pageSize);
      this.dispatch('current', params.pageNum + 1);
      // this.dispatch('popupName', params.popupName);
      this.dispatch('change:queryTab', params.queryTab.toString());
      this.dispatch('loading:end');
    });
  };
  setPopupName = (popupName: string) => {
    this.dispatch('popupName', popupName);
  };
  //查询弹窗管理列表
  fetchModlManageList = async (params) => {
    const { res } = await webapi.fetchModalManageList(params);
    this.dispatch('modalManageList:init', res);
  };
  //删除弹窗
  deleteModal = async (popupId) => {
    const res = (await webapi.deleteModal({ popupId })) as any;
    if (res.res.code == 'K-000000') {
      const queryTab = this.state().get('queryTab');
      message.success('删除成功!');
      const popupName = this.state().get('prevPopupName');
      const pageSize = this.state().get('pageSize');
      let pageNum = this.state().get('current') - 1;
      const dataList = this.state().get('dataList');
      if (pageNum != 0 && dataList.length == 1) {
        pageNum--;
      }
      await this.fetchModlList({ queryTab, pageSize, popupName, pageNum });
    } else {
      message.error(res.res.message);
    }
  };
  //开始
  startPop = async (popupId) => {
    const { res } = (await webapi.startPop(popupId)) as any;
    if (res.code == 'K-000000') {
      message.success('已开始');
      const queryTab = this.state().get('queryTab');
      const popupName = this.state().get('prevPopupName');
      const pageSize = this.state().get('pageSize');
      await this.fetchModlList({ queryTab, pageSize, popupName, pageNum: 0 });
    } else {
      message.error(res.res.message);
    }
  };

  //暂停
  pausePop = async (popupId) => {
    const { res } = (await webapi.pausePop(popupId)) as any;
    if (res.code == 'K-000000') {
      message.success('已暂停');
      const queryTab = this.state().get('queryTab');
      const popupName = this.state().get('prevPopupName');
      const pageSize = this.state().get('pageSize');
      await this.fetchModlList({ queryTab, pageSize, popupName, pageNum: 0 });
    } else {
      message.error(res.res.message);
    }
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 批量
   */
  onBatchConfirm = async () => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/confirm',
      'POST'
    );
    if (!result.context) {
      message.error('您没有该权限，如需修改请联系管理员!');
      return;
    }

    let selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择订单');
      return;
    }
    selected = this.state()
      .get('dataList')
      .filter(
        (data) =>
          selected.includes(data.get('payOrderId')) &&
          data.get('payOrderStatus') == 2
      )
      .map((data) => data.get('payOrderId'));
    if (selected.count() <= 0) {
      this.successMsgThenInit();
      return;
    }

    const { res } = await webapi.confirm(selected.toJS());
    this.messageByResult(res);
  };

  /**
   * 批量作废
   * @returns {Promise<void>}
   */
  onBatchDestory = async () => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/payOrder/destory',
      'PUT'
    );
    if (!result.context) {
      message.error('您没有该权限，如需修改请联系管理员!');
      return;
    }

    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择订单');
      return;
    }
    const orderIds = this.state()
      .get('dataList')
      .filter((data) => selected.includes(data.get('payOrderId')))
      .map((data) => data.get('orderCode'));

    for (let orderId of orderIds) {
      const { res: verifyRes } = await webapi.verifyAfterProcessing(orderId);

      if (
        verifyRes.code === Const.SUCCESS_CODE &&
        verifyRes.context.length > 0
      ) {
        message.error('订单已申请退货，不能作废收款记录');
        return;
      }
    }

    const { res } = await webapi.destory(selected.toJS());
    this.messageByResult(res);
  };

  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.confirm(ids);
    this.messageByResult(res);
  };

  onDestory = async (id) => {
    let ids = [];
    ids.push(id);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(
      this.state()
        .get('dataList')
        .find((data) => data.get('payOrderId') === id)
        .get('orderCode')
    );
    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('订单已申请退货，不能作废收款记录');
      return;
    }
    const { res } = await webapi.destory(ids);
    this.messageByResult(res);
  };

  onCreateReceivable = async (payOrderId) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/receivable',
      'POST'
    );
    if (!result.context) {
      message.error('您没有该权限，如需修改请联系管理员!');
      return;
    }

    const { res } = await webapi.offlineAccounts();
    this.dispatch('offlineAccount', fromJS(res));
    this.dispatch('offlineAccount:payOrderId', payOrderId);
    this.dispatch('modal:show');
  };

  onCancel = async () => {
    this.dispatch('modal:hide');
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ isInit: false });
    } else {
      message.error(res.message);
    }
  }

  /**
   * 保存
   * @param receivableForm
   * @returns {Promise<void>}
   */
  onSave = async (receivableForm) => {
    receivableForm.payOrderId = this.state().get('payOrderId');
    receivableForm.createTime = momnet(receivableForm.createTime)
      .format('YYYY-MM-DD')
      .toString();
    //保存
    const { res } = await webapi.addReceivable(receivableForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.dispatch('modal:hide');
      this.init({ isInit: false });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 操作成功提示
   */
  successMsgThenInit = () => {
    message.success('操作成功');
    this.init({ isInit: false });
  };

  /**
   * 查看
   * @param {string} id
   */
  onView = (id: string) => {
    const receive = this.state()
      .get('dataList')
      .find((receive) => receive.get('payOrderId') == id);

    this.transaction(() => {
      this.dispatch('receive:receiveView', receive);
      this.dispatch('viewModal:show');
    });
  };

  /**
   * 隐藏视图
   */
  onViewHide = () => {
    this.dispatch('viewModal:hide');
  };

  //tab-list 切换
  onTabChange = async (index: string) => {
    const popupName = this.state().get('prevPopupName');
    const pageSize = this.state().get('pageSize');
    await this.fetchModlList({
      queryTab: index,
      pageSize,
      popupName,
      pageNum: 0
    });
  };
  onTabChangeInfo = async (index: string) => {
    this.dispatch('changeInfo:infoKey', index);
  };
}
