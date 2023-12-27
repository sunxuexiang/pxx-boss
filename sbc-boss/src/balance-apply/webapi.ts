import { Fetch } from 'qmkit';
import Axios from 'axios';

type TResult = {
  code: string;
  context: any;
  message: string;
};

/**
 * 获取申请列表
 */
export function couponList(params) {
  return Fetch<TResult>('/ticketsForm/ticketsFormAllList', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

// 查询所有有效的线下账户
export const fetchAllOfflineAccounts = () => {
  return Fetch('/account/findAllPayWithDrawAccount');
};

// 客服提现审核 通过
export function ticketsFormAdopt(params) {
  return Fetch<TResult>('/ticketsForm/adopt', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

// 客服提现审核 不通过
export function ticketsFormReject(params) {
  return Fetch<TResult>('/ticketsForm/reject', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

// 财务提现审核 通过
export function ticketsFormRechargeAdopt(params) {
  return Fetch<TResult>('/ticketsForm/payment', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

// https://bossbff.test.7yaya.cn/ticketsForm/updateImgAfterReject
// 修改上传凭证
export function updateImgAfterReject(params) {
  return Fetch<TResult>('/ticketsForm/updateImgAfterReject', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

// export function uploadImg () {
//   return Fetch<TResult>('https://bossbff.test.7yaya.cn/uploadResource?resourceType=IMAGE', {
//     method: 'POST', https://bossbff.cjdbj.cn/uploadResource

//   })
// }

// 上传图片接口
export function uploadImg(data) {
  return Axios({
    baseURL: 'https://bossbff.cjdbj.cn/',
    url: '/uploadResource?resourceType=IMAGE',
    method: 'POST',
    data: data,
    headers: {
      Accept: 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    }
  });
}

// // 财务提现审核 不通过
// export function ticketsFormRechargeRejec(params) {
//   return Fetch<TResult>('/ticketsForm/rechargeReject',{
//     method: 'POST',
//     body: JSON.stringify({...params})
//   })
// }

// ------

// // 拒绝打款拒绝审核
// export function cancepayment(params) {
//   return Fetch<TResult>('/ticketsForm/reject',{
//     method: 'POST',
//     body: JSON.stringify({...params})
//   })
// }
// /**
//  * 打款
//  */
//  export function payment(params) {
//   return Fetch<TResult>('/ticketsForm/payment', {
//     method: 'POST',
//     body: JSON.stringify({
//       ...params
//     })
//   });
// }

// /**
//  * 审核
//  */
//  export function examine(params) {
//   return Fetch<TResult>('/ticketsForm/adopt', {
//     method: 'POST',
//     body: JSON.stringify({
//       ...params
//     })
//   });
// }

// /**
//  * 删除优惠券
//  */
// export function deleteCoupon(id) {
//   return Fetch<TResult>(`/coupon-info/${id}`, { method: 'DELETE' });
// }

// /**
//  * 复制优惠券
//  */
// export function copyCoupon(id) {
//   return Fetch<TResult>(`/coupon-info/copy/${id}`, { method: 'GET' });
// }
