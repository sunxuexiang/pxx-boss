import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class IndexActor extends Actor {
  defaultState() {
    return {
      //客服设置
      onlineServer: {},
      //客服列表
      onlineServerList: [],
      //弹窗显隐
      smsVisible: false,
      //阿里弹窗显隐
      aliSmsVisible: false,
      //智齿弹窗显隐
      sobotVisible: false,
      //是否需要新增一条
      setOneFlag: '',
      //是否需要校验
      checkFlag: true,
      //是否启用
      enableFlag: false,
      // 阿里云客服配置
      aliyunServer: {
        // 是否开启
        enableFlag: 0,
        // 生效终端
        effectTerminal: [],
        // 标题
        serviceTitle: '',
        // 链接
        aliyunChat: '',
        // 密钥
        key: ''
      },
      sobotServer: {
        // 是否开启
        enableFlag: 0,
        // 生效终端
        effectivePc: 0,
        effectiveApp: 0,
        effectiveMiniProgram: 0,
        effectiveH5: 0,
        // 标题
        appKey: '',
        // 链接
        appId: '',
        // 密钥
        h5Url: ''
      },
      imServer: {}
    };
  }

  /**
   * 初始化加载在线客服设置
   * @param {IMap} state
   * @param context
   * @returns {Map<string, any>}
   */
  @Action('ONLINE_SERVER_INIT')
  onlineServerInit(state: IMap, context) {
    const onlineServer = fromJS(context);
    return state
      .set('onlineServer', onlineServer)
      .set('enableFlag', onlineServer.get('serverStatus') == 1);
  }

  /**
   * 初始化加载在线客服列表
   * @param {IMap} state
   * @param context
   * @returns {Map<string, any>}
   */
  @Action('ONLINE_SERVER_LIST')
  onlineServerList(state: IMap, context) {
    let onlineServerList = context.qqOnlineServerItemRopList;
    if (onlineServerList) {
      onlineServerList = onlineServerList.map((v) => {
        v.key = Math.random()
          .toString()
          .substring(2);
        return v;
      });
    }

    const onlineServer = fromJS(context.qqOnlineServerRop);
    let setOneFlag = onlineServerList && onlineServerList.length > 0 ? '1' : '';

    return state
      .set(
        'onlineServerList',
        onlineServerList ? fromJS(onlineServerList) : fromJS([])
      )
      .set('onlineServer', onlineServer)
      .set('setOneFlag', setOneFlag)
      .set('checkFlag', onlineServer.get('serverStatus') == 1)
      .set('enableFlag', onlineServer.get('serverStatus') == 1);
  }

  /**
   * 弹窗显隐
   * @param {IMap} state
   * @returns {Map<string, any>}
   */
  @Action('modal:changeQQShow')
  changeQQShow(state: IMap) {
    return state.set('smsVisible', !state.get('smsVisible'));
  }

  @Action('modal:changeAliShow')
  changeAliShow(state: IMap) {
    return state.set('aliSmsVisible', !state.get('aliSmsVisible'));
  }

  @Action('modal:sobotShow')
  changeSobotShow(state: IMap, param: boolean) {
    return state.set('sobotVisible', param);
  }
  /**
   * 值改变
   * 值改变
   * @param {IMap} state
   * @param {any} field
   * @param {any} value
   * @returns {Map<string, any>}
   */
  @Action('ON_FORM_CHANGE')
  onFormChange(state: IMap, { field, value }) {
    let onlineServer = state.get('onlineServer');
    onlineServer = onlineServer.setIn([field], value);

    return state
      .set('onlineServer', onlineServer)
      .set('checkFlag', onlineServer.get('serverStatus') == 1);
  }

  /**
   * 新增客服
   * @param state
   * @param index
   * @returns {*}
   */
  @Action('ADD_ONLINE_SERVER')
  onAddOnlineServer(state: IMap) {
    const onlineServer = state.get('onlineServer');
    let onlineServerList = state.get('onlineServerList');

    let newServer = fromJS({
      key: Math.random()
        .toString()
        .substring(2),
      serviceItemId: null,
      storeId: onlineServer.get('storeId'),
      onlineServiceId: onlineServer.get('onlineServiceId'),
      customerServiceName: '',
      customerServiceAccount: ''
    });
    onlineServerList = onlineServerList.push(newServer);
    let setOneFlag = '1';
    return state
      .set('onlineServerList', onlineServerList)
      .set('setOneFlag', setOneFlag);
  }

  /**
   * 客服编辑
   * @param state
   * @param index
   * @param text
   */
  @Action('SET_ONLINE_SERVER')
  onSetOnlineServer(state: IMap, { index, field, text }) {
    let onlineServerList = state.get('onlineServerList');
    onlineServerList = onlineServerList.setIn([index, field], text);

    return state.set('onlineServerList', onlineServerList);
  }

  /**
   * 删除客服
   * @param {IMap} state
   * @param index
   * @returns {Map<string, any>}
   */
  @Action('ON_DEL_ONLINE_SERVER')
  onDelOnlineServer(state: IMap, index) {
    let onlineServerList = state.get('onlineServerList');
    onlineServerList = onlineServerList.delete(index);

    let setOneFlag = onlineServerList.size > 0 ? '1' : '';
    return state
      .set('onlineServerList', onlineServerList)
      .set('setOneFlag', setOneFlag);
  }

  @Action('ALIYUN_SERVER_INIT')
  aliyunServer(state: IMap, configParam) {
    const aliYunConfig = fromJS(configParam);
    // const enableFlag = aliYunConfig.get('status') != 0;
    const aliYunObj = JSON.parse(aliYunConfig.get('context'));
    // const effectTerminal = aliYunObj.channel.split(',');
    const serviceTitle = aliYunObj.title;
    const aliyunChat = aliYunObj.aliyunChat;
    const key = aliYunObj.key;
    return (
      state
        .setIn(['aliyunServer', 'enableFlag'], aliYunConfig.get('status'))
        // .setIn(['aliyunServer','effectTerminal'], effectTerminal)
        .setIn(['aliyunServer', 'serviceTitle'], serviceTitle)
        .setIn(['aliyunServer', 'aliyunChat'], aliyunChat)
        .setIn(['aliyunServer', 'key'], key)
    );
  }

  @Action('SOBOT_SERVER_INIT')
  sobotServer(state: IMap, configParam) {
    const sobotConfig = fromJS(configParam);
    const sobotObj = JSON.parse(sobotConfig.get('context'));
    const effectivePc = sobotObj.effectivePc;
    const effectiveApp = sobotObj.effectiveApp;
    const effectiveMiniProgram = sobotObj.effectiveMiniProgram;
    const effectiveH5 = sobotObj.effectiveH5;
    const appKey = sobotObj.appKey;
    const appId = sobotObj.appId;
    const h5Url = sobotObj.h5Url;
    return state
      .setIn(['sobotServer', 'enableFlag'], sobotConfig.get('status'))
      .setIn(['sobotServer', 'effectivePc'], effectivePc)
      .setIn(['sobotServer', 'effectiveApp'], effectiveApp)
      .setIn(['sobotServer', 'effectiveMiniProgram'], effectiveMiniProgram)
      .setIn(['sobotServer', 'effectiveH5'], effectiveH5)
      .setIn(['sobotServer', 'appKey'], appKey)
      .setIn(['sobotServer', 'appId'], appId)
      .setIn(['sobotServer', 'h5Url'], h5Url);
  }

  @Action('ON_ALIYUN_CHANGE')
  onAliYunChange(state: IMap, { field, value }) {
    return state.setIn(['aliyunServer', field], value);
  }

  @Action('ON_SOBOT_CHANGE')
  onSobotChange(state: IMap, { field, value }) {
    return state.setIn(['sobotServer', field], value);
  }

  @Action('IM_SERVER_INIT')
  imServer(state: IMap, configParam) {
    console.warn(configParam, '----------------');
    // const imConfig = fromJS(configParam);
    const imObj = JSON.parse(configParam.context);
    return state.setIn(['imServer', 'enableFlag'], imObj.enableFlag);
  }
}
