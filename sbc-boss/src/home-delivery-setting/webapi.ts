import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export const fetchhomeDeliverySetting = () => {
  return Fetch('/homedelivery/list');
};

/**
 * 修改配送到家基本信息
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const editHomeDeliverySetting = (params = {}) => {
  return Fetch<TResult>('/homedelivery/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 获取物流配送文案
 * @returns Promise
 */
export const getHomedeliveryDesc = (storeId) => {
  return Fetch<TResult>(`/homedelivery/findFirst/${storeId}`);
};

/**
 * 保存物流配送文案
 * @param data 参数，对象
 * @returns Promise
 */
export const saveHomedeliveryDesc = (data = {}) => {
  return Fetch<TResult>('/homedelivery/modify', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};
