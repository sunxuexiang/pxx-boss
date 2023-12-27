import { Fetch } from 'qmkit';

/**
 * 查询隐私政策
 */
export function fetchPrivacyPolicyConfig() {
  return Fetch('/boss/systemprivacypolicy');
}

/**
 * 编辑/保存隐私政策设置
 * @param param
 */
export const setPrivacyPolicyConfig = (param) => {
  return Fetch('/boss/systemprivacypolicy', {
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
