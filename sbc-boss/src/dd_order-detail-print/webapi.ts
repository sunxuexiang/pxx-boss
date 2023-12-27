import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export function fetchOrderDetail(tid: string) {
  return Fetch(`/trade/print/${tid}`);
}

// 拣货 /trade/orderPicking/{tid}
export const orderPicking = (tid) => {
  return Fetch(`/trade/orderPicking/${tid}`, {
    method: 'PUT'
  });
};

/**
 * 查询列表
 */
export function getList(params) {
  return Fetch<TResult>('/ware/house/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询打印配置
 */
export const fetchPrintSetting = () => {
  return Fetch<TResult>('/print/config/fetch');
};

/**
 * 打印次数计数
 */
export const setPrintCount = (id) => {
  return Fetch<TResult>(`/trade/print/count/${id}`);
};
