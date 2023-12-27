import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';
export default class CouponDetailActor extends Actor {
  defaultState() {
    return {
      //选择的标签
      extractStatus: '0',
      searchForm: {
        customerAccount: null,
        customerName: null,
        beginTime: null,
        endTime: null,
        startApplyPrice: null,
        endApplyPrice: null
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      couponList: [],
      isVisible: false,
      selected: [],
      pageRow: fromJS({}),
      selectedRowKeys: [],
      isModalVisible: false,
      Visiblevalue: null,
      TextArearmak: null,
      forms: fromJS({}),
      isServiceVisible: false,
      isFinancialVisible: false,
      confirmLoading: false,
      receivableList: [],
      // 批量导出弹框 modal状态
      exportModalData: {},
      voucherModalVisible: false,
    };
  }

  //  // 备注信息
  //  @Action('TextArearmak')
  //  changeTextArearmak(state, value) {
  //    return state.set('TextArearmak', value);
  //  }

  // 跳窗
  @Action('isModalVisible')
  changeIsModalVisible(state, { isbool, value }) {
    return state.set('isModalVisible', isbool).set('Visiblevalue', value);
  }

  @Action('voucherModalVisible')
  setVoucherModalVisible(state, key) {
    return state.set('voucherModalVisible', key);
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('extractStatus', key);
  }
  @Action('selectedRowKeys: set')
  seTselectedRowKeys(state, key) {
    return state.set('selectedRowKeys', key);
  }

  @Action('search:form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['searchForm', key], value);
  }

  // 按钮的是否loading
  @Action('button: loading')
  setConfirmLoading(state, confirmLoading) {
    return state.set('confirmLoading', confirmLoading)
  }

  @Action('actor: field')
  actorFiledChange(state, { key, value }) {
    return state.set(key, value);
  }

  @Action('init')
  init(state, { couponList, total, pageNum }) {
    return state
      .set('couponList', fromJS(couponList))
      .set('total', total)
      .set('pageNum', pageNum);
  }

  @Action('select:init')
  selectInit(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }

  @Action('modal:isVisible')
  modalIsVisible(state, t) {
    return state.set('isVisible', t.is).set('pageRow', t.item);
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
}
