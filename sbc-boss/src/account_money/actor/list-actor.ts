import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IInvoiceResponse {
  content: Array<any>;
  total: number;
  size: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: []
    };
  }

  /**
   * 数据初始化
   * @param state
   * @param res
   * @returns {Map<K, V>}
   */
  @Action('list:init')
  init(state: IMap, res: IInvoiceResponse) {
    const { content, total, size } = res;

    return state.withMutations((state) => {
      state
        .set('total', total)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }
}
