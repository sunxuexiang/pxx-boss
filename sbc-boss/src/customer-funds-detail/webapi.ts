import { Fetch } from 'qmkit';

/**
 * 根据会员ID查询会员资金信息
 * @param {string} customerFundsId 会员资金ID
 * @returns {Promise<IAsyncResult<any>>}
 */
export const getFundsStatistics = (customerId: string) => {
  return Fetch(`/boss/wallet/getBalanceByCustomerId/${customerId}`, {
    method: 'GET'
  });
};

/**
 * 获取余额明细分页列表
 */
export const getFundsDetailList = (filterParams = {}) => {
  return Fetch('/boss/walletRecord/queryPgWalletRecord', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 获取鲸币明细详情
 */
export const getRecordDetail = (orderId: string) => {
  return Fetch(`/coinActivity/record/${orderId}`, {
    method: 'GET'
  });
};
