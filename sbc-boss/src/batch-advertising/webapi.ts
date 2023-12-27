import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  context: any;
  message: string;
};



/**
 * 查询启动页列表
 */
 export function ListStart(param) {
  return Fetch<TResult>('/retail/advertising/page', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}
// 修改状态
export function modstart(param) {
  return Fetch<TResult>('/retail/advertising/modify-status', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 删除启动页
export const DeleteStart = (advertisingId) => {
  return Fetch<TResult>('/retail/advertising', {
    method: 'DELETE',
    body: JSON.stringify(advertisingId)
  });
};
