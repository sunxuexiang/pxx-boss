import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: string;
};

// 获取鲸币提现收款账户列表
export const fetchAllOfflineAccounts = () => {
  return Fetch('/payWithDraw/list');
};



// 添加鲸币提现收款账户
export const saveOfflineAccount = (params = {}) => {
  return Fetch<TResult>('/payWithDraw/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};



// 修改鲸币提现收款账户
export const editOfflineAccount = (params = {}) => {
  return Fetch<TResult>('/payWithDraw/update', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

// 删除收款账户
export const deleteOfflineAccount = (withdrawId: string) => {
  return Fetch<TResult>(`/payWithDraw/delete/${withdrawId}`, {
    method: 'DELETE',
    body: JSON.stringify(withdrawId)
  });
};

// 启用或禁用鲸币提现收款账户
export const enableOfflineAccount = (withdrawId: string) => {
  return Fetch<TResult>(`/payWithDraw/enable/${withdrawId}`, {
    method: 'PUT',
    body: JSON.stringify(withdrawId)
  });
};

// // 禁用收款账户
// export const disableOfflineAccount = (accountId: string) => {
//   return Fetch<TResult>(`/account/offline/disable/${accountId}`, {
//     method: 'POST',
//     body: JSON.stringify(accountId)
//   });
// };

// //获取网关详情
// export const getTradeGateWays = () => {
//   return Fetch<TResult>('/tradeManage/gateways');
// };

// //获取网关支付渠道列表
// export const getChannelsByGateWaysId = (gatewayId) => {
//   return Fetch<TResult>('/tradeManage/items/' + gatewayId);
// };

// //保存网关及支付渠道的修改
// export const saveGateWaysDetails = (content) => {
//   return Fetch<TResult>('/tradeManage/save', {
//     method: 'POST',
//     body: JSON.stringify(content)
//   });
// };
