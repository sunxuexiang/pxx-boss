import { Fetch } from 'qmkit';

/**
 * 获取营销基础信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchMarketingInfo = (marketingId) => {
  return Fetch<TResult>(`/marketing/${marketingId}`);
};

/**
 * 获取赠品规则
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGiftList = (filterParams = {}) => {
  return Fetch<TResult>('/marketing/fullGift/giftList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
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
