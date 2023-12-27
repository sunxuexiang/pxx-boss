import { Action, Actor, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        returnFlowState: ''
      },
      modalVisible: false,
      returnGoodsList: [],
      orderId: ''
    };
  }

  @Action('order-return-list:form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', (form) => form.mergeDeep(params));
  }

  @Action('order-return-list:modal-visible')
  changeModalVisible(state: IMap, value) {
    return state.set('modalVisible', value);
  }

  @Action('order-return-list:return-goods-list')
  changeReturnGoodsList(state: IMap, value) {
    return state.set('returnGoodsList', value);
  }

  @Action('order-return-list:return-goods-id')
  changeOrderId(state: IMap, value) {
    return state.set('orderId', value);
  }
}
