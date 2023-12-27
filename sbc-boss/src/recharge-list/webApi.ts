import { Fetch } from 'qmkit';

// 获取列表
export function clainmsApplyList(param) {
  return Fetch('/pay/queryPageCustomerWalletSupplier', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

// 获取详情
export function getApplyDetail(param) {
  return Fetch('/pay/getBalanceByStoreId', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 获取所有商家
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllStore = () => {
  return Fetch<TResult>('/store/supplierStoreList');
};

// 充值申请
export const platoToStore = (param) => {
  return Fetch<TResult>('/pay/platoToStore', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

type TResult = {
  code: string;
  message: string;
  context: any;
};
