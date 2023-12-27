import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      total: 0,
      // 每页显示条数
      pageSize: 10,
      // 当前页的数据列表
      dataList: [],
      // 当前页码
      current: 1,
      // 数据是否正在加载中
      loading: true,
      // 搜索项信息
      searchData: {
        roomName: '',
        liveStatus: '',
        // storeName: null,
        // anchorName: null,
        startTime: null,
        endTime: null
      },
      // 设置勾选的id
      checkedIds: [],
      // 弹框是否展示
      visible: false,
      // 新增/编辑的表单信息
      formData: {},
      // 批量导出弹框 modal状态
      exportModalData: {},

      //直播开启状态
      openStatus: false,
      // 卡片式tab页
      currentCardTab: '0',
      // 直播列表tab页
      currentLiveListTab: '-1',
      // // 店铺列表
      // storeName: [],
      liveListGoodsDataList: []
    };
  }

  /**
   * 直播开启状态
   */
  @Action('info:openStatus')
  getOpenStatus(state: IMap, status) {
    return state.set('openStatus', status);
  }

  /**
   * 设置分页数据
   */
  @Action('info:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('total', totalElements)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('info:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('current', current);
  }

  /**
   * 设置loading状态
   */
  @Action('info:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('loading', loading);
  }

  // /**
  //  * 设置新增/编辑弹框是否展示
  //  */
  // @Action('info:setVisible')
  // setVisible(state: IMap, visible) {
  //   return state.set('visible', visible);
  // }

  // /**
  //  * 设置新增/编辑的表单信息
  //  */
  // @Action('info:setFormData')
  // setFormData(state: IMap, data: IMap) {
  //   return state.set('formData', data);
  // }

  // /**
  //  * 修改新增/编辑的表单字段值
  //  */
  // @Action('info:editFormData')
  // editFormData(state: IMap, { key, value }) {
  //   return state.setIn(['formData', key], value);
  // }

  /**
   * 修改搜索项信息
   */
  @Action('info:setSearchData')
  setSearchData(state: IMap, searchData) {
    return state.set('searchData', searchData);
  }

  // /**
  //  * 设置勾选的id
  //  */
  // @Action('info:setCheckedData')
  // setCheckedData(state: IMap, ids) {
  //   return state.set('checkedIds', ids);
  // }

  // /**
  //  * 打开导出弹框 并设置 modal状态
  //  */
  // @Action('info:exportModalShow')
  // exportModalShow(state: IMap, exportModalData: IMap) {
  //   return state.set('exportModalData', exportModalData);
  // }

  // /**
  //  * 关闭导出弹框
  //  */
  // @Action('info:exportModalHide')
  // exportModalHide(state: IMap) {
  //   return state.setIn(['exportModalData', 'visible'], false);
  // }

  /**
   * 切换卡片式tab页
   */
  @Action('change:setCurrentTab')
  setCurrentTab(state: IMap, key) {
    return state.set('currentCardTab', key);
  }

  // /**
  //  * 切换直播列表tab
  //  */
  // @Action('change:setLiveListTab')
  // setLiveListTab(state: IMap, key) {
  //   return state.set('currentLiveListTab', key);
  // }

  // /**
  //  * 设置店铺列表
  //  */
  // @Action('info:setStoreName')
  // setStoreName(state: IMap, storeName) {
  //   return state.set('storeName', storeName);
  // }

  /**
   * 设置直播间商品数据
   */
  @Action('info:setliveListGoodsDataList')
  setliveListGoodsDataList(state: IMap, res: IPageResponse) {
    return state.withMutations((state) => {
      state.set('liveListGoodsDataList', fromJS(res));
    });
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['searchData', key], value);
  }
}
