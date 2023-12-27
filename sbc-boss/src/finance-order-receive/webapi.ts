import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 查询收款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchPayOrderList(params = {}) {
  return Fetch('/account/payOrders', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/pile/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason,
      financialFlag: true
    })
  });
};



/**
 * 审核 合并订单
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
 export const auditIds = (param={}) => {
  return Fetch<TResult>(`/trade/audit`, {
    method: 'POST',
    body: JSON.stringify({...param
    })
  });
};

/**
 * 审核--囤货--驳回
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
 export const newAudit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/pile/trade/newAudit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason,
      financialFlag: true
    })
  });
};

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const auditcart_ = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason,
      financialFlag: true
    })
  });
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

/**
 * 查询商家账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function offlineAccounts() {
  return Fetch<TResult>('/account/offlineAccounts');
}

/**
 * 批量确认(合单)
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function confirmIds(payOrderIds:[]) {
  return Fetch<TResult>('/account/offlineConfirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
 export function confirm(payOrderIds: string[], realPay) {
  return Fetch<TResult>('/account/offlineConfirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: [
        {
          payOrderId: payOrderIds,
          realPay: realPay
        }
      ]
    })
  });
}


/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
// export function confirm(payOrderIds: string[],realPay) {
//   return Fetch<TResult>('/account/confirm', {
//     method: 'POST',
//     body: JSON.stringify({
//       payOrderIds: payOrderIds
//     })
//   });
// }

/**
 * 批量确认
 * @param  payOrderId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
//  export function th_confirm(payOrderIds: string[],realPay) {
//   return Fetch<TResult>('/account/pile/confirm', {
//     method: 'POST',
//     body: JSON.stringify({
//       payOrderIds: payOrderIds,
//     })
//   });
// }

// /**
//  * 批量确认
//  * @param  payOrderId
//  * @returns {Promise<IAsyncResult<TResult>>}
//  */
export function th_confirm(payOrderIds: string[], realPay) {
  return Fetch<TResult>('/account/pile/offlineConfirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: [
        {
          payOrderId: payOrderIds,
          realPay: realPay
        }
      ]
    })
  });
}

/**
 * 囤货确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function newOfflineConfirm(payOrderIds: string[], realPay) {
  return Fetch<TResult>('/account/newOfflineConfirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: [
        {
          payOrderId: payOrderIds,
          realPay: realPay
        }
      ]
    })
  });
}


/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function destory(payOrderIds: string[]) {
  return Fetch<TResult>('/account/payOrder/destory', {
    method: 'PUT',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

/**
 * 查询用户收款账号
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAccountsByCustomerId(customerId: string) {
  return Fetch(`/customer/accountList/${customerId}`);
}

/**
 * 新增收款单
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addReceivable(receivableForm: any) {
  return Fetch<TResult>('/account/receivable', {
    method: 'POST',
    body: JSON.stringify(receivableForm)
  });
}

/**
 * 验证
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyAfterProcessing = (tid: string) => {
  return Fetch<TResult>(`/return/find-all/${tid}`);
};
