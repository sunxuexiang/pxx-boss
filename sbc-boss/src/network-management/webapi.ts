import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getPage(params) {
  return Fetch<TResult>('/netWork/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(networkId) {
  return Fetch<TResult>(`/netWork/${networkId}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/netWork/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/netWork/update', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 启用
 */
export function startNetWork(params) {
  return Fetch<TResult>(`/netWork/startNetWork`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 禁用
 */
 export function netWorkDelete(params) {
  return Fetch<TResult>(`/netWork/delete`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/logisticscompany/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}
