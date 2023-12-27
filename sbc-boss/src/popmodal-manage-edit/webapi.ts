import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 查询列表
 * @param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchList(params = {}) {
  return Fetch('/popup_administration/page_management_popup_administration', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
/**
 * 排序
 * @param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function sortLabel(params = []) {
  return Fetch('/popup_administration/sort_popup_administration', {
    method: 'POST',
    body: JSON.stringify([...params])
  });
}

/**
 * 验证
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyAfterProcessing = (tid: string) => {
  return Fetch<TResult>(`/return/find-all/${tid}`);
};
