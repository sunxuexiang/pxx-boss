import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import PayRecordActor from './actor/pay-record-actor';
import { Map } from 'immutable';

import * as webapi from './webapi';
import { message } from 'antd';
import moment from 'moment';
import { addPay, payRecord, fetchOrderDetail, returnIddeta } from './webapi';
import LogisticActor from './actor/logistic-actor';
import { history, Const } from 'qmkit';
import { fromJS } from 'immutable';
export default class AppStore extends Store {
  bindActor() {
    return [
      new DetailActor(),
      new LoadingActor(),
      new TidActor(),
      new TabActor(),
      new PayRecordActor(),
      new LogisticActor()
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
      const payRecordResult = (await payRecord(tid)) as any;
      const { res: payReturnList } = (await returnIddeta(tid)) as any;

      // 增加商品中将要发货字段
      if (orderInfo.tradeItems) {
        orderInfo.tradeItems.forEach((v, k) => {
          v.deliveringNum = v.num - v.deliveredNum;
          v.key = k;
        });
        if (orderInfo.logistics && !['01'].includes(orderInfo.logistics)) {
          try {
            orderInfo.logistics = JSON.parse(orderInfo.logistics);
            orderInfo.logistics.logisticsData = JSON.parse(
              orderInfo.logistics.logisticsData
            );
          } catch (error) {}
        } else {
          orderInfo.logistics = null;
        }
      }

      if (orderInfo.gifts.length) {
        orderInfo.gifts.forEach((v, k) => {
          v.deliveringNum = v.num - v.deliveredNum;
          v.isGift = true;
          v.key = k;
        });
      }

      this.transaction(() => {
        this.dispatch(
          'payReturn:init',
          (payReturnList.context || []).map((item) => {
            item.manualRefundImgVOList = (item.manualRefundImgVOList || []).map(
              (item1) => {
                item1.uid = item1.manualRefundImgId;
                item1.url = item1.manualRefundPaymentVoucherImg;
                item1.status = 'done';
                item1.name = 'image.png';
                return item1;
              }
            );
            return item;
          })
        );
        this.dispatch(
          'detail-actor:remedySellerRemark',
          orderInfo.sellerRemark
        );
        this.dispatch('loading:end');
        this.dispatch('detail:init', orderInfo);
        this.dispatch(
          'receive-record-actor:init',
          payRecordResult.res.payOrderResponses
        );
        this.dispatch('detail-actor:setSellerRemarkVisible', true);
      });
    } else {
      message.error(errorInfo);
    }
  };

  //删除退款凭证
  onDelPayReturnEditImages = async (row, fileList, file) => {
    let payReturn = this.state().get('payReturn').toJS();
    let obj = {
      deleteManualRefundImgVOList: [file.manualRefundImgId],
      refundBillType: 1
    };
    const { res }: any = await webapi.deleteManualRefundImgs(obj);
    if (res.code == Const.SUCCESS_CODE) {
      let list = payReturn.map((item) =>
        item.refundId == row.refundId
          ? { ...item, manualRefundImgVOList: fileList }
          : item
      );
      this.dispatch('payReturn:init', list);
    } else {
      message.error(res.message);
    }
  };

