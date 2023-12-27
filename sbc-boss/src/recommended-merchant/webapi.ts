import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取推荐商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getRecommendMerchant(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-recommend/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取所有商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getMerchantList(params = {}) {
  return Fetch<TResult>('/company/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 添加商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addMerchant(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-recommend/batch-add', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
/**
 * 删除商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function delMerchant(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-recommend/edit', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
/**
 * 修改商家排序
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function sortMarketData(params = {}) {
  return Fetch('/company/into-mall/mall-sort/batch', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 修改商家序号排序单个修改
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editMarketSort(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-recommend/sort-edit', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

// 修改商家手动排序单个修改
export function editAssignSort(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-recommend/edit', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 获取所有店铺
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
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
