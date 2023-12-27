import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  context: any;
  message: string;
};
// /**
//  * 查询启动页列表
//  */
// export function ListStart(param) {
//   return Fetch<TResult>('/retail/advertising/page', {
//     method: 'POST',
//     body: JSON.stringify({ ...param })
//   });
// }
// // 修改状态
// export function modstart(param) {
//   return Fetch<TResult>('/retail/advertising/modify-status', {
//     method: 'POST',
//     body: JSON.stringify({ ...param })
//   });
// }

// // 删除启动页
// export const DeleteStart = (advertisingId) => {
//   return Fetch<TResult>('/retail/advertising', {
//     method: 'DELETE',
//     body: JSON.stringify(advertisingId)
//   });
// };




/**
 * 修改爆款时刻
 */
export function advertising(set) {
  return Fetch<TResult>('/hot/style/moments', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}

// 校验活动时间是否重复（新增、修改都需要校验）
export function momentsCheckTime(param) {
  return Fetch<TResult>('/hot/style/moments/check-time', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 新增爆款时刻
export function saveStart(param) {
  return Fetch<TResult>('/hot/style/moments', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 通过id获取爆款时刻信息
export function getById(param) {
  return Fetch<TResult>('/hot/style/moments/get-by-id', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 通过id获取散批商品信息信息
export function goodsSkus(param) {
  return Fetch<TResult>('/boss/retail/goods/skus', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// /**
//  * 查询全部分类
//  */
// export const fetchCates = () => {
//   return Fetch('/goods/goodsCatesTree');
// };
