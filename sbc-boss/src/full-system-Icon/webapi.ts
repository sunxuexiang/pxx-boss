import { Fetch } from 'qmkit';
import { TResult } from 'typings/global';

/**
 * 查询列表
 * @param {{}} params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchSensitiveWordsList() {
  return Fetch<TResult>('/reduced/config/get', {
    method: 'GET'
  });
}

/**
 * 编辑
 * @param sensitiveWords
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function editSensitiveWords(sensitiveWords) {
  return Fetch<TResult>('/reduced/config/add', {
    method: 'POST',
    body: JSON.stringify(sensitiveWords)
  });
}
