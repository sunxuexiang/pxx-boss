import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 通过客户ID查询工单
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchWorkDetails = (customerId: string) => {
  return Fetch<TResult>(`/workorder/${customerId}`);
};

/**
 * 通过客户ID查询工单详情
 * @param workOrderId
 * @returns {Promise<Response>}
 */
export const fetchWorkDetailsEdit = (workOrderId: string) => {
  return Fetch<TResult>(`/workorderdetail/${workOrderId}`);
};

/**
 * 通过客户ID查询子工单状态
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomerStatus = (customerId: string) => {
  return Fetch<TResult>(`/workorder/getstatus/${customerId}`);
};

/**
 * 添加子工单
 * @param params
 * @returns {Promise<Response>}
 */
export const saveWorkDetailsEdit = (params) => {
  return Fetch<TResult>('/workorderdetail/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
