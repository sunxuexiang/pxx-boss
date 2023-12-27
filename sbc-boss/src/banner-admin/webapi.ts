import { Fetch } from 'qmkit';

type TResult = {
  context: any;
  code: string;
  message: string;
};

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/banneradmin/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/banneradmin/${id}`, {
    method: 'GET'
  });
}

export function getOneCate() {
  return Fetch<TResult>('/goods/goodsCatesTree', {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/banneradmin/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/banneradmin/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 隐藏/显示
 */
export function modifyStatus(param) {
  return Fetch<TResult>('/banneradmin/modifyStatus', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/banneradmin/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/banneradmin/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}
