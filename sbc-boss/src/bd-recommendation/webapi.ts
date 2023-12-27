import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  context: any;
  message: string;
};
/**
 * 查询启动页列表
 */
export function ListStart(wareId) {
  return Fetch<TResult>('/bulk/goods/recommend/get-list-by-cache/'+wareId, {
    method: 'POST',
    // body: JSON.stringify({ ...param })
  });
}
// 新增
export function addGoods(param) {
  return Fetch<TResult>('/bulk/goods/recommend', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  })
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
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getCateList = () => {
  return Fetch('/goods/goodsCatesTree', {
    method: 'GET'
  });
};


/**
 * 排序
 */
 export function sort(param) {
  return Fetch<TResult>('/bulk/goods/recommend', {
    method: 'PUT',
    body: JSON.stringify([ ...param ])
  });
}
/**
 * 删除
 */
 export function deleterecommend(param) {
  return Fetch<TResult>('/bulk/goods/recommend', {
    method: 'DELETE',
    body: JSON.stringify({ ...param })
  });
}