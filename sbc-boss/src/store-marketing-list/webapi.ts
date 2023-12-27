import { Fetch } from 'qmkit';
import 'whatwg-fetch';
/**
 * 获取营销列表
 * @param filterParams
 */
export function fetchList(filterParams = {}) {
  return Fetch<TResult>('/marketing/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 终止营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const onTermination = (marketingId) => {
  return Fetch<TResult>(`/marketing/termination/${marketingId}`, {
    method: 'PUT'
  });
};

/**
 * 获取所有商家
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
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
