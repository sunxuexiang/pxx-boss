import { Store, IOptions } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { util, Const, history } from 'qmkit';
import moment from 'moment';

export default class AppStore extends Store {
  //btn加载
  btnLoading = false;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new LoadingActor(),
      new ListActor(),
      new FormActor(),
      new TabActor()
    ];
  }
  onWareHousePage = async () => {
    let res1 = await webapi.wareHousePage({ pageNum: 0, pageSize: 10000 });
    if (res1.res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'warehouseList',
        value: fromJS(res1.res.context?.wareHouseVOPage?.content || [])
      });
    } else {
      message.error(res1.res.message);
      return;
    }
  };

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = (
    { pageNum, pageSize } = {
      pageNum: 0,
      pageSize: this.state().get('pageSize') || 10
    }
  ) => {
    this.dispatch('loading:start');
    //获取form数据
    let form = this.state().get('form').toJS();
    form['orderType'] = 'NORMAL_ORDER';
    const key = this.state().getIn(['tab', 'key']);

    if (key != '0') {
      const [state, value] = key.split('-');
      form['tradeState'][state] = value;
    }

    if (!form['buyerId']) {
      form['buyerId'] = this.state().get('buyerId');
    }
    if (form.presellFlag === 1) {
      form['tradeState'].flowState = 'AUDIT';
    }
    webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        res.context.content.forEach((el) => {
          const iDs = [];
          const itemList = [];
          el.tradeItems.concat(el.gifts).forEach((child) => {
            if (iDs.indexOf(child.skuId) === -1) {
              iDs.push(child.skuId);
              itemList.push(child);
            }
          });
          el.specNumber = iDs.length;
          el.iDs = itemList;
        });
        console.log(res.context.content);
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('list:init', res.context);
          this.dispatch(
            'list:page',
            fromJS({ currentPage: pageNum + 1, pageSize: pageSize })
          );
          this.btnLoading = false;
        });
      } else {
        message.error(res.message);
        if (res.code === 'K-110001') {
          this.dispatch('loading:end');
        }
      }
    });
  };

  /**
   * 缓存的搜索条件
   * @param params
   */
  onSearchOrderForm = (form, orderAddonBeforeForm, tabKey) => {
    const tradeState = form.tradeState;
    const ts = {} as any;
    if (tradeState.deliverStatus) {
      ts.deliverStatus = tradeState.deliverStatus;
    }
    if (tradeState.payState) {
      ts.payState = tradeState.payState;
    }
    if (tradeState.orderSource) {
      ts.orderSource = tradeState.orderSource;
    }
    form.tradeState = ts;
    this.dispatch('form:field', form);
    this.dispatch('addonBeforeForm:field', orderAddonBeforeForm);
    this.dispatch('tab:init', tabKey);
    this.init({ pageNum: form.currentPage, pageSize: form.pageSize });
  };

  onFormValFieldChange = (key, value, formName) => {
    if (key === 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId', 'twonId'].forEach((v, index) => {
          let id = value[index] || '';
          // 区id等于市id时areaId传街道Id , 街道id传空
          if (value[2] === value[1]) {
            if (v === 'areaId') {
              id = value[3] || '';
            } else if (v === 'twonId') {
              id = '';
            }
          }
          this.dispatch('form:field:val', {
            key: v,
            value: id,
            formName
          });
        });
      });
      return;
    }
    this.dispatch('form:field:val', { key, value, formName });
  };

  onTabChange = (key) => {
    this.dispatch('tab:init', key);
    this.init();
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params?) => {
    // if (__DEV__) {
    //   console.log('params--->', params);
    // }
    // this.dispatch('form:clear');
    // this.dispatch('form:field', params);
    let { pageSize } = this.state().toJS();
    this.init({ pageNum: 0, pageSize });
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('list:checkedAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('list:check', {
      index,
      checked
    });
  };

  /**
   * 批量审核
   */
  onBatchAudit = async () => {
    const checkedIds = this.state()
      .get('dataList')
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (checkedIds.length == 0) {
      message.error('请选择需要操作的订单');
      return;
    }

    const { res } = await webapi.batchAudit(checkedIds);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('批量审核成功');
      //refresh
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onAudit = async (tid: string, audit: string) => {
    if (!this.btnLoading) {
      this.btnLoading = true;
      //set loading true
      // this.dispatch('detail-actor:setButtonLoading', true)

      const { res } = await webapi.audit(tid, audit);
      if (res.code == Const.SUCCESS_CODE) {
        message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
        this.init();
      } else {
        message.error(res.message);
        this.btnLoading = false;
        //set loading false
        // this.dispatch('detail-actor:setButtonLoading', false)
      }
    }
  };

  onRetrial = async (tid: string) => {
    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init();
      message.success('回审成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 确认收货
   */
  onConfirm = async (tid: string) => {
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('确认收货成功!');
      //刷新
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 发货前 验证订单是否存在售后申请
   * @param tid
   * @returns {Promise<void>}
   */
  onCheckReturn = async (tid: string) => {
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      history.push({
        pathname: `/order-detail/${tid}`,
        state: { tab: '2' }
      });
    }
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 是否导出子单号
   */
  onExportBySonTrade = () => {
    this.dispatch('list:export-modal:son');
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    let selected = this.state()
      .get('dataList')
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();
    let disabled = this.state().getIn(['exportModalData', 'disabled']);

    if (selected.length === 0) {
      message.error('请选择要导出的订单');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    return this._onExport({ ids: selected }, disabled);
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state().get('form').toJS();
    let disabled = this.state().getIn(['exportModalData', 'disabled']);
    // tab
    const key = this.state().getIn(['tab', 'key']);
    if (key != '0') {
      const [state, value] = key.split('-');
      params['tradeState'][state] = value;
    }

    const total = this.state().get('total');
    if (total > 0) {
      return this._onExport(params, disabled);
    } else {
      message.error('当前搜索结果没有要导出的订单');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  _onExport = (params: {}, disabled) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let resultDisabled = JSON.stringify({
            disabled: false,
            token: token
          });
          let encrypted = base64.urlEncode(result);
          let encryptedable = base64.urlEncode(resultDisabled);
          console.log(resultDisabled, 'resultDisabled');
          console.log(result, 'resultresult');

          // 新窗口下载
          const exportHref =
            Const.HOST +
            `/trade/export/params/${encrypted}/${encryptedable}?isDetailed=${disabled}`;
          //   const exportHref =
          // Const.HOST + `/trade/export/params/${encrypted}?isDetailed=${disabled}`;
          console.log(exportHref, 'exportHrefexportHref');

          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 证订单客户是否已刪除
   * @returns {Promise<void>}
   */
  verify = async (tid: string, buyerId: string) => {
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error('客户已被删除，不能修改订单！');
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };

  setData({ field, value }) {
    this.dispatch('set:state', { field, value });
  }
}
