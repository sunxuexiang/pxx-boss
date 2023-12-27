import { Actor, Action, IMap } from 'plume2';
// import { fromJS } from 'immutable';

export default class Form extends Actor {
  defaultState() {
    return {
      isRewardRecorded:'1',
      newForm:{
        newCustomersBuyLimit:2
      },
      oldForm:{
        oldCustomersBuyLimit:2
      },
      rulesForm:{
        invitationRules:''
      },
      invitationRules:''
    };
  }


  /**
   * 修改defaultState一级变量
   * @param state
   * @param param1
   */

  @Action('state:edit')
  setStateEdit(state: IMap, {key,value}) {
    return state.set(key,value);
  }

  /**
   * 修改newForm一级变量
   * @param state
   * @param param1
   */

   @Action('state:edit:newForm')
   setStateEditNewForm(state: IMap, {key,value}) {
     return state.setIn(['newForm',key], value);
   }

  /**
   * 修改oldForm一级变量
   * @param state
   * @param param1
   */

   @Action('state:edit:oldForm')
   setStateEditOldForm(state: IMap, {key,value}) {
     return state.setIn(['oldForm',key], value);
   }

   /**
   * 修改rulesForm一级变量
   * @param state
   * @param param1
   */

    @Action('state:edit:rulesForm')
    setStateEditRulesForm(state: IMap, {key,value}) {
      return state.setIn(['rulesForm',key], value);
    }

    @Action('setting: expensesCostContent')
    refexpensesCostContent(state, regEditor) {
      return state.set('invitationRules', regEditor);
    }

  

}
