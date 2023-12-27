import { Action, Actor, IMap } from 'plume2';

export default class workDetailActor extends Actor {
  defaultState() {
    return {
      baseInfo: {}, //工单基本设置基本西悉尼
      workOrderDetails: [], //工单详情页码
      editFlag: false, //true 禁止编辑 false 开启编辑
      checkFlag: false //是否是查看，true 查看，false 不是
    };
  }

  @Action('init:baseInfo')
  initBaseInfo(state, baseInfo) {
    return state.set('baseInfo', baseInfo);
  }

  @Action('add:workOrderDetails')
  workOrderDetails(state, workOrderDetails) {
    return state.set('workOrderDetails', workOrderDetails);
  }

  @Action('edit:editFlag')
  updateKeyValue(state, editFlag) {
    return state.set('editFlag', editFlag);
  }

  @Action('edit:checkFlag')
  updateCheckFlag(state, checkFlag) {
    return state.set('checkFlag', checkFlag);
  }
}
