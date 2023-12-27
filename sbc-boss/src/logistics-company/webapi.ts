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
  return Fetch<TResult>('/marketLogistics/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/marketLogistics/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/marketLogistics/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/marketLogistics/${id}`, {
    method: 'DELETE'
  });
}
