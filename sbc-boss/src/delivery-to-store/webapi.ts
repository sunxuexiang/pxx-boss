import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 配送规则查询
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function queryDeliveryToStore() {
  return Fetch<TResult>(
    '/freighttemplatedeliveryarea/queryDeliveryToStoreBoss'
  );
}

/**
 * 保存配送规则
 * @param info
 */
export const saveRule = (info) => {
  return Fetch<TResult>('/freighttemplatedeliveryarea/save', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};

/**
 * 保存运费模板
 * @param info
 */
export const saveTemp = (info) => {
  return Fetch<TResult>('/freightTemplate/freightTemplateGoods', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};

/**
 * 查询运费模板
 */
export const fetchTemp = () => {
  return Fetch<TResult>('/freightTemplate/freightTemplateDeliveryToStore');
};

/**
 * 启用/停用运费模板
 */
export const updateTemp = (info) => {
  return Fetch<TResult>('/freightTemplate/updateDefaultFlag', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};

/**
 * 删除运费模板
 */
export const delTemp = (id) => {
  return Fetch<TResult>(
    `/freightTemplate/freightTemplateGoods/updateDelFlag/${id}`,
    {
      method: 'DELETE'
    }
  );
};

/**
 * 查询文案
 * @param info
 */
export const fetchText = () => {
  return Fetch<TResult>('/homedelivery/list');
};

/**
 * 保存文案
 * @param info
 */
export const saveText = (info) => {
  return Fetch<TResult>('/homedelivery/modifyDeliveryToStoreContent', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 查询参与商家
 * @param info
 */
export const fetchStore = () => {
  return Fetch<TResult>(
    '/freighttemplatedeliveryarea/querySupplierUseDeliveryToStore'
  );
};
