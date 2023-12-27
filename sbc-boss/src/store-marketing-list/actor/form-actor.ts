import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //活动名称
        marketingName: '',
        //活动类型
        marketingSubType: '-1',
        //市
        startTime: null,
        //区
        endTime: null,
        //所属商家
        storeId: null,
        //查询类型
        queryTab: '0',
        //未删除
        delFlag: 0
      },
      storeList: []
    };
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
  @Action('form:list')
  setList(state: IMap, list) {
    return state.set('storeList', list);
  }
}
