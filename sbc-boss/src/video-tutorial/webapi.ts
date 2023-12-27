import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取列表
 */
export const getCateList = (params = {}) => {
  // return Fetch('/roleMenuFunc/otherMenus');
  return Fetch('/videoResourceCateManager/video/resourceCates', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 分页获取视频列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchVideos(params = {}) {
  return Fetch('/videoResourceManager/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 删除
 */
export const deleteVideo = (params: { videoIds: string[] }) => {
  return Fetch('/videoResourceManager/resource', {
    method: 'DELETE',
    body: JSON.stringify({
      resourceIds: params
    })
  });
};

/**
 * 修改
 */
export const updateVideo = (params: {}) => {
  return Fetch('/videoResourceManager/resource', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 新增分类
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addMenu(params = {}) {
  return Fetch<TResult>('/videoResourceCateManager/video/resourceCate', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 删除分类
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function delMenu(cateId) {
  return Fetch<TResult>(
    `/videoResourceCateManager/video/resourceCate/${cateId}`,
    {
      method: 'DELETE'
    }
  );
}

/**
 * 获取上传OSS签名
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getOssToken() {
  return Fetch<TResult>('/videoResourceManager/resource/getOssToken');
}

/**
 * 保存视频上传后信息
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function saveResources(params = {}) {
  return Fetch<TResult>('/videoResourceManager/saveResources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
