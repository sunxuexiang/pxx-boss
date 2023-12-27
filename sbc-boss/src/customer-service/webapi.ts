import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取登录签名
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getLoginSignature(params) {
  return Fetch<TResult>('/tencentImService/tencentIm/userSig', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
