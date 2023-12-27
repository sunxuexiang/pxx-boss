import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //客户名称
        customerName: '',
        //账号
        customerAccount: '',
        //联系方式
        contactPhone: ''
      }
    };
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
