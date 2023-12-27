import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import CouponListActor from './actor/coupon-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponListActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state().get('form').toJS();
    const couponStatus = this.state().get('queryTab');
    // if (query.scopeType == -1) {
    //   query.scopeType = null;
    // }
    // if (query.couponStatus == 0) {
    //   query.couponStatus = null;
    // }
    const { res } = await webapi.addressList({
      ...query,
      // couponStatus,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let pageVillages = null;
    if (res.context.pageVillages) {
      pageVillages = res.context.pageVillages.content;
      this.dispatch('init', {
        pageVillages: fromJS(pageVillages),
        total: res.context.pageVillages.total,
        pageNum: pageNum + 1
      });
    }
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };

  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 删除优惠券
   */
  deleteCoupon = async (id) => {
    const { res } = await webapi.deleteCoupon([id]);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('删除成功');
    //刷新页面
    this.init();
  };
  /**
   * 复制优惠券
   */
  // copyCoupon = async (id) => {
  //   const { res } = await webapi.copyCoupon(id);
  //   if (res.code != Const.SUCCESS_CODE) {
  //     message.error(res.message);
  //     return;
  //   }
  //   message.success('复制成功');
  //   //刷新页面
  //   this.init();
  // };
}
