import { Fetch } from 'qmkit';
import { TResult } from 'typings/global';

/**
 * 查询列表
 */
export function getList(params) {
  return Fetch<TResult>('/goodslabel/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/goodslabel/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/goodslabel/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/goodslabel/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/goodslabel/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/goodslabel/modify-sort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};
