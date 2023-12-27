import { Fetch } from 'qmkit';
import 'whatwg-fetch';
/**
 * 获取账户详情列表
 * @param filterParams
 */
export const fetchList = (filterParams = {}) => {
  return Fetch<TResult>('/pay/queryRecordList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 获取获取账户鲸币余额
 * @param filterParams
 */
export const fetchMoney = (filterParams = {}) => {
  return Fetch<TResult>('/pay/userByWalletId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 获取鲸币赠送/收回详情
 * @param filterParams
 */
export const getApplyDetail = (id) => {
  return Fetch<TResult>(`/claimsApply/getApplyDetail/${id}`, {
    method: 'GET'
  });
};

/**
 * 获取鲸币明细详情
 */
export const getRecordDetail = (orderId: string) => {
  return Fetch(`/coinActivity/record/${orderId}`, {
    method: 'GET'
  });
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};
