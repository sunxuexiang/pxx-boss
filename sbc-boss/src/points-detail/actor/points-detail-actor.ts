import { Action, Actor, IMap } from 'plume2';

export default class PointsDetailActor extends Actor {
  defaultState() {
    return {
      total: 0, //当前的数据总数
      pageSize: 10, //当前的分页条数
      pageNum: 1, //当前页
      pointsDetailList: [], //列表数据
      customerId: null, //用户id
      isEdit: false, //积分修改input框状态位
      pointsAvailable: null //积分修改状态位
    };
  }

  @Action('init')
  init(state: IMap, { pointsDetailList, total, pageNum }) {
    return state
      .set('pointsDetailList', pointsDetailList)
      .set('total', total)
      .set('pageNum', pageNum);
  }

  @Action('point-detail:customerId')
  pointDetailCustomerId(state: IMap, customerId: string) {
    return state.set('customerId', customerId);
  }

  @Action('edit')
  edit(state: IMap, { pointsDetailList, total, pageNum }) {
    return state
      .set('pointsDetailList', pointsDetailList)
      .set('total', total)
      .set('pageNum', pageNum)
      .set('isEdit', true);
  }

  @Action('form:edit')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
