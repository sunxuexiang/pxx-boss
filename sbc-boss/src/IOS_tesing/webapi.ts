import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 版本配置信息列表
 * @param params
 */
 export function iosList(params) {
  return Fetch<any>('/iosAppVersionConfig/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
/**
 * 版本配置信息保存
 * @param params
 */
 export function iosVer_add(params) {
  return Fetch<any>('/iosAppVersionConfig/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}