import { Action, Actor } from 'plume2';

export default class CouponDetailActor extends Actor {
  defaultState() {
    return {
      //选择的标签
      queryTab: '0',
      form: {
        provinceName: null,
        cityName: null,
        areaName: null,
        villageName: null,
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      pageVillages: []
    };
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('queryTab', key);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('init')
  init(state, { pageVillages, total, pageNum }) {
    return state
      .set('pageVillages', pageVillages)
      .set('total', total)
      .set('pageNum', pageNum);
  }
}
