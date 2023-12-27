import { Fetch } from 'qmkit';

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

/**
 * 获取已签署合同列表
 * @param filterParams
 */
export function fetchContractList(filterParams = {}) {
  return Fetch<TResult>('/fadada/viewContractList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 上传凭证
 * @param filterParams
 */
export function uploadContractInfo(filterParams = {}) {
  return Fetch<TResult>('/fadada/uploadContractInfo', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取合同模板列表
 * @param filterParams
 */
export function fetchTemplateList(filterParams = {}) {
  return Fetch<TResult>('/fadada/viewContract', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 修改合同模板状态
 * @param filterParams
 */
export function updateStatus(filterParams = {}) {
  return Fetch<TResult>('/fadada/updateStatus', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 上传合同模板
 * @param filterParams
 */
export function fadadaUpload(filterParams = {}) {
  return Fetch('/fadada/upload', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 删除合同模板
 * @param filterParams
 */
export function delContract(filterParams = {}) {
  return Fetch<TResult>('/fadada/delContract', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 查看合同
 * @param filterParams
 */
export function viewPDF(url) {
  return Fetch<TResult>(`/fadada/viewPDF?url=${url}`, {
    method: 'GET'
  });
}

/**
 * 获取招商经理列表
 */
export const fetchManagerList = () => {
  return Fetch<TResult>('/customer/employee/list-cm-manager', {
    method: 'GET'
  });
};

/**
 * 下载合同照片
 */
export const downLoadImg = (userContractId) => {
  return Fetch<TResult>(`/fadada/downLoadImg/${userContractId}`, {
    method: 'GET'
  });
};

/**
 * 获取批发市场列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getMarketData(params = {}) {
  return Fetch<TResult>('/company/into-mall/mall-market/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
