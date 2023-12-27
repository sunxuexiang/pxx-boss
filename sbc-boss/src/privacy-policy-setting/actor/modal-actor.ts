import { Actor, Action, IMap } from 'plume2';

export default class ModalActor extends Actor {
  //数据源
  defaultState() {
    return {
      modalTitle: '',
      modalVisible: false,
      //供应商provider注册协议编辑器
      registerEditor: {},
      //供应商provider入驻协议编辑器
      enterEditor: {},
      //商家注册协议编辑器
      registerSupEditor: {},
      //商家入驻协议编辑器
      enterSupEditor: {},
      privacyPolicy: '',
      privacyPolicyPop: ''
    };
  }

  constructor() {
    super();
  }

  @Action('ModalActor: modalTitle')
  setModalTitle(state: IMap, modalTitle: string) {
    return state.set('modalTitle', modalTitle);
  }

  @Action('ModalActor: modalVisible')
  setModalVisible(state: IMap, modalVisible: boolean) {
    return state.set('modalVisible', modalVisible);
  }

  @Action('ModalActor: enterEditor')
  setEnterEditor(state: IMap, enterEditor: any) {
    return state.set('enterEditor', enterEditor);
  }

  @Action('ModalActor: registerEditor')
  setRegisterEditor(state: IMap, registerEditor: any) {
    return state.set('registerEditor', registerEditor);
  }

  @Action('ModalActor: enterSupEditor')
  setEnterSupEditor(state: IMap, enterSupEditor: any) {
    return state.set('enterSupEditor', enterSupEditor);
  }

  @Action('ModalActor: registerSupEditor')
  setRegisterSupEditor(state: IMap, registerSupEditor: any) {
    return state.set('registerSupEditor', registerSupEditor);
  }

  @Action('ModalActor: privacyPolicyPop')
  setPrivacyPolicyPop(state: IMap, enterContent: string) {
    return state.set('privacyPolicyPop', enterContent);
  }

  @Action('ModalActor: privacyPolicy')
  setPrivacyPolicy(state: IMap, enterContent: string) {
    return state.set('privacyPolicy', enterContent);
  }
}