  //新增退款凭证
  onUploadImg = async (list, row) => {
    let obj = {
      refundId: row.refundId,
      refundBillType: 1,
      refundBelongBillId: row.orderCode,
      addManualRefundImgVOList: [...list]
    };
    const { res }: any = await webapi.addManualRefundImgs(obj);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('上传成功');
      // this.init(orderId)
      const { res: payReturnList } = (await returnIddeta(row.orderCode)) as any;
      this.dispatch('payReturn:init', payReturnList.context);
    } else {
      message.error(res.message);
    }
  };

  onOrderPicking = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    let { res } = (await webapi.orderPicking(tid)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  onPayReturnEditImages = async (row, fileList, file) => {
    let payReturn = this.state().get('payReturn').toJS();
    if (file.status == 'done') {
      let obj = {
        addManualRefundImgVOList: [
          {
            refundId: row.refundId,
            refundBillType: 1,
            refundBelongBillId: row.id,
            manualRefundPaymentVoucherImg: file?.response[0]
          }
        ]
      };
      const { res }: any = await webapi.addManualRefundImgs(obj);
      if (res.code == Const.SUCCESS_CODE) {
        row.manualRefundImgVOList[row.manualRefundImgVOList.length - 1] = {
          ...res.context.manualRefundImgVOList[0],
          uid: res.context.manualRefundImgVOList[0].manualRefundImgId,
          url: file?.response[0],
          status: 'done',
          name: 'image.png'
        };
        let list = payReturn.map((item) =>
          item.refundId == row.refundId
            ? { ...item, manualRefundImgVOList: row.manualRefundImgVOList }
            : item
        );
        this.dispatch('payReturn:init', list);
      } else {
        message.error(res.message);
      }
    } else {
      let list = payReturn.map((item) =>
        item.refundId == row.refundId
          ? { ...item, manualRefundImgVOList: fileList }
          : item
      );
      this.dispatch('payReturn:init', list);
    }
  };

  /**
   * 添加收款单
   */
  onSavePayOrder = async (params) => {
    const copy = Object.assign({}, params);
    const payOrder = this.state()
      .get('payRecord')
      .filter((payOrder) => payOrder.payOrderStatus == 1)
      .first();
    copy.payOrderIds = [payOrder.payOrderId];
    const { res } = await addPay(copy);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('添加收款单成功!');
      //刷新
      const tid = this.state().get('tid');
      if (params.totalPrice !== 0) {
        this.setReceiveVisible();
      }
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  onTabsChange = (key: string) => {
    this.dispatch('tab:init', key);
  };

  /**
   * 详情页签 发货
   * @returns {Promise<void>}
   */
  onDelivery = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.dispatch('tab:init', '2');
    }
  };

  onAudit = async (tid: string, audit: string) => {
    const { res } = await webapi.audit(tid, audit);
    if (res.code == Const.SUCCESS_CODE) {
      message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
      const tid = this.state().get('tid');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 发货
   */
  deliver = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      // const tradeItems = this.state().getIn(['detail', 'tradeItems']);

      // const shippingItemList = tradeItems
      //   .filter((v) => {
      //     return v.get('deliveringNum') != 0;
      //   })
      //   .map((v) => {
      //     return {
      //       skuId: v.get('skuId'),
      //       itemNum: v.get('deliveringNum')
      //     };
      //   })
      //   .toJS();
      // if (shippingItemList.length <= 0) {
      //   message.error('请填写发货数量');
      // } else {
      //   this.showDeliveryModal();
      // }
      this.showDeliveryModal();
    }
  };

  changeDeliverNum = (index, num, type) => {
    const tradeItems = this.state().getIn(['detail', 'tradeItems']);
    let cont = index;
    if (type === 'gifts') {
      cont = cont - tradeItems.size;
    }
    this.dispatch('detail-actor:changeDeliverNum', { index: cont, num, type });
  };

  // changeGiftsDeliverNum = (index, num) => {
  //   const tradeItems = this.state().getIn(['detail', 'tradeItems']);
  //   let cont = index - tradeItems.size
  //   console.log('changeGiftsDeliverNum', cont)
  //   this.dispatch('detail-actor:changeGifts', {cont, num });
  // };

  /**
   * 确认收货
   */
  confirm = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('确认收货成功!');
      //刷新
      const tid = this.state().get('tid');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示发货modal
   */
  showDeliveryModal = () => {
    this.dispatch('detail-actor:showDelivery', true);
  };

  /**
   * 关闭发货modal
   */
  hideDeliveryModal = () => {
    this.dispatch('detail-actor:hideDelivery');
  };

  /**
   * 发货
   */
  saveDelivery = async (param) => {
    const tradeItems = this.state().getIn(['detail', 'tradeItems']);
    const gifts = this.state().getIn(['detail', 'gifts']);
    const tid = this.state().getIn(['detail', 'id']);
    console.log('gifts', gifts.toJS());
    const shippingItemList = tradeItems
      .map((v) => {
        return {
          skuId: v.get('skuId'),
          skuNo: v.get('skuNo'),
          itemNum: v.get('deliveringNum')
        };
      })
      .toJS();
    // .filter((v) => {
    //   return v.get('deliveringNum') !== 0;
    // })

    const giftItemList = gifts
      .map((v) => {
        return {
          skuId: v.get('skuId'),
          skuNo: v.get('skuNo'),
          itemNum: v.get('deliveringNum')
        };
      })
      .toJS();

    let tradeDelivery = Map();
    tradeDelivery = tradeDelivery.set('shippingItemList', shippingItemList);
    tradeDelivery = tradeDelivery.set('giftItemList', giftItemList);
    // tradeDelivery = tradeDelivery.set('deliverNo', param.deliverNo);
    // tradeDelivery = tradeDelivery.set('deliverId', param.deliverId);
    // tradeDelivery = tradeDelivery.set('deliverTime', param.deliverTime);

    const { res } = await webapi.deliver(tid, tradeDelivery);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('保存发货成功!');
      //刷新
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 作废发货记录
   * @param params
   * @returns {Promise<void>}
   */
  obsoleteDeliver = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.obsoleteDeliver(tid, params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('作废发货记录成功!');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 回审
   * @param params
   * @returns {Promise<void>}
   */
  retrial = async () => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init(tid);
      message.success('回审成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 作废收款记录
   * @param params
   * @returns {Promise<void>}
   */
  destroyOrder = async (params) => {
    //定单状态
    const tid = this.state().getIn(['detail', 'id']);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(tid);

    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('订单已申请退货，不能作废收款记录');
      return;
    }

    const { res } = await webapi.destroyOrder(params);

    if (res.code === Const.SUCCESS_CODE) {
      message.success('作废成功');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示/取消卖家备注修改
   * @param param
   */
  setSellerRemarkVisible = (param: boolean) => {
    this.dispatch('detail-actor:setSellerRemarkVisible', param);
  };

  /**
   * 设置卖家备注
   * @param param
   */
  setSellerRemark = (param: string) => {
    this.dispatch('detail-actor:remedySellerRemark', param);
  };

  /**
   * 修改卖家备注
   * @param param
   * @returns {Promise<void>}
   */
  remedySellerRemark = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    // const details = this.state().get('detail');
    let sellerRemark = this.state().get('remedySellerRemark');
    // console.log('details', details.toJS())
    // if(!sellerRemark || sellerRemark == '') {
    //   sellerRemark = details.toJS().sellerRemark
    // }
    if (sellerRemark.length > 60) {
      message.error('备注长度不得超过60个字符');
      return;
    }

    const { res } = await webapi.remedySellerRemark(tid, sellerRemark);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('卖家备注修改成功');
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 验证订单客户是否已刪除
   * @returns {Promise<void>}
   */
  verify = async (tid: string) => {
    const buyerId = this.state().getIn(['detail', 'buyer', 'id']);
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error('客户已被删除，不能修改订单！');
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };

  /**
   * 获取卖家收款账号
   * @returns {Promise<void>}
   */
  fetchOffLineAccounts = async (payRecord) => {
    const { res } = await webapi.checkFunctionAuth(
      '/account/receivable',
      'POST'
    );
    if (!res.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const result = await webapi.fetchOffLineAccout();
    if (result) {
      if (payRecord.get(0).totalPrice === 0) {
        this.onSavePayOrder({
          payOrderId: payRecord.get('payOrderId'),
          accountId: 1,
          createTime: moment(new Date()).format('YYYY-MM-DD').toString(),
          totalPrice: payRecord.get(0).totalPrice
        });
      } else {
        this.dispatch('receive-record-actor:setReceiveVisible');
      }
    }
  };

  // 取消退款
  setReturnVisible = () => {
    this.dispatch('receive-record-actor:addReturnrVisible');
  };

  /**
   * 设置添加收款记录是否显示
   */
  setReceiveVisible = () => {
    this.dispatch('receive-record-actor:setReceiveVisible');
  };
  /**
   * 设置确认收款是否显示
   */
  setCollectionVisible = (row) => {
    let { collectionVisible } = this.state().toJS();
    if (!collectionVisible) {
      let arr = this.payOrderInfo(row.tids);
      Promise.all(arr).then((res) => {
        this.dispatch('form:order:info:list', fromJS(res));
        this.dispatch('receive-record-actor:setCollectionVisible');
      });
    } else {
      this.dispatch('receive-record-actor:setCollectionVisible');
    }
  };

  // 订单信息列表
  payOrderInfo = (list) => {
    return list.map((item) => {
      return new Promise(async (resolve, reject) => {
        let { res }: any = await payRecord(item);
        if (res.payOrderResponses) {
          resolve({ ...res.payOrderResponses[0] });
        } else {
          reject('没有订单信息');
        }
      });
    });
  };

  /**
   * 确认收款单(合并订单)
   */

  onConfirmCollection = () => {
    let ids = this.state()
      .toJS()
      .orderInfoList.map((item) => item.payOrderId);
    this.onConfirm(ids);
    this.dispatch('receive-record-actor:setCollectionVisible');
  };

  /**
   * 确认收款单
   */
  onConfirm = async (ids) => {
    // let ids = [];
    // ids.push(row.payOrderId);
    const { res } = await webapi.payConfirm(ids);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('确认成功');
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };
}
