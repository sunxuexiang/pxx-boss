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
  return Fetch<TResult>('/retail/advertising/page', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}
// 修改状态
export function modstart(param) {
  return Fetch<TResult>('/retail/advertising/modify-status', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 删除启动页
export const DeleteStart = (advertisingId) => {
  return Fetch<TResult>('/retail/advertising', {
    method: 'DELETE',
    body: JSON.stringify(advertisingId)
  });
};




/**
 * 修改散批广告位信息
 */
export function advertising(set) {
  return Fetch<TResult>('/retail/advertising', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}

// 校验分类ID/商品erp编码是否有效
export function cateIdOrErpGoodsInfoNo(param) {
  return Fetch<TResult>('/retail/advertising/check/cateIdOrErpGoodsInfoNo', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 添加散批
export function saveStart(param) {
  return Fetch<TResult>('/retail/advertising', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 通过id获取散批广告位详情信息
export function getById(param) {
  return Fetch<TResult>('/retail/advertising/get-by-id', {
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

/**
 * 查询全部分类
 */
export const fetchCates = () => {
  return Fetch('/goods/goodsCatesTree');
};
