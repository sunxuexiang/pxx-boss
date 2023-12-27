import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 当前页的数据列表
      dataList: [],
      // 数据是否正在加载中
      loading: true,
      // 搜索项信息
      searchData: {},
      // 弹框是否展示
      visible: false,
      // 新增/编辑的表单信息
      formData: {
        visible: 0,
        image: ''
      }
    };
  }

  /**
   * 设置列表数据
   */
  @Action('info:setPageData')
  setPageData(state: IMap, data) {
    return state.set('dataList', fromJS(data));
  }

  /**
   * 设置loading状态
   */
  @Action('info:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('loading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('info:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('visible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('info:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('formData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('info:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['formData', key], value);
  }

  /**
   * 修改搜索项信息
   */
  @Action('info:setSearchData')
  setSearchData(state: IMap, searchData) {
    return state.set('searchData', searchData);
  }
}
