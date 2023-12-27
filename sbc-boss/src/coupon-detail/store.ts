import { Store } from 'plume2';
import CouponDetailActor from './actor/coupon-info-actor';
import listActor from './actor/list-actor';
import * as webapi from './webapi';
import { Const, util } from 'qmkit';
import moment from 'moment';

import LoadingActor from './actor/loading-actor';
// import actionType from "../login-interface/action-type";
import { message } from 'antd';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  bindActor() {
    return [new CouponDetailActor(), new listActor(), new LoadingActor()];
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


  /**
* 批量导出
*/
  bulk_export = async () => {
    const query = this.state()
      .get('form')
      .toJS();
    const stat = this.state().toJS();
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
            couponId: stat.coupon.couponId,
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
        couponId: stat.coupon.couponId,
        pageNum,
        pageSize
      })
    ]).then((res) => {
      console.log(res[0].res.context.total, '123123');

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

  setcouponId = (couponId) => {
    console.log(couponId, 'couponId');
    this.dispatch('SetcouponId', couponId)
  }

  init = async (couponId?: string,) => {

    /**获取优惠券详细信息*/
    const { res } = await webapi.fetchCouponInfo(couponId);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('coupon: detail: field: value', {
          field: 'couponCates',
          value: fromJS(
            res.context.couponInfo.cateNames.length == 0
              ? ['其他']
              : res.context.couponInfo.cateNames
          )
        });

        // 设置优惠券信息
        this.dispatch('coupon: detail: field: value', {
          field: 'coupon',
          value: fromJS(res.context.couponInfo)
        });
        // 设置商品品牌信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuBrands',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品分类信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuCates',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品列表
        this.dispatch('coupon: detail: field: value', {
          field: 'skus',
          value: fromJS(
            null == res.context.goodsList
              ? []
              : res.context.goodsList.goodsInfoPage.content
          ) // 设置商品列表
        });
        const stat = this.state().toJS();
        console.log('222222', stat);
        // 设置商品列表
        // this.dispatch('coupon: detail: field: value', {
        //     field: 'skus',
        //     value: [
        //         {
        //             skuId: '0',
        //             skuNo: 'P1234567',
        //             skuName: '博牌旅行包男士手提包韩版行李袋休闲女单肩健身包 蓝色',
        //             guige: '银色 128G',
        //             price: '1200000'
        //         },
        //         {
        //             skuId: '1',
        //             skuNo: 'P1234567',
        //             skuName: 'Apple iPhone 6 32GB 金色 移动联通电信4G手机',
        //             guige: '银色 128G',
        //             price: '120'
        //         },
        //         {
        //             skuId: '2',
        //             skuNo: 'P1234567',
        //             skuName: '实木相框多款相框家居摆件',
        //             guige: '银色 128G',
        //             price: '120'
        //         },
        //         {
        //             skuId: '3',
        //             skuNo: 'P1234567',
        //             skuName: '英伦风墨黑斜纹手提包',
        //             guige: '银色 128G',
        //             price: '120'
        //         }
        //     ]
        // });
      });
    } else {
      message.error(res.message);
    }


  };
}
