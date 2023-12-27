import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  context: any;
  message: string;
};
/**
 * 查询启动页列表
 */
export function ListStart(param) {
  return Fetch<TResult>('/retail/goods/recommend/get-list-by-cache', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}
// 新增
export function addGoods(param) {
  return Fetch<TResult>('/retail/goods/recommend', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  })
}

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
// export const getCateList = () => {
//   return Fetch('/goods/goodsCatesTree', {
//     method: 'GET'
//   });
// };

/**
 * 查询商家店铺品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const fetchBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 排序
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const sort = (data) => {
  return Fetch('/retail/goods/recommend', {
    method: 'PUT',
    body:JSON.stringify(data)
  });
};