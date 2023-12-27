import { Action, Actor, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      receivableForm: {
        refundOrderId: '',
        createTime: null,
        comment: '',
        accountName: '',
        offLineAccountId: ''
      },
      refundId: '',
      //用户收款账号
      selectedAccountId: '',
      //会员收款账户
      customerAccounts: [],
      //退款号
      returnOrderCode: '',
      returnAmount: '',
      // 当前线下退款的用户
      refundOfflineCustomerId: '',
      //线下账户
      customerOfflineAccount: '',
      //线下账户名称
      customerOfflineAccountName: '',
      //线下账户银行名称
      customerOfflineAccountBank: '',
      //线下账户账号
      customerOfflineAccountNo: '',
      //是否合单
      mergFlag:false,
      //合单列表
      orderInfoList:[]
    };
  }

  constructor() {
    super();
  }

  @Action('edit:init')
  init(state: IMap, receivable) {
    return state.mergeIn(['receivableForm'], receivable);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }

  /**
   * 用户收款账户
   * @param state
   * @param customerAccounts
   * @returns {Map<string, V>}
   */
  @Action('customerAccounts')
  customerAccounts(state: IMap, customerAccounts) {
    return state.set('customerAccounts', customerAccounts);
  }

  /**
   * 线下账户
   * @param state
   * @param offLineAccounts
   * @returns {Map<string, V>}
   */
  @Action('refundId')
  setPayOrderId(state: IMap, refundId) {
    return state.set('refundId', refundId);
  }

  /**
   * 退款单号
   * @param state
   * @param returnOrderCode
   * @returns {Map<string, V>}
   */
  @Action('returnOrderCode')
  setPayOrderCode(state: IMap, returnOrderCode) {
    return state.set('returnOrderCode', returnOrderCode);
  }

  /**
   * 是否合单
   * @param state
   * @param mergFlag
   * @returns {Map<string, V>}
   */
   @Action('mergFlag')
   setMergFlag(state: IMap, mergFlag) {
     return state.set('mergFlag', mergFlag);
   }

   /**
   * 合单列表
   * @param state
   * @param orderInfoList
   * @returns {Map<string, V>}
   */
  @Action('orderInfoList')
  setOrderInfoList(state: IMap, orderInfoList) {
    return state.set('orderInfoList', orderInfoList);
  }

  /**
   * 退款金额
   * @param state
   * @param returnAmount
   * @returns {Map<string, V>}
   */
  @Action('edit:returnAmount')
  returnAmount(state: IMap, returnAmount) {
    return state.set('returnAmount', returnAmount);
  }

  @Action('offlineAccount:selectedAccountId')
  selectedAccountId(state: IMap, selectedAccountId) {
    return state.set('selectedAccountId', selectedAccountId);
  }

  @Action('offlineAccount:customerId')
  customerId(state: IMap, refundOfflineCustomerId) {
    return state.set('refundOfflineCustomerId', refundOfflineCustomerId);
  }

  /**
   * 设置线下账户
   * @param {plume2.IMap} state
   * @param {Map} accountInfo
   * @returns {plume2.IMap}
   */
  @Action('offlineAccount:customer-offline-account')
  customerOfflineAccount(
    state: IMap,
    account: { all: string; name: string; bank: string; no: string ,activityType: any}
  ) {
    return state
      .set('customerOfflineAccount', account.all)
      .set('customerOfflineAccountName', account.name)
      .set('customerOfflineAccountBank', account.bank)
      .set('customerOfflineAccountNo', account.no)
      .set('activityType', account.activityType);
  }
}
