import { Store } from 'plume2';

import { message } from 'antd';

import OperateModal from './actor/modal-actor';
import * as webApi from './webapi';
import CompanyActor from './actor/company-actor';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
  }

  bindActor() {
    return [new OperateModal(), new CompanyActor()];
  }

  /**
   * 显示/关闭 弹窗
   */
  switchModal = ({ modalType, id = -1 }) => {
    this.dispatch('modal: switch', { modalType, id });
  };

  /**
   * 初始化商家列表
   */
  initSuppliers = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const params = this.state().get('form').toJS();
    const { res } = await webApi.fetchSupplierList({
      ...params,
      pageSize,
      pageNum
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('company: init: supplier', res.context);
        this.dispatch('company: currentPage', pageNum + 1);
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 切换tab
   */
  changeTab = (auditState) => {
    this.dispatch('company: form: set', auditState);
    this.initSuppliers();
  };

  /**
   * 设置form参数
   */
  setField = ({ field, value }) => {
    this.dispatch('company: form: field', { field, value });
  };

  /**
   * 更改搜索项
   */
  changeOption = (val) => {
    this.dispatch('company: form: changeOption', val);
  };

  /**
   * 输入原因
   */
  enterReason = (reason) => {
    this.dispatch('modal: reason', reason);
  };

  /**
   * 启用/禁用 账号
   */
  reject = async ({ companyInfoId, accountState }) => {
    const reason = this.state().get('reason');
    const { res } = await webApi.switchEmployee({
      companyInfoId,
      accountDisableReason: reason,
      accountState
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (accountState == 0) {
        message.success('启用成功!');
      } else if (accountState == 1) {
        message.success('禁用成功!');
        this.switchModal({ modalType: 0, id: -1 });
      }
      this.initSuppliers();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 开店/关店
   */
  switchStore = async ({ storeId, storeState }) => {
    const reason = this.state().get('reason');
    const { res } = await webApi.switchStore({
      storeId,
      storeClosedReason: reason,
      storeState
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (storeState == 0) {
        message.success('开店成功!');
      } else if (storeState == 1) {
        message.success('关店成功!');
        this.switchModal({ modalType: 0, id: -1 });
      }
      this.initSuppliers();
    } else {
      message.error(res.message);
    }
  };

  //获取招商经理列表
  getManagerList = async () => {
    const { res } = await webApi.fetchManagerList();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch(
        'company: managerList',
        fromJS(res.context?.employeeList || [])
      );
    } else {
      message.error(res.message || '');
    }
  };

  // 设置是否为自营商家
  setSelfManage = async (storeId, checked) => {
    const params = {
      storeId,
      selfManage: checked ? 1 : 0
    };
    const { res } = await webApi.editSelfManage(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.initSuppliers({
        pageNum: this.state().get('pageNum') - 1,
        pageSize: this.state().get('pageSize')
      });
    } else {
      message.error(res.message || '');
    }
  };

  // 重签合同
  reSign = async (id) => {
    const { res } = await webApi.reSignContract({ companyInfoId: id });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.initSuppliers({
        pageNum: this.state().get('pageNum') - 1,
        pageSize: this.state().get('pageSize')
      });
    } else {
      message.error(res.message || '');
    }
  };

  // 获取所有批发市场
  getAllMarkets = async () => {
    const { res } = await webApi.getMarketData({ pageNum: 0, pageSize: 10000 });
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('company: marketsList', fromJS(res.context?.content || []));
    } else {
      message.error(res.message || '');
    }
  };

  // 导出
  onExport = () => {
    const params = this.state().get('form').toJS();
    webApi.exportStoreList(params);
  };
}
