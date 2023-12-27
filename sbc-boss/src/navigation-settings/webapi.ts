import { Fetch } from 'qmkit';
import { TResult } from 'typings/global';

/**
 * 查询列表
 * @param {{}} params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchSensitiveWordsList(params = {}) {
  return Fetch<TResult>('/navigationconfig/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 编辑
 * @param sensitiveWords
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function editSensitiveWords(sensitiveWords) {
  return Fetch<TResult>('/navigationconfig/modify', {
    method: 'PUT',
    body: JSON.stringify(sensitiveWords)
  });
}
