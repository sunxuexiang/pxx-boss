import { Fetch } from 'qmkit';

export const fetchWorkDetailsEdit = (workOrderId: string) => {
  return Fetch<TResult>(`/workorderdetail/${workOrderId}`);
};
/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/workorder/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/workorder/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/workorder/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/workorder/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/workorder/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/workorder/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ workOrderIdList: idList })
  });
}

/**
 * 合并账号
 */
export function mergeAccount(param) {
  return Fetch<TResult>('/workorderdetail/mergeAccount', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
