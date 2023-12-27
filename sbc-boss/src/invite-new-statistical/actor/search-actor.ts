import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SearchActor extends Actor {
  defaultState() {
    return {
      searchParams: fromJS({
        inviteeAccount: '',
      }),
      //邀请详情
      detailsVisible:false,
      inviteeAccount:'',
      customerAccount:'',
      detailsList:[],
      
    };
  }




  /**
   * 填充搜索字段
   * @param state
   * @param param1
   */
  @Action('invite:new:searchParams')
  searchParams(state, { field, value }) {
    return state.setIn(['searchParams', field], value);
  }


    /**
   * 填充搜索字段
   * @param state
   * @param param1
   */
     @Action('invite:new')
     setInviteNew(state, { key, value }) {
       return state.set(key,value);
     }
  
  
}
