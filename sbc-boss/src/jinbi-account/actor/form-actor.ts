import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      //当前tab
      currentTab: '0',
      // 用户搜索条件form
      userForm: null,
      // 企业搜索条件form
      companyForm: null
    };
  }

  @Action('form:update')
  changeField(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
