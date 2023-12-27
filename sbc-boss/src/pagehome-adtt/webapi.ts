import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取首页列表
 */
export function couponList(params) {
  return Fetch<TResult>('/home/page/advertising/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 仓库列表
 * @param params
 */
 export const wareHousePage = (params) => {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};


/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>(`/home/page/advertising`, { method: 'DELETE',body: JSON.stringify({advertisingId:id}) });
}

/**
 * 复制优惠券
 */
export function copyCoupon(id) {
  return Fetch<TResult>(`/coupon-info/copy/${id}`, { method: 'GET' });
}
