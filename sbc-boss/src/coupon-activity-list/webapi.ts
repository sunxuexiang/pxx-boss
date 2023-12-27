import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取活动列表
 */
export function activityList(params) {
  return Fetch<TResult>('/coupon-activity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 获取活动列表（商家）
 */
export function storeActivityList(params) {
  return Fetch<TResult>('/coupon-activity/supplier/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 获取所有商家
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
};

/**
 * 开始活动
 */
export function startActivity(id) {
  return Fetch<TResult>(`/coupon-activity/start/${id}`, { method: 'PUT' });
}

/**
 * 暂停活动
 */
export function pauseActivity(id) {
  return Fetch<TResult>(`/coupon-activity/pause/${id}`, { method: 'PUT' });
}

/**
 * 删除活动
 */
export function deleteActivity(id) {
  return Fetch<TResult>(`/coupon-activity/${id}`, { method: 'DELETE' });
}

/**
 * 获取平台客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/customer/levellist', {
    method: 'GET'
  });
};
