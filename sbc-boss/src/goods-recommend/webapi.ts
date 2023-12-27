import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询配置
 */
export function getSetting({wareId}) {
  return Fetch<TResult>(`/goodsrecommendsetting/get-setting/${wareId}`);
}

/**
 * 保存
 * @param params
 */
export const save = (params) => {
  return Fetch<TResult>('/goodsrecommendsetting/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

export const saveSort = (params) => {
  return Fetch<TResult>('/sku/modify/recommend/sort', {
    method: 'POST',
    body: JSON.stringify([
      ...params
    ])
  });
};

export const saveStrategy = (params) => {
  return Fetch<TResult>('/goodsrecommendsetting/modifyStrategy', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 仓库列表
 * @param params
 */
 export const wareHousePage = (params) => {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};


export const wareHouseList = (params) => {
  return Fetch<TResult>('/ware/house/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

