import { Fetch } from 'qmkit';
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

/**
 * 新增批发市场
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addMarketData(params = {}) {
  return Fetch('/company/into-mall/mall-market/add', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 修改批发市场数据
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editMarketData(params = {}) {
  return Fetch('/company/into-mall/mall-market/edit', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
/**
 * 修改批发市场排序
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function sortMarketData(params = {}) {
  return Fetch('/company/into-mall/mall-sort/edit', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取批发市场商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getMarketMerchant(params = {}) {
  return Fetch(
    '/contract/company-mall/into-platform-relation/list-store-by-market-id',
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  );
}

/**
 * 查找站点（0: 承运商自提点、市场接货点）
 * @param params {siteType: 0 | 1, siteOwnerId: string}
 * @returns Promise<IAsyncResult<T>>
 */
export function findSiteList(params = {}) {
  return Fetch('/tmsApi/site/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 保存站点信息
 * @param params {siteOwnerId: string | number, siteType: 0 | 1, sites: Array}
 * @returns Promise<IAsyncResult<T>>
 */
export function saveSiteList(params = {}) {
  return Fetch('/tmsApi/site/save-batch', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
