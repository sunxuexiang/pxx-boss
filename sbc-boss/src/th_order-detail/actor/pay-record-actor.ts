import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

/**
 * 收款记录actor
 */
export default class ReceiveRecordActor extends Actor {
  defaultState() {
    return {
      payRecord: [],
      payReturn:[],
      addReceiverVisible: false,
      refundVisible:false,
      payLoading:false,
      refundAuditForm:{
        refundPrice:0,
        gold:0
      }
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
  @Action('receive-record-actor')
  setReceiverActor(state: IMap,{key,value}) {
    return state.set(key, value);
  }

  @Action('receive-record-actor:form')
  setReceiverActorForm(state: IMap,{key,value}) {
    return state.setIn(['refundAuditForm',key], value);
  }
}
