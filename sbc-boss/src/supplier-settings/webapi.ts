import { Fetch } from 'qmkit';
import { TResult } from 'typings/global';

/**
 * 获取所有商家列表
 * @param data 参数
 * @returns Promise<TResult>
 */
export function getSupplierList(data = {}) {
  return Fetch<TResult>('/customerServiceRelation/getParentStoreList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取商家的添加的商家列表
 * @param data 参数
 * @returns Promise<TResult>
 */
export function getCustomerServiceRelationList(data = {}) {
  return Fetch<TResult>('/customerServiceRelation/getList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 新增或修改客服关联商家
 * @param data 参数
 * @returns Promise<TResult>
 */
export function addSupplierRelevance(data = {}, isUpdate = false) {
  return Fetch<TResult>(
    `/customerServiceRelation/${isUpdate ? 'update' : 'add'}`,
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  );
}

/**
 * 获取子级店铺列表(已绑定)
 * @param data 查询参数
 * @returns Promise<TResult>
 */
export function queryCustomerRelevanceBindList(data = {}) {
  return Fetch<TResult>('/customerServiceRelation/getChildStoreList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取子级店铺列表(所有)
 * @param data 查询参数
 * @returns Promise<TResult>
 */
export function queryCustomerRelevanceAllList(data = {}) {
  return Fetch<TResult>('/customerServiceRelation/getAllStoreList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 删除关联店铺信息
 * @param storeId 店铺ID
 * @returns Promise<TResult>
 */
export function deleteCustomerServiceRelation(storeId) {
  return Fetch<TResult>('/customerServiceRelation/delete', {
    method: 'POST',
    body: JSON.stringify({ storeId })
  });
}
