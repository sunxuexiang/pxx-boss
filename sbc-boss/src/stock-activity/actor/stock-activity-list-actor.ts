import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class StockListActor extends Actor {
  defaultState() {
    return {
      // 全部商家列表
      storeList: [],
      //选择的标签
      queryTab: '0',
      form: {
        storeId: '',
        activityName: '',
        startTime: null,
        endTime: null
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      couponActivityList: []
    };
  }

  @Action('init: storeList')
  getStoreList(state, key) {
    return state.set('storeList', key);
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
  init(state, { activityList, total, pageNum }) {
    return state
      .set('couponActivityList', activityList)
      .set('total', total)
      .set('pageNum', pageNum);
  }

  @Action('activity: start')
  setActivityStart(state, id) {
    const list = state.get('couponActivityList').map((item) => {
      if (id != item.get('activityId')) {
        return item;
      }
      return item.set('pauseFlag', 1);
    });
    return state.set('couponActivityList', list);
  }

  @Action('activity: pause')
  setActivityPause(state, id) {
    const list = state.get('couponActivityList').map((item) => {
      if (id != item.get('activityId')) {
        return item;
      }
      return item.set('pauseFlag', 2);
    });
    return state.set('couponActivityList', list);
  }
}
