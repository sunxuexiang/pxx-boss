import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/bidding/page', {
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
