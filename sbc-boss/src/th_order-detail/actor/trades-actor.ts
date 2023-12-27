/**
 * Created by chenpeng on 2017/6/23.
 */

 import { Action, Actor, IMap } from 'plume2';
//  import { List,fromJS } from 'immutable';
 
 /**
  * 提货actor
  */
 export default class TradesActor extends Actor {
   defaultState() {
     return {
        tradesList: []
     };
   }
 
   @Action('tradesList:init')
   init(state: IMap, res) {
     return state.set('tradesList',res);
   }
 }
 