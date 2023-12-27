import { Fetch } from 'qmkit';
import 'whatwg-fetch';
import { Const } from 'qmkit';
/**
 * 获取营销列表
 * @param filterParams
 */
export function fetchList(filterParams = {}) {
  return Fetch<TResult>('/coinActivity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 导出
 * @param params
 */

export const exportParams = (params) => {
  return fetch(Const.HOST + '/coinActivity/export', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(params)
  })
    .then((res: any) => {
      console.log(res);
      return res.blob();
    })
    .catch((err) => {
      return err;
    });
};

export const exportDetail = (params) => {
  return fetch(Const.HOST + '/coinActivity/export/detail', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(params)
  })
    .then((res: any) => {
      console.log(res);
      return res.blob();
    })
    .catch((err) => {
      return err;
    });
};

/**
 * 获取所有商家
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};
