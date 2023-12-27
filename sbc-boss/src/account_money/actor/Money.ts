import { Actor, IMap, Action } from 'plume2';

/**
 * 查询数据中心
 */
export default class BalanceSumn extends Actor {
  defaultState() {
    return {
        balanceSum: ''
    };
  }

  /**
   * 修改搜索框
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('balanceSum')
  balanceSum(state: IMap, balanceSum) {
    return state.set('balanceSum', balanceSum);
  }
}
