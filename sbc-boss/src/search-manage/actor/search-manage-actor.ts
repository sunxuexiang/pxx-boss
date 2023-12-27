import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      presetform: [],
      searchModalVisible: false,
      presetModalVisible: false,
      associationModalVisible: false,
      popularModalVisible: false,
      isAdd: true,
      searchFormData: {},
      associationFormData: {
        longTailWordList: [], //长尾词
        searchTerms: '', //搜索词
        associationalWord: '' //联想词
      },
      popularFormData: {},
      associationList: [], //联想词列表
      popularList: [], //热搜列表
      linkHrefPath: [],
      // 移动端落地页
      dataInfo: {
        // 商品
        linkKey: 'goodsList',
        info: {}
      },
      platform: 'weixin',
      // PC端落地页
      dataInfoPC: {
        // 商品
        linkKey: 'goodsList',
        target: false,
        info: {}
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      // 当前页数，从1开始
      currentPage: 1
    };
  }

  /**
   * 初始化
   * @param state
   * @param info
   * @returns {Map<K, V>}
   */
  @Action('presetform:init')
  init(state: IMap, info) {
    return state.set('presetform', fromJS(info || []));
  }

  /**
   * 热门搜索词初始化
   * @param state
   * @param info
   * @returns {Map<K, V>}
   */
  @Action('papular:init')
  papularInit(state: IMap, info) {
    return state.set('popularList', fromJS(info || []));
  }

  /**
   * 搜索词初始化
   * @param state
   * @param info
   * @returns {Map<K, V>}
   */
  @Action('association:init')
  associationInit(state: IMap, info) {
    const { searchAssociationalWordPage } = info;

    return state.withMutations((state) => {
      state
        .set('total', searchAssociationalWordPage.total || 0)
        .set('associationList', fromJS(info || {}));
    });

    // return state.set('associationList', fromJS(info || []));
  }

  /**
   * 显示搜索词弹窗
   */
  @Action('association: presetModal')
  showPresetModal(state: IMap, isAdd: boolean) {
    const visible = !state.get('presetModalVisible');
    if (!visible) {
      state = state.set('searchFormData', Map({}));
    }
    state = state.set('isAdd', isAdd);
    return state.set('presetModalVisible', visible);
  }

  /**
   * 显示搜索词弹窗
   */
  @Action('association: searchModal')
  showSearchModal(state: IMap, isAdd: boolean) {
    const visible = !state.get('searchModalVisible');
    if (!visible) {
      state = state.set('searchFormData', Map({}));
    }
    state = state.set('isAdd', isAdd);
    return state.set('searchModalVisible', visible);
  }

  /**
   * 显示热搜词弹窗
   */
  @Action('association: popularModal')
  showPopularModal(state: IMap, isAdd: boolean) {
    const visible = !state.get('popularModalVisible');
    if (!visible) {
      state = state.set('popularFormData', Map({}));
    }
    state = state.set('isAdd', isAdd);
    return state.set('popularModalVisible', visible);
  }

  /**
   * 显示热搜词弹窗
   */
  @Action('association: platform')
  setPlatform(state: IMap, platform: string) {
    return state.set('platform', platform);
  }

  /**
   * 热搜词修改表单内容
   */
  @Action('association: editSearchFormData')
  editSearchFormInfo(state: IMap, data: IMap) {
    return state.update('searchFormData', (formData) => formData.merge(data));
  }

  /**
   * 搜索词修改表单内容
   */
  @Action('association: editPopularFormData')
  editPopularFormInfo(state: IMap, data: IMap) {
    return state.update('popularFormData', (formData) => formData.merge(data));
  }

  /**
   * 显示联想词弹窗
   */
  @Action('association: associationModal')
  show(state: IMap, isAdd: boolean) {
    const visible = !state.get('associationModalVisible');
    if (!visible) {
      state = state.set('associationFormData', Map({}));
    }
    state = state.set('isAdd', isAdd);
    return state.set('associationModalVisible', visible);
  }

  /**
   * 联想词修改表单内容
   */
  @Action('association: editAssociationFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('associationFormData', (formData) =>
      formData.merge(fromJS(data))
    );
  }

  @Action('set:state')
  setState(state, { field, value }) {
    if (field == 'dataInfo') {
      return state.update('dataInfo', (dataInfo) =>
        dataInfo.merge(fromJS(value))
      );
    } else if (field === 'dataInfoPC') {
      return state.update('dataInfoPC', (dataInfo) =>
        dataInfo.merge(fromJS(value))
      );
    } else {
      return state.set(field, fromJS(value));
    }
  }

  @Action('association:page')
  page(state: IMap, page: IMap) {
    return state
      .set('currentPage', page.get('currentPage'))
      .set('pageSize', page.get('pageSize'));
  }
}
