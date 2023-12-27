import { Fetch } from 'qmkit';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/trade/bossPage', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 批量审核
 * @param ids
 * @returns {Promise<IAsyncResult<T>>}
 */
export const batchAudit = (ids) => {
  return Fetch<TResult>('/trade/audit/CHECKED', {
    method: 'POST',
    body: JSON.stringify({
      ids
    })
  });
};

/**
 * 仓库列表
 * @param params
 */
 export const wareHousePage = (params) => {
  return Fetch<TResult>('/ware/house/new/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};


/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (tid: string, audit: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}/${audit}`);
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/trade/retrial/${tid}`);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/trade/confirm/${tid}`);
};

/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/trade/deliver/verify/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};
