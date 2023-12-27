import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: string;
};

export const getAllMarkets = (params) => {
  return Fetch<TResult>('/company/into-mall/mall-market/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 新增承运商
 * @param params 参数
 * @returns
 */
export const addCarrier = (data = {}, isEdit = false) => {
  return Fetch<TResult>(`/tmsApi/carrier/${isEdit ? 'edit' : 'add'}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

/**
 * 获取承运商列表
 * @param data 参数
 * @returns
 */
export const getCarrierList = (data = {}) => {
  return Fetch<TResult>('/tmsApi/carrier/page', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * 开启和停用承运商
 * @param data 参数
 * @returns
 */
export const editCarrierStatus = (data = {}) => {
  return Fetch<TResult>('/tmsApi/carrier/edit/status', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

/**
 * 保存运费模版
 * @param data 参数
 * @returns
 */
export const saveCarrierFreightTemplate = (data = {}, isEdit = false) => {
  return Fetch<TResult>('/tmsApi/freightTemplate', {
    method: isEdit ? 'PUT' : 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * 查询承运商运费模版列表
 * @param carrierId 运费模版ID
 * @returns
 */
export const carrierFreightTemplateList = (carrierId: string | Number) => {
  return Fetch<TResult>(`/tmsApi/freightTemplate/list?carrierId=${carrierId}`, {
    method: 'GET'
  });
};

/**
 * 编辑承运商运费模版启停状态
 * @param data 参数
 * @returns
 */
export const editCarrierFreightTemplateStatus = (data = {}) => {
  return Fetch<TResult>('/tmsApi/freightTemplate/editStatus', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * 获取承运商自提点
 * @param carrierId 承运商ID
 * @returns Promise<TResult>
 */
export const getPickupList = (data = {}) => {
  return Fetch<TResult>('/tmsApi/site/list', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
