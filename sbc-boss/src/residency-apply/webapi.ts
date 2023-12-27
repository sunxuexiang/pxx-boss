import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取申请列表
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getApplyList(params = {}) {
  return Fetch<TResult>('/merchant_registration/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 处理申请信息
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editApply(params = {}) {
  return Fetch<TResult>('/merchant_registration/update', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
