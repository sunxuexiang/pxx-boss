import { Fetch } from 'qmkit';


type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 通过客户ID查询客户详细信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCouponInfo = (couponId: string) => {
  return Fetch<TResult>(`/coupon-info/${couponId}`);
};


/**
 * 查询退款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
 export function fetchcoupRecordList(params = {}) {
  return Fetch<TResult>('/coupon-code/getRecord', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}