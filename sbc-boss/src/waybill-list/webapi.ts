import { Const, Fetch } from 'qmkit';

type TResult = {
  code: string | number;
  msg: string;
  data: any;
};

/**
 * 查询运单列表
 */
export function getPage(params) {
  return Fetch<TResult>('/tmsApi/order/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getPageDetail(id: string) {
  return Fetch<TResult>(`/tmsApi/order/info/${id}`);
}

/**
 * 运单列表导出
 * @param data 导出运单列表
 * @returns Promise
 */
export function exportFile(data = {}) {
  return fetch(`${Const.HOST}/tmsApi/order/export`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      responseType: 'blob',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(data)
  });
}
