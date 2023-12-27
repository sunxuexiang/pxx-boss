import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取活动列表
 */
export function pileActivityPage(params) {
  return Fetch<TResult>('/bossPileActivity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 关闭活动
 * @returns {Promise<IAsyncResult<T>>}
 */
export const pileActivityClose = (reductionBean) => {
  return Fetch<TResult>('/bossPileActivity/close/' + reductionBean.id, {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 删除活动
 * @returns {Promise<IAsyncResult<T>>}
 */
export const deleteActivity = (reductionBean) => {
  return Fetch<TResult>('/bossPileActivity/delete/' + reductionBean.id, {
    method: 'DELETE',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 获取所有商家
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
};
