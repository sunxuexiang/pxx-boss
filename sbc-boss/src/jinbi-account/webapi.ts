import { Fetch } from 'qmkit';
import 'whatwg-fetch';
/**
 * 获取账户列表
 * @param filterParams
 */
export const fetchUserList = (filterParams = {}) => {
  return Fetch<TResult>('/pay/userStoreList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 获取余额信息
 * @param filterParams
 */
export const fetchMoneyInfo = (filterParams = {}) => {
  return Fetch<TResult>('/pay/queryWalletMoney', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

const mockFetch = async (data) => {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 50);
  });
  return { res };
};
