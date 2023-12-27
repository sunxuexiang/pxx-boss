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
  onWareHousePage = async (wareId) => {
    if(wareId){
      this.dispatch('form: field', {
        key: 'wareId',
        value: wareId||null
      });
      window.history.replaceState({}, document.title);
    }
    let { res } = await webapi.wareHousePage({ pageNum: 0, pageSize: 1000,defaultFlag:1 });
    if (res.code === Const.SUCCESS_CODE) {
      let list=(res.context?.wareHouseVOPage?.content||[]).filter(item=>item.wareId!=49&&item.wareId!=45);
      this.dispatch('start-set', {
        key: 'warehouseList',
        value: fromJS(list || [])
      });
      this.init(
        { pageNum: 0, pageSize: 10 },
        fromJS(list)
      );
    } else {
      message.error(res.message);
    }
  };

  init = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 },
    wareist = fromJS([])
  ) => {
    const warehouseList =
      wareist.toJS() || this.state().get('warehouseList').toJS();
    const query = this.state().get('form').toJS();
    const wareId = query.wareId || warehouseList[0].wareId;
    if (!query.wareId)
      this.dispatch('form: field', {
        key: 'wareId',
        value: warehouseList[0].wareId
      });
    const couponStatus = this.state().get('queryTab');
    // if (query.scopeType == -1) {
    //   query.scopeType = null;
    // }
    // if (query.couponStatus == 0) {
    //   query.couponStatus = null;
    // }
    const { res } = await webapi.couponList({
      // ...query,
      // couponStatus,
      pageNum,
      pageSize,
      wareId
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let couponList = null;
    if (res.context.advertisingPage) {
      couponList = res.context.advertisingPage.content;
      this.dispatch('init', {
        couponList: fromJS(couponList),
        total: res.context.advertisingPage.total,
        pageNum: pageNum + 1
      });
    }
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };
  onWarehouse = (key, value) => {
    this.dispatch('form: field', { key, value });
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
    const { res } = await webapi.deleteCoupon(id);
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
  copyCoupon = async (id) => {
    const { res } = await webapi.copyCoupon(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('复制成功');
    //刷新页面
    this.init();
  };
}
