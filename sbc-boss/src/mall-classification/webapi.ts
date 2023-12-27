import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取商城分类列表
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getMallData(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-tab/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 新增商城
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addMallData(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-tab/add', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 修改商城信息
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editMallData(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-tab/edit', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
/**
 * 修改商城排序
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
 * 修改商城指定排序
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editAssignSort(params = {}) {
  return Fetch<TResult>('/store/editAssignSort', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取商城下的商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getBusinessByMall(params = {}) {
  return Fetch(
    '/contract/company-mall/into-platform-relation/list-store-by-tab',
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  );
}
/**
 * 修改商家排序
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function sortMerchantData(params = {}) {
  return Fetch('/contract/company-mall/into-platform-relation/sort-batch', {
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
 * 获取配送方式
 * @returns Promise<IAsyncResult<T>>
 */
export function getDDeliverWayList() {
  return Fetch('/freighttemplatedeliveryarea/queryDDeliverWayList', {
    method: 'GET'
  });
}
