import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

/**
 * 收款记录actor
 */
export default class ReceiveRecordActor extends Actor {
  defaultState() {
    return {
      payRecord: [],
      payReturn: [],
      addReceiverVisible: false,
      addReturnrVisible: false,
      collectionVisible:false,
      orderInfoList:[]
    };
  }
  
  @Action('receive-record-actor:init')
  init(state: IMap, res: Object) {
    return state.set('payRecord', List(res));
  }
  
  @Action('payReturn:init')
  payReturn(state: IMap, res: Object) {
    return state.set('payReturn', List(res));
  }

  @Action('receive-record-actor:setReceiveVisible')
  setAddReceiverVisible(state: IMap) {
    return state.set('addReceiverVisible', !state.get('addReceiverVisible'));
  }

  @Action('receive-record-actor:addReturnrVisible')
  addReturnrVisible(state: IMap) {
    return state.set('addReturnrVisible', !state.get('addReturnrVisible'));
  }

  @Action('receive-record-actor:setCollectionVisible')
  setCollectionVisible(state: IMap) {
    return state.set('collectionVisible', !state.get('collectionVisible'));
  }

  @Action('form:order:info:list')
  formOrderInfoList(state: IMap,res) {
    return state.set('orderInfoList',res);
  }
}
