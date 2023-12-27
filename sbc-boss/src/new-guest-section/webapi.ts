import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  context: any;
  message: string;
};
/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveHost/getHostPage', {
    method: 'POST',
    body: JSON.stringify(params)
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





/**
 * 根据id删除主播
 * @param biddingId
 */
export const deleteById = (id) => {
  return Fetch<TResult>('/liveHost/hostDelete', {
    method: 'POST',
    body: JSON.stringify({
      hostId:id
    })
  });
};

/**
 * 新增主播
 */
export const hostAdd = (params) => {
  return Fetch<TResult>('/liveHost/hostAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 主播启用
 */
export const hostEnable = (id) => {
  return Fetch<TResult>('/liveHost/hostEnable', {
    method: 'POST',
    body: JSON.stringify({
      hostId:id
    })
  });
};

/**
 * 主播修改
 */
export const hostModify = (info) => {
  return Fetch<TResult>('/liveHost/hostModify', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};

/**
 * 分页查询直播账号
 */
export const pageLive = () => {
  return Fetch<TResult>('/customer/pageLive', {
    method: 'POST',
    body: JSON.stringify({
      pageNum:0,
      pageSize:20000
    })
  });
};


