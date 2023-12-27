import { Action, Actor, IMap } from 'plume2';

export default class custometListActor extends Actor {
  defaultState() {
    return {
      _total: 0, //当前的数据总数
      _pageSize: 10, //当前的分页条数
      _pageNum: 1, //当前页
      customertList: [], //列表数据
      isEdit: false, //是否编辑积分状态位
      customerId: null, //修改积分目标索引
      pointsAvailable: null, //修改积分目标积分
      _form: {
        //客户名称
        customerName: '',
        customerStatus: null,
        customerAccount: '',
        pointsAvailableBegin: null,
        pointsAvailableEnd: null
      }
    };
  }

  @Action('customer-point-init')
  customerPointInit(state: any, { customertList, total, pageNum }) {
    return state
      .set('customertList', customertList)
      .set('_total', total)
      .set('_pageNum', pageNum);
  }

  @Action('customer:form:field')
  customerFormFiledChange(state, { key, value }) {
    return state.setIn(['_form', key], value);
  }

  @Action('customer:points:edit')
  customerPointsEdit(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
