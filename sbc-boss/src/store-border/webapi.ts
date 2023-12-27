import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取店招边框列表
 */
export function fetchImages() {
  return Fetch<TResult>('/store-border-image/list', {
    method: 'POST'
  });
}

/**
 * 保存店招边框列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const saveImages = (params) => {
  return Fetch<TResult>('/store-border-image/batch-edit', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
