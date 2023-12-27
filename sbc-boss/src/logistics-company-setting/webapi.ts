import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取批发市场列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getMarketData(params = {}) {
  return Fetch<TResult>('/company/into-mall/mall-market/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
