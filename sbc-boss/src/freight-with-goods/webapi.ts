import { Fetch } from 'qmkit';

/**
 * 根据运费模板id查询商品列表
 * @param params
 */
export const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/goods/spus', request);
};

/**
 * 查询店铺运费模板
 * @param params
 */
export const freightList = () => {
  return Fetch<TResult>('/freightTemplate/freightTemplateGoods');
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
export const goodsFreight = (freightTempId) => {
  return Fetch<TResult>(
    `/freightTemplate/freightTemplateGoods/${freightTempId}`
  );
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
export const goodsFreightExpress = (freightTempId) => {
  return Fetch<TResult>(
    `/freightTemplate/freightTemplateExpress/${freightTempId}`
  );
};

/**
 * 编辑运费模板(批量)
 */
export const updateFreight = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/freight', request);
};
