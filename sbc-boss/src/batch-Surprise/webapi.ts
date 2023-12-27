import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  context: any;
  message: string;
};
/**
 * 查询启动页列表
 */
export function ListStart() {
  return Fetch<TResult>('/retail/goods/recommend/get-list-by-cache', {
    method: 'POST',
    // body: JSON.stringify({ ...param })
  });
}
// 新增
export function addGoods(param) {
  return Fetch<TResult>('/retail/goods/recommend', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  })
}/**
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
  return Fetch<TResult>('/retail/goods/recommend', {
    method: 'PUT',
    body: JSON.stringify([ ...param ])
  });
}
/**
 * 删除
 */
 export function deleterecommend(param) {
  return Fetch<TResult>('/retail/goods/recommend', {
    method: 'DELETE',
    body: JSON.stringify({ ...param })
  });
}