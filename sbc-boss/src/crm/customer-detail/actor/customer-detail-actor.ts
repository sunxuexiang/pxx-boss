import { Action, Actor, IMap } from 'plume2';

export default class customerDetailActor extends Actor {
  defaultState() {
    return {
      customerId: '',
      vipflg: '',
      modalVisible: false,
      baseInfo: {},
      tagList: [],
      customerTagList: [],
      groupNames: [],
      rfmStatistic: {},
      tagModalVisible: false,
      enterpriseModalVisible: false
    };
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.set(key, value);
  }

  @Action('init')
  init(state, { customerId }) {
    return state.set('customerId', customerId);
    // .set('rfmStatistic', rfmStatistic);
  }
  @Action('vipflg')
  vipflg(state, { vipflg }) {
    console.log(vipflg,'2222222222222')
    return state.set('vipflg', vipflg);
    // .set('rfmStatistic', rfmStatistic);
  }

  @Action('tab: change')
  tabChange(state, key) {
    return state.set('queryTab', key);
  }

  @Action('toggle: form: modal')
  toggleFormModel(state) {
    return state.set('modalVisible', !state.get('modalVisible'));
  }

  @Action('init:baseInfo')
  initBaseInfo(state, baseInfo) {
    return state.set('baseInfo', baseInfo);
  }

  @Action('init:tagList')
  initTagList(state: IMap, tagList) {
    return state.set('tagList', tagList);
  }

  @Action('toggle:tag:modal')
  toggleTagModal(state) {
    return state.set('tagModalVisible', !state.get('tagModalVisible'));
  }

  @Action('init:state')
  initState(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  @Action('tag: field')
  updateTagFiledChange(state, tagId) {
    return state.setIn(['baseInfo', 'customerTag'], tagId);
  }
}
