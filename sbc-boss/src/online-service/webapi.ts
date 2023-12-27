import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 查询客服设置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerSwitch(storeId) {
  return Fetch<TResult>(`/customerService/qq/switch/${storeId}`);
}

/**
 * 查询客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerList(storeId) {
  return Fetch<TResult>(`/customerService/qq/detail/${storeId}`);
}

/**
 * 保存客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function onSaveOnlineServer(
  qqOnlineServerRop,
  qqOnlineServerItemRopList
) {
  return Fetch<TResult>('/customerService/qq/saveDetail', {
    method: 'POST',
    body: JSON.stringify({
      qqOnlineServerRop: qqOnlineServerRop,
      qqOnlineServerItemRopList: qqOnlineServerItemRopList
    })
  });
}

export function saveAliYun(params) {
  return Fetch<TResult>('/customerService/aliyun/modify', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}
export function saveSobot(params) {
  return Fetch<TResult>('/customerService/sobot/modify', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}
/**
 * 查询IM客服配置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getIMConfig(storeId) {
  return Fetch<TResult>(`/customerService/qq/detail/${storeId}`);
}

/**
 * 保存IM客服配置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveIMConfig(params) {
  return Fetch<TResult>('/customerService/tencentIm/modify', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}
/**
 * 查询IM客服开关
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getImSwitch(params = {}) {
  return Fetch<TResult>('/tencentImService/tencentIm/switch', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

/**
 * 查询IM客服配置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getIMConfigDetail(data = {}) {
  return Fetch<TResult>('/tencentImService/im/detail', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 保存IM配置
 * @param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveIMConfigDetail(data) {
  return Fetch<TResult>('/tencentImService/tencentIm/saveDetail', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
/**
 * 获取所有员工列表
 * @param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getAllEmployees(data = {}) {
  // return Fetch<TResult>('/customer/boss/allEmployees');
  return Fetch<TResult>('/customer/employees', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 保存客服服务配置
 * @param data 参数 固定默认传参，{companyInfoId: 0, storeId: 0}
 * @returns Promise<TResult>
 */
export function saveCustomerServiceConfig(data = {}) {
  return Fetch<TResult>('/serviceSetting/save', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取客服服务配置
 * @param data 参数 固定默认传参，{companyInfoId: 0, storeId: 0}
 * @returns Promise<TResult>
 */
export function getCustomerServiceConfig(
  data = { companyInfoId: 0, storeId: 0 }
) {
  return Fetch<TResult>('/serviceSetting/getList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
