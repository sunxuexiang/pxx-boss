import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IModlListResponse {
  context: any;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的弹窗列表
      dataList: [],
      wareId:'',
      warehouseList:[],
      current: 0,
      popupName: '',
      prevPopupName: ''
    };
  }

  /**
   * 数据初始化
   * @param state
   * @param res
   * @returns {Map<K, V>}
   */
  @Action('modalList:init')
  init(state: IMap, res: IModlListResponse) {
    const { context } = res;
    return state.withMutations((state) => {
      state
        .set('dataList', context.popupAdministrationVOS.content)
        .set('total', context.popupAdministrationVOS.total);
    });
  }

  @Action('current')
  current(state: IMap, current: number) {
    return state.set('current', current);
  }
  @Action('start-form')
  startForm(state: IMap, {key,value}) {
    return state.set(key, value);
  }

  @Action('pageSize')
  pageSize(state: IMap, pageSize: number) {
    return state.set('pageSize', pageSize);
  }

  @Action('popupName')
  popupName(state: IMap, popupName: string) {
    return state.set('popupName', popupName);
  }

  @Action('prevPopupName')
  prevPopupName(state: IMap, prevPopupName: string) {
    return state.set('prevPopupName', prevPopupName);
  }
}
