import 'whatwg-fetch';
import { Const, Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

export const getTplList = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/tpl/list', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const queryTemplateList = (params) => {
  return fetch(
    Const.X_XITE_ADMIN_HOST + '/xsite-bin/user-tpl-svc/queryTemplateList',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: (window as any).token
      },
      body: JSON.stringify(params)
    }
  ).then((res: any) => {
    return res.json();
  });
};

export const copyPage = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/copy', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const delPage = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/delete', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const setIndex = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/activate/set', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const updateTitle = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/update/title', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

/**
 * 保存静态页内容
 * @param htmlString
 */
export function magicPageSave(htmlString) {
  return Fetch<TResult>('/magic-page/save', {
    method: 'POST',
    body: JSON.stringify({ htmlString })
  });
}

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
