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
  return Fetch<TResult>('/hot/style/moments/get-page', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}
// 提前开始爆款时刻
export function earlytart(param) {
  return Fetch<TResult>('/hot/style/moments/early/start/'+param.hotId, {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}


// 启动或暂停爆款时刻活动（只有进行中的才有启动/暂停按钮）
export function pauseById(param) {
  return Fetch<TResult>('/hot/style/moments/pause-by-id', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}

// 终止（只有进行中的才有按钮）
export function terminationById(param) {
  return Fetch<TResult>('/hot/style/moments/termination-by-id', {
    method: 'POST',
    body: JSON.stringify({ ...param })
  });
}



/**
 * 修改爆款时刻修改状态
 */
 export function advertising(set) {
  return Fetch<TResult>('/hot/style/moments', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}

// 删除启动页
export const DeleteStart = (advertisingId) => {
  return Fetch<TResult>('/hot/style/moments', {
    method: 'DELETE',
    body: JSON.stringify(advertisingId)
  });
};
