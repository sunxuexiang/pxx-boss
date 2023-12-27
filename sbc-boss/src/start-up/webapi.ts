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
  return Fetch<TResult>('/home/page/advertising/page/start-page',{
    method: 'POST',
    body: JSON.stringify({...param})
  });
}
// 修改状态
export function modstart(param) {
  return Fetch<TResult>('/home/page/advertising/modify-start-page-status',{
    method: 'POST',
    body:JSON.stringify({...param})
  })
}

// 删除启动页
export const DeleteStart = (advertisingId) => {
  return Fetch<TResult>('/home/page/advertising/del-start-page-by-id',{
    method: 'DELETE',
    body: JSON.stringify(advertisingId)
  })
}
/**
 * 保存微信分享配置
 */
export function saveWxShareInfo(set) {
  return Fetch<TResult>('/third/share/wechat/save', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}
