import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IPayOrderPageResponse {
  payOrderResponses: Array<any>;
  pageSize: number;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      queryTab: '0'
    };
  }

  @Action('change:queryTab')
  queryTab(state: IMap, queryTab: string) {
    return state.set('queryTab', queryTab);
  }
}
