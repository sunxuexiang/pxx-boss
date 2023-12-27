import { Fetch } from 'qmkit';

/**
 * 查询直播列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveroom/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询直播商品库列表
 */
export function getLiveGoodsPage(params) {
  return Fetch<TResult>('/livegoods/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询直播商家列表
 */
export function getLiveCompanyPage(params) {
  return Fetch<TResult>('/livecompany/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/liveroom/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/liveroom/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/liveroom/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/liveroom/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}

/**
 * 直播推荐
 */
export function recommend(info) {
  return Fetch<TResult>('/liveroom/recommend', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 开关直播功能
 */
export function auditLiveSwitch(info) {
  return Fetch<TResult>('/sysconfig/update', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 查询直播功能状态
 */
export function isOpen() {
  return Fetch<TResult>('/sysconfig/isOpen', {
    method: 'GET'
  });
}

/**
 * 直播商品提审
 */
export function goodsAudit(info) {
  return Fetch<TResult>('/livegoods/audit', {
    method: 'POST',
    body: JSON.stringify({ goodsInfoVOList: info })
  });
}

/**
 * 直播商家 审核，驳回，禁用
 */
export function modify(info) {
  return Fetch<TResult>('/livecompany/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 直播商品驳回
 */
export function liveGoodsReject(info) {
  return Fetch<TResult>('/livegoods/status', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}
