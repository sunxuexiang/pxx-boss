import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor(), new FormActor()];
  }

  //tab切换
  tabChange = (key) => {
    this.dispatch('form:update', { key: 'currentTab', value: key });
  };

  // 将form对象存储到state中
  setForm = ({ key, form }) => {
    this.dispatch('form:update', { key, value: form });
  };

  init = () => {
    this.getUserList();
    this.geCompanyList();
    this.getMoneyInfo(true);
    this.getMoneyInfo(false);
  };

  //获取用户账户列表信息
  getUserList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const form = this.state().get('userForm');
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const params = {
          pageNum,
          pageSize,
          storeFlag: false,
          ...values
        };
        this.dispatch('list:loading', { key: 'userInfo', loading: true });
        const { res } = await webapi.fetchUserList(params);
        this.dispatch('list:loading', { key: 'userInfo', loading: false });
        if (res && res.code === Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch(
              'listActor:initUser',
              res.context?.customerWalletVOList
            );
            this.dispatch('list:current', {
              pageNum: pageNum + 1,
              pageSize,
              key: 'userInfo'
            });
          });
        } else {
          message.error(res.message || '');
        }
      }
    });
  };

  //获取企业账户列表信息
  geCompanyList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const form = this.state().get('companyForm');
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const params = {
          pageNum,
          pageSize,
          storeFlag: true,
          ...values
        };
        this.dispatch('list:loading', { key: 'companyInfo', loading: true });
        const { res } = await webapi.fetchUserList(params);
        this.dispatch('list:loading', { key: 'companyInfo', loading: false });
        if (res && res.code === Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch(
              'listActor:initCompany',
              res.context?.customerWalletVOList
            );
            this.dispatch('list:current', {
              pageNum: pageNum + 1,
              pageSize,
              key: 'companyInfo'
            });
          });
        } else {
          message.error(res.message || '');
        }
      }
    });
  };

  //获取余额信息
  getMoneyInfo = async (merchantFlag) => {
    const { res } = await webapi.fetchMoneyInfo({ merchantFlag });
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('listActor:initBalance', {
        key: merchantFlag ? 'companyInfo' : 'userInfo',
        balance: res.context?.totalBalance || 0,
        addBalance: res.context?.addBalance || 0,
        reduceBalance: res.context?.reduceBalance || 0
      });
    } else {
      message.error(res.message || '');
    }
  };
}
