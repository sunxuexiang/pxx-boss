import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';
import HomeSettingActor from './actor/home-page-setting';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new HomeSettingActor()];
  }

  init = async () => {
    const { res } = await webapi.getweatherswitch();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('home:setting', res.context.weatherSwitchVO);
    } else {
      message.error(res.message);
    }
  };

  editSetting = async () => {
    const settings = this.state()
      .get('settings')
      .toJS();
    if (settings.topImgStatus == 1 && !settings.topImg) {
      message.error('请上传顶部背景图!');
      return;
    }
    if (settings.sloganImgStatus == 1 && !settings.sloganImg) {
      message.error('请上传slogan背景图!');
      return;
    }
    const response = await webapi.modifyweatherswitch(settings);
    if (!response) return;
    const { res } = response;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功!');
    } else {
      message.error('修改失败!');
    }
  };

  /**
   * 基本配置form属性变更
   */
  settingFormChange = (key, value) => {
    this.dispatch('setting:editSetting', fromJS({ [key]: value }));
  };
}
