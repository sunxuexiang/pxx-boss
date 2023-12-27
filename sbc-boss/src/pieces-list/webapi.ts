import { Fetch } from 'qmkit';

/**
 * 获取乡镇列表
 */
export function addressList(params) {
  return Fetch<TResult>('/villages/address/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>(`/villages/address`, { method: 'DELETE',body: JSON.stringify({ids:id}) });
}
