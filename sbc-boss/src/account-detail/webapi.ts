import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 分页查询钱包账户余额列表信息
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function accountPage(params = {}) {
  return Fetch<TResult>('/boss/walletRecord/walletRecord', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
