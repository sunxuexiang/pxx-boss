import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import IndexActor from './actor/online-server-actor';
import { Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new IndexActor()];
  }

  /**
   * 初始化加载在线客服设置
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = await webapi.getOnlineServerSwitch(0);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('ONLINE_SERVER_INIT', res.context.onlineServiceVO);
      this.dispatch('ALIYUN_SERVER_INIT', res.context.systemConfigVO);
      this.dispatch('SOBOT_SERVER_INIT', res.context.sobotConfigVO);
      this.dispatch('IM_SERVER_INIT', res.context.imSystemConfigVO);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 弹窗显隐
   * @returns {Promise<void>}
   */
  smsEdit = async () => {
    this.dispatch('modal:changeQQShow');
  };

  aliEdit = async () => {
    this.dispatch('modal:changeAliShow');
  };

  /**
   * 查询客服列表
   * @returns {Promise<void>}
   */
  onEditServer = async () => {
    const { res } = await webapi.getOnlineServerList(0);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('ONLINE_SERVER_LIST', res.context);
      this.smsEdit();
    } else {
      message.error(res.message);
    }
  };

  onAliEditServer = async () => {
    const { res } = await webapi.getOnlineServerSwitch(0);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('ALIYUN_SERVER_INIT', res.context.systemConfigVO);
      this.aliEdit();
    } else {
      message.error(res.message);
    }
  };

  onSobotEditServer = async () => {
    const { res } = await webapi.getOnlineServerSwitch(0);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('SOBOT_SERVER_INIT', res.context.sobotConfigVO);
      await this.sobotEdit();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 弹窗显隐
   */
  smsCancel = () => {
    this.dispatch('modal:changeQQShow');
  };

  aliYunCancel = () => {
    this.dispatch('modal:changeAliShow');
  };

  sobotCancel = () => {
    this.dispatch('modal:sobotShow', false);
  };

  sobotEdit = async () => {
    this.dispatch('modal:sobotShow', true);
  };

  /**
   * 值改变
   * @param {any} field
   * @param {any} value
   */
  onFormChange = ({ field, value }) => {
    if (field == 'effectTerminal') {
      let valArr = [0, 0, 0];
      value.forEach((v) => {
        if (v == 'pc') {
          valArr[0] = 1;
        }
        if (v == 'app') {
          valArr[1] = 1;
        }
        if (v == 'mobile') {
          valArr[2] = 1;
        }
      });
      this.transaction(() => {
        ['effectivePc', 'effectiveApp', 'effectiveMobile'].forEach(
          (v, index) => {
            this.dispatch('ON_FORM_CHANGE', {
              field: v,
              value: valArr[index]
            });
          }
        );
      });
      return;
    }
    this.dispatch('ON_FORM_CHANGE', { field, value });
  };

  onAliYunChange = ({ field, value }) => {
    this.dispatch('ON_ALIYUN_CHANGE', { field, value });
  };

  onSobotChange = ({ field, value }) => {
    if (field == 'effectTerminal') {
      let valArr = [0, 0, 0];
      value.forEach((v) => {
        if (v == 'pc') {
          valArr[0] = 1;
        }
        if (v == 'app') {
          valArr[1] = 1;
        }
        if (v == 'mini') {
          valArr[2] = 1;
        }
        if (v == 'h5') {
          valArr[3] = 1;
        }
      });
      this.transaction(() => {
        [
          'effectivePc',
          'effectiveApp',
          'effectiveMiniProgram',
          'effectiveH5'
        ].forEach((v, index) => {
          this.dispatch('ON_SOBOT_CHANGE', {
            field: v,
            value: valArr[index]
          });
        });
      });
      return;
    }
    this.dispatch('ON_SOBOT_CHANGE', { field, value });
  };

  /**
   * 新增客服
   */
  onAddOnlineServer = () => {
    this.dispatch('ADD_ONLINE_SERVER');
  };

  /**
   * 客服编辑
   * @param state
   * @param index
   * @param text
   */
  onSetOnlineServer = ({ index, field, text }) => {
    this.dispatch('SET_ONLINE_SERVER', { index, field, text });
  };

  /**
   * 删除在线客服
   * @param index
   */
  onDelOnlineServer = (index) => {
    this.dispatch('ON_DEL_ONLINE_SERVER', index);
  };

  /**
   * 保存客服列表
   * @returns {Promise<void>}
   */
  onSaveOnlineServer = async () => {
    const qqOnlineServerRop = this.state().get('onlineServer');
    const qqOnlineServerItemRopList = this.state().get('onlineServerList');
    if (qqOnlineServerItemRopList.size > 10) {
      message.error('最多添加10个客服账号');
      return;
    }

    if (qqOnlineServerItemRopList.size > 0) {
      let accounts = qqOnlineServerItemRopList.map((v) =>
        v.get('customerServiceAccount')
      );
      let repeatNo = [];
      let temp = '';
      for (let i = 0; i < accounts.size - 1; i++) {
        temp = accounts.get(i);
        for (let j = i + 1; j < accounts.size; j++) {
          if (temp == accounts.get(j)) {
            repeatNo.push(temp);
            // console.log('第' + (i + 1) + '个跟第' + (j + 1) + '个重复，值是：' + temp);
          }
        }
      }
      if (repeatNo.length > 0) {
        message.error('客服账号 ' + repeatNo + ' 已存在');
        return;
      }
    }
    const sobotServer = this.state().get('sobotServer');
    const sobotEnableFlag = sobotServer.get('enableFlag');
    if (qqOnlineServerRop.get('serverStatus') == 1) {
      const aliYunConfig = this.state().get('aliyunServer');
      const enableFlag = aliYunConfig.get('enableFlag');
      if (enableFlag == 1 || sobotEnableFlag) {
        message.error('QQ客服、阿里云客服、智齿客服不可同时开启');
        return;
      }
    }

    const { res } = await webapi.onSaveOnlineServer(
      qqOnlineServerRop,
      qqOnlineServerItemRopList
    );
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.smsCancel();
      this.init();
    } else {
      message.error(res.message);
    }
  };

  saveAliCof = async () => {
    const aliYunConfig = this.state().get('aliyunServer');
    const enableFlag = aliYunConfig.get('enableFlag');
    const key = aliYunConfig.get('key');
    const serviceTitle = aliYunConfig.get('serviceTitle');
    const aliyunChat = aliYunConfig.get('aliyunChat');
    const qqOnlineServerRop = this.state().get('onlineServer');

    if (enableFlag == 1) {
      const sobotServer = this.state().get('sobotServer');
      const sobotEnableFlag = sobotServer.get('enableFlag');
      if (qqOnlineServerRop.get('serverStatus') == 1 || sobotEnableFlag == 1) {
        message.error('QQ客服、阿里云客服、智齿客服不可同时开启');
        return;
      }
    }

    const param = {
      status: enableFlag,
      context: `{\"key\": \"${key}\", \"title\": \"${serviceTitle}\", \"aliyunChat\": \"${aliyunChat}\"}`
    };

    const { res } = await webapi.saveAliYun(param);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.aliYunCancel();
      this.init();
    } else {
      message.error(res.message);
    }
  };

  saveSobot = async () => {
    const sobotServer = this.state().get('sobotServer');
    const sobotEnableFlag = sobotServer.get('enableFlag');
    const qqOnlineServerRop = this.state().get('onlineServer');
    if (sobotEnableFlag == 1) {
      const aliYunConfig = this.state().get('aliyunServer');
      const enableFlag = aliYunConfig.get('enableFlag');
      if (qqOnlineServerRop.get('serverStatus') == 1 || enableFlag == 1) {
        message.error('QQ客服、阿里云客服、智齿客服不可同时开启');
        return;
      }
    }
    const { res } = await webapi.saveSobot(sobotServer.toJS());
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.sobotCancel();
      await this.init();
    } else {
      message.error(res.message);
    }
  };
}
