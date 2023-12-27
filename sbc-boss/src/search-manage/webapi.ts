import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

//预置搜索词列表
export const fetchPresupposition = () => {
  return Fetch('/preset_search_terms/list', {
    method: 'POST'
  });
};

//热门搜索词列表
export const fetchPapular = () => {
  return Fetch('/popular_search_terms/list', {
    method: 'POST'
  });
};

//预置词查询
export const fetchPreset = () => {
  return Fetch('/preset_search_terms/list', {
    method: 'POST'
  });
};

/**
 * 修改预置词
 */
export const changePresetInfo = (params: object) => {
  return Fetch('/preset_search_terms/modifyName', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 添加预置词
 */
export const savePresetInfo = (params: object) => {
  return Fetch('/preset_search_terms/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 *
 * @param params
 * 修改预置词
 */
export const editPresetInfo = (params: object) => {
  return Fetch('/preset_search_terms/modify', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

//添加热门搜索词
export const addPopular = (params = {}) => {
  return Fetch<TResult>('/popular_search_terms/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

//修改热门搜索词
export const updatePopular = (params = {}) => {
  return Fetch<TResult>('/popular_search_terms/modify', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

//删除热门搜索词
export const deletePreset = (params = {}) => {
  return Fetch<TResult>('/preset_search_terms/delete', {
    method: 'DELETE',
    body: JSON.stringify({
      ...params
    })
  });
};

//删除热门搜索词
export const deletePopular = (params = {}) => {
  return Fetch<TResult>('/popular_search_terms/delete', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

//联想词列表
export const fetchAssociation = (filter = {}) => {
  return Fetch('/search_associational_word/page', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};
/**
 * 联想词拖拽排序
 */
export const associationDragSort = (param) => {
  return Fetch('/search_associational_word/sort_associational_word', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 删除联想词
 */
export const deleteAssociation = (param) => {
  return Fetch(
    '/search_associational_word/delete_associational_long_tail_word',
    {
      method: 'POST',
      body: JSON.stringify(param)
    }
  );
};

//新增搜索词
export const addsearchTerms = (param) => {
  return Fetch('/search_associational_word/add', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

//编辑搜索词
export const modifySearchTerms = (param) => {
  return Fetch('/search_associational_word/modify', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

//删除搜索词
export const deleteSearch = (param) => {
  return Fetch('/search_associational_word/delete_search_associational_word', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 搜索词拖拽排序
 */
export const papularDragSort = (param) => {
  return Fetch('/popular_search_terms/sort_popular_search_terms', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

//新增联想词
export const addAssociationTerms = (param) => {
  return Fetch('/search_associational_word/add_associational_word', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

//编辑联想词
export const modifyAssociationTerms = (param) => {
  return Fetch('/search_associational_word/modify_associational_word', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
