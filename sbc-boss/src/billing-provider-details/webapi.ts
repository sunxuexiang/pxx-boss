import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取结算明细列表
 * @param settleId
 * @return {Promise<IAsyncResult<TResult>>}
 */
export function fetchSettlementDetailList(settleId) {
  return Fetch<TResult>(`/finance/provider/settlement/detail/list/${settleId}`, {
    method: 'GET'
  });
}

/**
 * 更改结算单状态
 * @param settleIdArray
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getSettlementById(settleId) {
  return Fetch<TResult>(`/finance/provider/settlement/${settleId}`, {
    method: 'GET'
  });
}

/**
 * 更改结算单状态
 * @param settleIdArray
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function changeSettleStatus(
  settleIdList: Array<number>,
  status: number
) {
  return Fetch<TResult>('/finance/provider/settlement/status', {
    method: 'PUT',
    body: JSON.stringify({
      settleIdList,
      status
    })
  });
}
