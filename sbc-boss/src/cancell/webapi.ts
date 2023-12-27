import { Fetch } from 'qmkit';

/**
 * 查询注销政策
 */
export function fetchPrivacyPolicyConfig() {
  return Fetch('/boss/systemcancellationpolicy');
}

/**
 * 编辑/保存注销政策设置
 * @param param
 */
export const setPrivacyPolicyConfig = (param) => {
  return Fetch('/boss/systemcancellationpolicy', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch('/system/resourceCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchImages(params = {}) {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
