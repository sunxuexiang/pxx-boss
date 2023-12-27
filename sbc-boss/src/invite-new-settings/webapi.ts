import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};




/** 详情
 * 
 * @param params
 */
 export const invitationGetConfig = () => {
  return Fetch<TResult>('/invitation/getConfig', {
    method: 'GET',
  });
};

/**
 * 保存
 * @param params
 */
 export const invitationSaveConfig = (params) => {
  return Fetch<TResult>('/invitation/saveConfig', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};




