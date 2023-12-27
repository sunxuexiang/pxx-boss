import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class CouponDetailActor extends Actor {
  defaultState() {
    return {
      //选择的标签
      queryTab: '0',
      form: {
        activityName: '',
        couponActivityType: -1,
        joinLevel: null,
        startTime: null,
        endTime: null
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      couponActivityList: [],
      levelList: [],
      //是否购买企业购增值服务
      checkIEPEnable: false,
      // 1 平台优惠券活动  2 商家优惠券活动
      listType: 1,
      storeList: [],
      storeId: -1
    };
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('queryTab', key);
  }

  @Action('checkIEPEnable: check')
  checkIEPEnable(state, value) {
    return state.set('checkIEPEnable', value);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('init')
  init(state, { activityList, total, pageNum, pageSize }) {
    return state
      .set('couponActivityList', activityList)
      .set('total', total)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);
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

  @Action('init: Level')
  initLevel(state, levelData) {
    const list =
      levelData.size == 0
        ? fromJS([])
        : levelData.map((item) => {
            let data = { key: '', value: '' };
            data.key = item.get('customerLevelId');
            data.value = item.get('customerLevelName');
            return fromJS(data);
          });
    return state.set('levelList', list);
  }

  @Action('listType: set')
  listType(state, value) {
    return state.set('listType', value);
  }

  @Action('form:list')
  setList(state, list) {
    return state.set('storeList', list);
  }

  @Action('form:storeId')
  setStoreId(state, val) {
    return state.set('storeId', val);
  }
}
