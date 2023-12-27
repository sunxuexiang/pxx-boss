import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import ListActor from './actor/list-actor';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import moment from 'moment';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor()];
  }

  // 将form对象存储到state中
  setForm = (form) => {
    this.dispatch('form:update', form);
  };

  init = async (walletId, storeFlag) => {
    this.getMoney(walletId, storeFlag, this.getList);
  };

  //获取账户详情列表信息
  getList = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const form = this.state().get('form');
    const accountInfo = this.state().get('accountInfo').toJS();
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const params = {
          pageNum,
          pageSize,
          customerAccount: accountInfo.accountNumber || '',
          startTime:
            values.detailTime && values.detailTime.length === 2
              ? moment(values.detailTime[0]).format('YYYY-MM-DD HH:mm:ss')
              : '',
          endTime:
            values.detailTime && values.detailTime.length === 2
              ? moment(values.detailTime[1]).format('YYYY-MM-DD HH:mm:ss')
              : '',
          ...values
        };
        delete params.detailTime;
        this.dispatch('list:loading', true);
        const { res } = await webapi.fetchList(params);
        this.dispatch('list:loading', false);
        if (res && res.code === Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch('listActor:init', res.context?.customerWalletVOList);
            this.dispatch('list:page', {
              pageNum: pageNum + 1,
              pageSize
            });
          });
        } else {
          message.error(res.message || '');
        }
      }
    });
  };

  //获取账户鲸币余额
  getMoney = async (walletId, storeFlag, callback) => {
    const { res } = await webapi.fetchMoney({ walletId, storeFlag });
    if (res && res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'listActor:accountInfo',
          fromJS({
            accountName: res.context?.name,
            accountNumber: res.context?.account,
            accountBlance: res.context?.balance
          })
        );
        callback();
      });
    } else {
      message.error(res.message || '');
    }
  };
}
