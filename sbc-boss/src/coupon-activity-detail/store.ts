import { Store } from 'plume2';

import { Const } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';
import moment from 'moment';
import { util } from 'qmkit';

import * as webapi from './webapi';
import CouponActivityDetailActor from './actor/coupon-activity.actor';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponActivityDetailActor(), new ListActor(), new LoadingActor()];
  }

  /**
 * 初始化信息
 */
  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  search = () => {
    this.inits({ pageNum: 0, pageSize: 10 });
  };


  inits = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const stat = this.state().toJS();
    const query = this.state()
      .get('form')
      .toJS();
    console.log('11111111', stat);
    this.dispatch('loading:start');
    this.dispatch('list:inits', {
      content: fromJS([]),
    });
    Promise.all([
      webapi.fetchcoupRecordList({
        ...query,
        activityId: stat.activityInfo.couponActivity.activityId,
        pageNum,
        pageSize
      })
    ]).then((res) => {
      // console.log(res[0].res.context.total, '123123');

      if (res[0].res.code != Const.SUCCESS_CODE) {
        message.error(res[0].res.message);
      }

      let couponList = null;
      if (res[0].res.context) {
        couponList = res[0].res.context.content;
        couponList = couponList.map((coupon) => {
          // 3.1.面值
          if (coupon.fullBuyType == 0) {
            //无门槛
            coupon.denominationStr = `满0减${coupon.denomination}`;
          } else {
            coupon.denominationStr = `满${coupon.fullBuyPrice}减${coupon.denomination
              }`;
          }
          // 3.2.有效期
          if (coupon.rangeDayType == 0) {
            // 按起止时间
            let startTime = moment(coupon.startTime)
              .format(Const.DAY_FORMAT)
              .toString();
            let endTime = moment(coupon.endTime)
              .format(Const.DAY_FORMAT)
              .toString();
            coupon.startTime = coupon.validity = `${startTime}至${endTime}`;
          } else {
            // 按N天有效
            coupon.validity = `领取当天${coupon.effectiveDays}日内有效`;
          }
          // 3.4.使用范围
          // if ([0, 4].indexOf(coupon.scopeType) != -1) {
          //   coupon.scopeNamesStr =
          //     Const.couponScopeType[coupon.scopeType] +
          //     coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1);
          // } else {
          //   coupon.scopeNamesStr =
          //     Const.couponScopeType[coupon.scopeType] +
          //     ':' +
          //     (coupon.scopeNames.length != 0
          //       ? coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1)
          //       : '-');
          // }
          // 3.5.优惠券状态
          // coupon.couponStatusStr = Const.couponStatus[coupon.couponStatus];
          return coupon;
        });
        this.dispatch('loading:end');
        this.dispatch('list:inits', {
          content: fromJS(couponList),
          total: res[0].res.context.total,
          pageNum: pageNum + 1
        });
        // this.transaction(() => {
        //   this.dispatch('loading:end');
        //   this.dispatch('list:inits', res[0].res.context);
        //   // this.dispatch('offlineAccounts', res[1].res.context);
        //   this.dispatch('current', pageNum && pageNum + 1);
        // });
      }



    });
  };

  /**
 * 批量导出
 */
  bulk_export = async () => {
    const query = this.state()
      .get('form')
      .toJS();
    const stat = this.state().toJS();
    console.log(stat.activityInfo.couponActivity,'statstat');
    
    // const { beginTime, endTime, keywords } = searchTime;
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            ...query,
            token: token,
            activityId: stat.activityInfo.couponActivity.activityId,
            pageNum: 0,
            pageSize: 1000,
            // accountRecordType: this.state().get('tabKey') - 1
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/coupon-code/exportRecord/${encrypted}`;
          console.log(exportHref);

          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
  init = async (id) => {
    const { res } = await webapi.activityDetail(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    //拼装页面需要展示的参数 couponInfoList
    let {
      couponInfoList,
      couponActivityConfigList,
      couponActivity,
      customerDetailVOS
    } = res.context;
    couponInfoList = couponInfoList.map((item) => {
      if (item.rangeDayType == 0) {
        item.time =
          moment(item.startTime)
            .format(Const.TIME_FORMAT)
            .toString() +
          '至' +
          moment(item.endTime)
            .format(Const.TIME_FORMAT)
            .toString();
      } else {
        item.time = `领取当天${item.effectiveDays}日内有效`;
      }
      if (item.fullBuyType == 0) {
        item.price = `满0元减${item.denomination}`;
      } else {
        item.price = `满${item.fullBuyPrice}元减${item.denomination}`;
      }
      const config = couponActivityConfigList.find(
        (config) => config.couponId == item.couponId
      );
      item.totalCount = config.totalCount;
      return item;
    });
    res.context.couponInfoList = couponInfoList;
    if (couponActivity.joinLevel == -2 && customerDetailVOS) {
      // 指定活动用户范围
      customerDetailVOS = customerDetailVOS.map((item) => {
        let customer = {} as any;
        customer.customerId = item.customerId;
        // 用户名
        customer.customerName = item.customerAccount;
        // 账号
        customer.customerAccount = item.customerAccount;
        return customer;
      });
      res.context.customerDetailVOS = customerDetailVOS;
    }
    this.dispatch('init', fromJS(res.context));
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
  };
}
