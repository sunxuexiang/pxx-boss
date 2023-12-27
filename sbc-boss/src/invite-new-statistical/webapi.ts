import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};




/**
 * 查询邀新记录
 * @param params
 */
export const fetchInviteNewRecordList = (params) => {
  return Fetch<TResult>('/invitation/customer/countPage', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 详情
 * @param params
 */
 export const invitationCustomerPage = (params) => {
  return Fetch<TResult>('/invitation/customer/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
