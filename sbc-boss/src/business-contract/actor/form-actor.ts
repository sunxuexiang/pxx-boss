import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //商家名称
        supplierName: '',
        // 合同签署时间
        beginTime: '',
        endTime: '',
        investmentManager: '',
        signType: '',
        tabRelationValue: []
      },
      waitForm: {
        //商家账号
        employeeName: '',
        // 合同签署时间
        beginTime: '',
        endTime: '',
        investmentManager: '',
        signType: ''
      },
      // 所有批发市场
      marketsList: []
    };
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
  @Action('waitForm:field')
  changeWaitField(state: IMap, { field, value }) {
    return state.setIn(['waitForm', field], value);
  }
  @Action('form:marketsList')
  marketsList(state: IMap, value) {
    return state.set('marketsList', value);
  }
}
