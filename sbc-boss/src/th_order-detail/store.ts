import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import TradesActor from './actor/trades-actor';
import PayRecordActor from './actor/pay-record-actor';
import { Map, fromJS } from 'immutable';
import * as webapi from './webapi';
import { message } from 'antd';
import moment from 'moment';
import {
  addPay,
  payRecord,
  fetchOrderDetail,
  pickTrades,
  returnIddeta
} from './webapi';
import LogisticActor from './actor/logistic-actor';
import { history, Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new DetailActor(),
      new LoadingActor(),
      new TidActor(),
      new TabActor(),
      new PayRecordActor(),
      new LogisticActor(),
      new TradesActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (tid: string) => {
    this.transaction(() => {
      this.dispatch('loading:start');
      this.dispatch('tid:init', tid);
      this.dispatch('detail-actor:hideDelivery');
    });

    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: errorInfo } = res;
    if (code == Const.SUCCESS_CODE) {
      //付款
      const payRecordResult = (await payRecord(tid)) as any;
      //提货记录
      const pickTradesResult = (await pickTrades(tid)) as any;
      // 退款记录
      const { res } = (await returnIddeta(tid)) as any;
      // 增加商品中将要发货字段
      if (orderInfo.tradeItems) {
        orderInfo.tradeItems.forEach((v, k) => {
          v.deliveringNum = 0;
          v.key = k;
        });
      }

      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('payReturn:init', res.context);
        this.dispatch('detail:init', orderInfo);
        this.dispatch('receive-record-actor:init', [
          payRecordResult.res.context
        ]);
        this.dispatch('detail-actor:setSellerRemarkVisible', true);
        this.dispatch(
          'tradesList:init',
          fromJS(pickTradesResult.res.context?.pickOrderItems || [])
        );
      });
    } else {
      message.error(errorInfo);
    }
  };

  setReturnVisible = (item) => {
    if (item.orderCode) {
      this.dispatch('receive-record-actor:form', {
        key: 'orderCode',
        value: item.orderCode
      });
      this.onRefundActorAuditChange('totalPrice', item.totalPrice);
      this.dispatch('receive-record-actor', {
        key: 'refundVisible',
        value: true
      });
    } else {
      this.dispatch('receive-record-actor', {
        key: 'refundVisible',
        value: false
      });
    }
  };

  onRefundActorAuditChange = (key, value) => {
    this.dispatch('receive-record-actor:form', { key, value });
  };

  onRefundAuditConfirm = async () => {
    let { refundAuditForm, tid, payLoading } = this.state().toJS();
    if (!refundAuditForm.refundPrice) {
      message.error('请输入退款金额');
      return;
    }
    if (
      Number(refundAuditForm.totalPrice) < Number(refundAuditForm.refundPrice)
    ) {
      message.error('请重新填写');
      return;
    }
    if (payLoading) {
      message.error('已经在退款中，请不要重复操作');
      return;
    }

    this.dispatch('receive-record-actor', { key: 'payLoading', value: true });
    const { res } = await webapi.manualRefundByOrderCode(refundAuditForm);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('退款成功!');
      this.init(tid);
      setTimeout(() => {
        this.dispatch('receive-record-actor', {
          key: 'payLoading',
          value: false
        });
      }, 1000);
      this.dispatch('receive-record-actor', {
        key: 'refundVisible',
        value: false
      });
    } else {
      message.error(res.message);
      setTimeout(() => {
        this.dispatch('receive-record-actor', {
          key: 'payLoading',
          value: false
        });
      }, 1000);
    }
  };

  // /**
  //  * 添加收款单
  //  */
  // onSavePayOrder = async (params) => {
  //   const copy = Object.assign({}, params);
  //   const payOrder = this.state()
  //     .get('payRecord')
  //     .filter((payOrder) => payOrder.payOrderStatus == 1)
  //     .first();
  //   copy.payOrderId = payOrder.payOrderId;
  //   const { res } = await addPay(copy);
  //   if (res.code == Const.SUCCESS_CODE) {
  //     //成功
  //     message.success('添加收款单成功!');
  //     //刷新
  //     const tid = this.state().get('tid');
  //     if (params.totalPrice !== 0) {
  //       this.setReceiveVisible();
  //     }
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  onTabsChange = (key: string) => {
    this.dispatch('tab:init', key);
  };

  // /**
  //  * 详情页签 发货
  //  * @returns {Promise<void>}
  //  */
  // onDelivery = async () => {
  //   const tid = this.state().getIn(['detail', 'id']);
  //   const { res } = await webapi.deliverVerify(tid);
  //   if (res.code !== Const.SUCCESS_CODE) {
  //     message.error(res.message);
  //   } else {
  //     this.dispatch('tab:init', '2');
  //   }
  // };

  // onAudit = async (tid: string, audit: string) => {
  //   const { res } = await webapi.audit(tid, audit);
  //   if (res.code == Const.SUCCESS_CODE) {
  //     message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
  //     const tid = this.state().get('tid');
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 发货
  //  */
  // deliver = async () => {
  //   const tid = this.state().getIn(['detail', 'id']);
  //   const { res } = await webapi.deliverVerify(tid);
  //   if (res.code !== Const.SUCCESS_CODE) {
  //     message.error(res.message);
  //   } else {
  //     const tradeItems = this.state().getIn(['detail', 'tradeItems']);

  //     const shippingItemList = tradeItems
  //       .filter((v) => {
  //         return v.get('deliveringNum') != 0;
  //       })
  //       .map((v) => {
  //         return {
  //           skuId: v.get('skuId'),
  //           itemNum: v.get('deliveringNum')
  //         };
  //       })
  //       .toJS();
  //     if (shippingItemList.length <= 0) {
  //       message.error('请填写发货数量');
  //     } else {
  //       this.showDeliveryModal();
  //     }
  //   }
  // };

  changeDeliverNum = (index, num) => {
    this.dispatch('detail-actor_2:changeDeliverNum', { index, num });
  };

  // /**
  //  * 确认收货
  //  */
  // confirm = async () => {
  //   const tid = this.state().getIn(['detail', 'id']);
  //   const { res } = await webapi.confirm(tid);
  //   if (res.code == Const.SUCCESS_CODE) {
  //     //成功
  //     message.success('确认收货成功!');
  //     //刷新
  //     const tid = this.state().get('tid');
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 显示发货modal
  //  */
  // showDeliveryModal = () => {
  //   this.dispatch('detail-actor:showDelivery', true);
  // };

  // /**
  //  * 关闭发货modal
  //  */
  // hideDeliveryModal = () => {
  //   this.dispatch('detail-actor:hideDelivery');
  // };

  // /**
  //  * 发货
  //  */
  // saveDelivery = async (param) => {
  //   const tradeItems = this.state().getIn(['detail', 'tradeItems']);
  //   const tid = this.state().getIn(['detail', 'id']);

  //   const shippingItemList = tradeItems
  //     .filter((v) => {
  //       return v.get('deliveringNum') != 0;
  //     })
  //     .map((v) => {
  //       return {
  //         skuId: v.get('skuId'),
  //         skuNo: v.get('skuNo'),
  //         itemNum: v.get('deliveringNum')
  //       };
  //     })
  //     .toJS();

  //   let tradeDelivery = Map();
  //   tradeDelivery = tradeDelivery.set('shippingItemList', shippingItemList);
  //   tradeDelivery = tradeDelivery.set('deliverNo', param.deliverNo);
  //   tradeDelivery = tradeDelivery.set('deliverId', param.deliverId);
  //   tradeDelivery = tradeDelivery.set('deliverTime', param.deliverTime);

  //   const { res } = await webapi.deliver(tid, tradeDelivery);
  //   if (res.code == Const.SUCCESS_CODE) {
  //     //成功
  //     message.success('保存发货成功!');
  //     //刷新
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 作废发货记录
  //  * @param params
  //  * @returns {Promise<void>}
  //  */
  // obsoleteDeliver = async (params) => {
  //   const tid = this.state().getIn(['detail', 'id']);

  //   const { res } = await webapi.obsoleteDeliver(tid, params);
  //   if (res.code == Const.SUCCESS_CODE) {
  //     message.success('作废发货记录成功!');
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 回审
  //  * @param params
  //  * @returns {Promise<void>}
  //  */
  // retrial = async () => {
  //   const tid = this.state().getIn(['detail', 'id']);

  //   const { res } = await webapi.retrial(tid);
  //   if (res.code == Const.SUCCESS_CODE) {
  //     this.init(tid);
  //     message.success('回审成功!');
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 作废收款记录
  //  * @param params
  //  * @returns {Promise<void>}
  //  */
  // destroyOrder = async (params) => {
  //   //定单状态
  //   const tid = this.state().getIn(['detail', 'id']);
  //   const { res: verifyRes } = await webapi.verifyAfterProcessing(tid);

  //   if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
  //     message.error('订单已申请退货，不能作废收款记录');
  //     return;
  //   }

  //   const { res } = await webapi.destroyOrder(params);

  //   if (res.code === Const.SUCCESS_CODE) {
  //     message.success('作废成功');
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 显示/取消卖家备注修改
  //  * @param param
  //  */
  // setSellerRemarkVisible = (param: boolean) => {
  //   this.dispatch('detail-actor:setSellerRemarkVisible', param);
  // };

  // /**
  //  * 设置卖家备注
  //  * @param param
  //  */
  // setSellerRemark = (param: string) => {
  //   this.dispatch('detail-actor:remedySellerRemark', param);
  // };

  // /**
  //  * 修改卖家备注
  //  * @param param
  //  * @returns {Promise<void>}
  //  */
  // remedySellerRemark = async () => {
  //   const tid = this.state().getIn(['detail', 'id']);
  //   const sellerRemark = this.state().get('remedySellerRemark');
  //   if (sellerRemark.length > 60) {
  //     message.error('备注长度不得超过60个字符');
  //     return;
  //   }

  //   const { res } = await webapi.remedySellerRemark(tid, sellerRemark);
  //   if (res.code === Const.SUCCESS_CODE) {
  //     message.success('卖家备注修改成功');
  //     const tid = this.state().getIn(['detail', 'id']);
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // /**
  //  * 验证订单客户是否已刪除
  //  * @returns {Promise<void>}
  //  */
  // verify = async (tid: string) => {
  //   const buyerId = this.state().getIn(['detail', 'buyer', 'id']);
  //   const { res } = await webapi.verifyBuyer(buyerId);
  //   if (res) {
  //     message.error('客户已被删除，不能修改订单！');
  //     return;
  //   } else {
  //     history.push('/order-edit/' + tid);
  //   }
  // };

  // /**
  //  * 获取卖家收款账号
  //  * @returns {Promise<void>}
  //  */
  // fetchOffLineAccounts = async (payRecord) => {
  //   const { res } = await webapi.checkFunctionAuth(
  //     '/account/receivable',
  //     'POST'
  //   );
  //   if (!res.context) {
  //     message.error('此功能您没有权限访问');
  //     return;
  //   }

  //   const result = await webapi.fetchOffLineAccout();
  //   if (result) {
  //     if (payRecord.get(0).totalPrice === 0) {
  //       this.onSavePayOrder({
  //         payOrderId: payRecord.get('payOrderId'),
  //         accountId: 1,
  //         createTime: moment(new Date())
  //           .format('YYYY-MM-DD')
  //           .toString(),
  //         totalPrice: payRecord.get(0).totalPrice
  //       });
  //     } else {
  //       this.dispatch('receive-record-actor:setReceiveVisible');
  //     }
  //   }
  // };

  // /**
  //  * 设置添加收款记录是否显示
  //  */
  // setReceiveVisible = () => {
  //   this.dispatch('receive-record-actor:setReceiveVisible');
  // };

  // /**
  //  * 确认收款单
  //  */
  // onConfirm = async (id) => {
  //   let ids = [];
  //   ids.push(id);
  //   const { res } = await webapi.payConfirm(ids);
  //   if (res.code === Const.SUCCESS_CODE) {
  //     message.success('确认成功');
  //     const tid = this.state().getIn(['detail', 'id']);
  //     this.init(tid);
  //   } else {
  //     message.error(res.message);
  //   }
  // };
}
