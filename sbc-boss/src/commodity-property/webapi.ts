import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取商品属性列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getPropertyData(params = {}) {
  return Fetch<TResult>('/goodsAttribute/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 新增商品属性
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addGoodsAttribute(params = {}) {
  return Fetch<TResult>('/goodsAttribute/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 编辑商品属性
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editGoodsAttribute(params = {}) {
  return Fetch<TResult>('/goodsAttribute/updateAttributeById', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 删除商品属性
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function delGoodsAttribute(params = {}) {
  return Fetch<TResult>('/goodsAttribute/deleteById', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
