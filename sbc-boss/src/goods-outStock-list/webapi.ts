import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/stockoutmanage/getOperationPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/goods/goodsCates');
};

/**
 * 根据id删除竞价配Hi
 * @param biddingId
 */
export const deleteById = (biddingId) => {
  return Fetch<TResult>(`/bidding/${biddingId}`, {
    method: 'DELETE'
  });
};

/**
 * 仓库列表
 * @param params
 */
export const wareHousePage = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params })
  };
  return Fetch<TResult>('/ware/house/page', request);
};

/**
 * 类目列表
 *
 */
export const goodsCatesTree = () => {
  return Fetch<TResult>('/goods/goodsCatesTree', {
    method: 'GET'
  });
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
};
