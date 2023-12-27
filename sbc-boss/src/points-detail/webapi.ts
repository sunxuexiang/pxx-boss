import { Fetch } from 'qmkit';

/**
 * 积分详情
 */
export function pointDetailList(params) {
  return Fetch<TResult>('/customer/points/pageDetail', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

export function userInfo(customerId: string) {
  return Fetch(`/customer/${customerId}`);
}

/**
 * 会员积分修改
 */
export function updatePoints(params) {
  return Fetch<TResult>('/customer/points/updatePointsByAdmin', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
