import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IList, IMap } from 'typings/globalType';

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
        workingState:null,
        customerAccount: '',//直播账号
        hostName:'',//主播姓名
        contactPhone:'',//联系方式
      },
      // 设置勾选的id
      checkedIds: [],
      // 弹框是否展示
      visible: false,
      // 直播账号分类
      couponCates: [],
      // 新增/编辑的表单信息
      formData: {
        hostName:'',//主播姓名
        hostType:0,//主播类型 0 官方 1入驻
        contactPhone:'',//联系方式
        workingState:1,//在职状态 0 离职 1 在职
        accounts:[],//直播账号
        accountName:'',//运营账号
        couponCateIds:[],//选择的直播账号id列表
        couponCateNames:[],//选中的直播账号名字列表
        hostId:0,//主播id
      },
      // 批量导出弹框 modal状态
      exportModalData: {},
      // 分类信息——树形结构
      cateList: [],
      // 分类信息——源数据结构
      sourceCateList: [],
    };
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

  /**
   * 设置勾选的id
   */
  @Action('info:setCheckedData')
  setCheckedData(state: IMap, ids) {
    return state.set('checkedIds', ids);
  }

  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('info:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('exportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('info:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }

  /**
   * 修改搜索的表单字段值
   */
  @Action('info:editSearchFormData')
  editSearchFormData(state: IMap, { key, value }) {
    return state.setIn(['searchData', key], value);
  }
  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['searchData', key], value);
  }
  
  @Action('form-set')
  setFormBut(state: IMap, { keys, value }) {
    return state.setIn(['formData', keys], value);
  }
  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('coupon: info: field: value')
  fieldsValue(state, { field, value }) {
    return state.set(field, fromJS(value));
  }

  /**
   * 初始化分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initCateList')
  initCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList).set('sourceCateList', dataList);
  }
}
