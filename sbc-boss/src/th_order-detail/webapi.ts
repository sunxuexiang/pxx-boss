import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';



type TParams = {
  //线下账户
  offLineAccountId: string;
  //支付单id
  payOrderId: string;
  createTime: string;
  //备注
  comment: string;
};


export function fetchOrderDetail(tid: string) {
  return Fetch(`/boss/newPileTrade/${tid}/detail`);
}

// export function fetchOrderDetail(tid: string) {
//   return Fetch(`/pile/trade/${tid}`);
// }

/**
 * 查询订单下的所有收款记录
 * @param orderNo 订单号
 */
 export const payRecord = (orderNo: string) => {
  return Fetch(`/boss/newPileTrade/${orderNo}/payOrder`);
};

/**
 * 查询订单下的所有提货记录
 * @param tid 订单号
 */
 export const pickTrades = (tid: string) => {
  return Fetch(`/boss/newPileTrade/${tid}/pickTrades`);
};

// 退款记录
export const returnIddeta = (orderId: string) => {
  return Fetch(`/trade/manualRefunds/${orderId}/`,{
    method: 'POST',
    body: JSON.stringify({ orderNo:orderId })
  });
};


// ------

export function addPay(params: TParams) {
  return Fetch<{ code: string; message: string }>('/account/receivable', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}



/**
 *查询所有有效的线下账户
 */
type TAccount = {
  accountId: number;
  bankName: string;
  bankNo: string;
};

/**
 * 验证用户是否有该接口权限
 */
export const checkFunctionAuth = (urlPath: string, requestType: string) => {
  return Fetch<TResult>('/check-function-auth', {
    method: 'POST',
    body: JSON.stringify({
      urlPath,
      requestType
    })
  });
};

export function fetchOffLineAccout() {
  return Fetch<[TAccount]>('/account/offlineAccounts');
}

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

export const audit = (tid: string, audit: string) => {
  return Fetch<TResult>(`/pile/trade/audit/${tid}/${audit}`);
};

export const deliver = (tid: string, formData: IMap) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(formData)
  };
  return Fetch<TResult>(`/pile/trade/deliver/${tid}`, request);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/pile/trade/confirm/${tid}`);
};

/**
 * 发货单作废
 * @param tid
 * @param tdId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const obsoleteDeliver = (tid: string, tdId: string) => {
  return Fetch<TResult>(`/pile/trade/deliver/${tid}/void/${tdId}`);
};

/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/pile/trade/deliver/verify/${tid}`);
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/pile/trade/retrial/${tid}`);
};

/**
 * 作废收款记录
 * @param payOrderId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function destroyOrder(payOrderId: string) {
  return Fetch<TResult>(`/account/payOrder/destory/${payOrderId}`, {
    method: 'PUT'
  });
}

/**
 * 修改卖家备注
 */
export const remedySellerRemark = (tid: string, sellerRemark: string) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ sellerRemark })
  };
  return Fetch<TResult>(`/pile/trade/remark/${tid}`, request);
};

/**
 * 验证
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyAfterProcessing = (tid: string) => {
  return Fetch<TResult>(`/pile/return/find-all/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};

/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function payConfirm(payOrderIds: string[]) {
  return Fetch<TResult>('/account/pile/confirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

/**
 * 退款
 * @param param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
 export function manualRefundByOrderCode(param) {
  return Fetch<TResult>('/newPileTrade/manualRefundByOrderCode', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

