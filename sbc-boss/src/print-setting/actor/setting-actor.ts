import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      regEditor: {},
      settings: {
        pcWebsite: '', // PC端商城网址
        mobileWebsite: '', // 移动端商城网址
        supplierWebsite: '', //商家后台登录网址
        pcTitle: '', // PC商城title
        pcLogo: '', // PC商城logo
        pcBanner: '', // PC商城登录页banner
        pcIco: '',
        registerContent: ''
      },
      printSetting: {
        printId: '',
        printHead: '',
        printBottom: ''
      }
    };
  }

  /**
   * 将editor ref对象存储到actor中
   */
  @Action('setting: regEditorHead')
  setRegEditorHead(state: IMap, regEditor) {
    return state.set('regEditorHead', regEditor);
  }

  /**
   * 将editor ref对象存储到actor中
   */
  @Action('setting: regEditorBottom')
  setRegEditorBottom(state: IMap, regEditor) {
    return state.set('regEditorBottom', regEditor);
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.mergeIn(['settings'], setting);
  }

  @Action('setting:editSetting')
  editSetting(state, data: IMap) {
    return state.update('settings', (settings) => settings.merge(data));
  }
  /**
   * 保存新增的基本信息
   * @param state
   * @param data
   */
  @Action('setting:saveSetting')
  saveSetting(state, data: IMap) {
    return state.set('settings', data);
  }

  /**
   * 初始化打印配置
   * @param state
   * @param data
   */
  @Action('printSetting:init')
  initPrintConfig(state, data) {
    return state.set('printSetting', data);
  }

  /**
   * 修改打印配置
   * @param state
   * @param data
   */
  @Action('printSetting:modify')
  editPrintSetting(state, data: IMap) {
    return state.update('printSetting', (printSetting) =>
      printSetting.merge(data)
    );
  }
}
