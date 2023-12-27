import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 查询收款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function queryOrderSettings(configs) {
  return Fetch<TResult>('/retailDeliveryConfig/getdata', {
    method: 'POST',
    body: JSON.stringify(configs)
  });
}

/**
 * 修改订单设置
 */
export function editOrderSettings(configs) {
  return Fetch<TResult>('/retailDeliveryConfig/modify', {
    method: 'POST',
    body: JSON.stringify(configs)
  });
}
