import { Action, Actor, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      dataLists: [],
      pageManagementName: ''
    };
  }

  constructor() {
    super();
  }

  /**
   * 数据初始化
   * @param state
   * @param res
   * @returns {Map<K, V>}
   */
  @Action('modalList:init')
  init(state: IMap, res) {
    console.log('res', res);
    const { context } = res;
    return state.withMutations((state) => {
      state
        .set('dataLists', context.popupAdministrationVOS)
        .set('pageManagementName', context.pageManagementName);
    });
  }

  @Action('modalList:setSort')
  setSort(state: IMap, value) {
    return state.set('dataLists', value);
  }
}
