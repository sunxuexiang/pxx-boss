import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商家列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const fetchSupplierList = (params) => {
  return Fetch<TResult>('/company/list', {
    method: 'POST',
    body: JSON.stringify({ ...params, storeType: 1 })
  });
};

/**
 * 启用/禁用 账号
 * @param params
 */
export const switchEmployee = (params) => {
  return Fetch<TResult>('/customer/switch', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 开店/关店
 * @param params
 */
export const switchStore = (params) => {
  return Fetch<TResult>('/store/close', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 获取招商经理列表
 */
export const fetchManagerList = () => {
  return Fetch<TResult>('/customer/employee/list-cm-manager', {
    method: 'GET'
  });
};

/**
 * 设置自营商家
 */
export const editSelfManage = (params) => {
  return Fetch<TResult>('/store/editSelfManage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 重签合同
 */
export const reSignContract = (params) => {
  return Fetch<TResult>('/fadada/re-signContract', {
    method: 'POST',
    body: JSON.stringify(params)
  });
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
 * 导出商家
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function exportStoreList(params = {}) {
  return Fetch<TResult>(
    '/company/list/export',
    {
      method: 'POST',
      body: JSON.stringify(params)
    },
    { isDownload: true }
  );
}
