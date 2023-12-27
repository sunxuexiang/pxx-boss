import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export const fetchhomeDeliverySetting = (params = {}) => {
  // return Fetch('/wallet/config/getWalletSetting',{
  return Fetch<TResult>('/wallet/config/getWalletSettingByKey', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 修改配送到家基本信息
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const editHomeDeliverySetting = (params = {}) => {
  return Fetch<TResult>('/wallet/config/saveWalletSetting', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
