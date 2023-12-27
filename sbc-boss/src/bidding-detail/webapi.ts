import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/bidding/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/bidding/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/bidding/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/bidding/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/bidding/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/bidding/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ biddingIdList: idList })
  });
}

/**
 * 判断sku是否已经存在于其他竞价活动中
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuExistsInBidding = (params) => {
  return Fetch<TResult>('/marketing/sku/exists', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 判断sku是否已经存在于其他竞价活动中
 * @returns {Promise<IAsyncResult<T>>}
 */
export const validateGoods = (params) => {
  return Fetch<TResult>('/bidding//validate/sku', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 判断sku是否已经存在于其他竞价活动中
 * @returns {Promise<IAsyncResult<T>>}
 */
export const validateKeywords = (params) => {
  return Fetch<TResult>('/bidding//validate/keywords', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/goods/goodsCates');
};
