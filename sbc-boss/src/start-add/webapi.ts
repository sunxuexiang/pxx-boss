import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取启动页
 */
export const getActivityDetail = (activityId) => {
  return Fetch<TResult>(`/home/page/advertising/get-start-page-by-id`,{
    method: 'POST',
    body: JSON.stringify(activityId)
  });
};

/**
 * 新增启动页
 */
export const addCouponActivity = (params) => {
  return Fetch<TResult>('/home/page/advertising/start-page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改启动页
 */
export const modifyCouponActivity = (params) => {
  return Fetch<TResult>('/home/page/advertising/start-page', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查询活动（注册赠券活动、进店赠券活动）不可用的时间范围
 */
export const queryActivityEnableTime = (activityId) => {
  return Fetch<TResult>(
    `/home/page/advertising/get-by-id/${activityId}`
  );
};
