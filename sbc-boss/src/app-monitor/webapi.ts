import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询商品类目
 * @returns {Promise<IAsyncResult<T>>}
 *  https://bossbff.test.7yaya.cn/customer/log/page
 */
export const logPage = (params) => {
  return Fetch<TResult>('/customer/log/page', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 查询版本记录
 * https://bossbff.test.7yaya.cn/customer/log/findUpdateRecordByUserNo
 */

export const findUpdateRecordByUserNo = (params) => {
  return Fetch<TResult>('/customer/log/findUpdateRecordByUserNo', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
