import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveStreamRoom/getPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 修改/删除
 */
export const modify = (params) => {
  return Fetch<TResult>('/liveStreamRoom/modify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 新增
 */
export const add = (params) => {
  return Fetch<TResult>('/liveStreamRoom/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 查询厂商列表
 */
export const goodsCompanyPages = (params) => {
  return Fetch<TResult>('/goods/goodsCompanyPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 查询品牌
 */
export const goodsBrands = () => {
  // /contract/goods/brand/list
  return Fetch<TResult>('/goods/allGoodsBrands', {
    method: 'GET'
  });
};
/**
 * 分页查询直播账号
 */
export const pageLive = () => {
  return Fetch<TResult>('/customer/pageLive', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 10000
    })
  });
};
// 运营账号列表查询
export const fetchEmployList = (params) => {
  return Fetch<TResult>('/customer/employees', {
    method: 'POST',
    body: JSON.stringify({
      departmentIds: ['7ffffe7c166b82155861305e0030d4af'], //会变更
      pageNum: 0,
      pageSize: 20
    })
  });
};

/**
 * 获取所有商家
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
};

type TResult = {
  code: string;
  message: string;
  context: any;
};
