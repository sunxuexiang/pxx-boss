import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
// import { __DEV__ } from "typings/global";
import Iosactor from './actor/ios_actor';

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
    return [new Iosactor()];
  }
  init = async () => {
    const { res } = await webapi.iosList({
      pageNum: 0,
      pageSize: 10
    });
    console.log(res.context.iosVersionPages.content[0], 'ioslist');
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('init', res.context.iosVersionPages.content[0]);
      this.dispatch('inits', res.context.iosVersionPages.content);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改升级配置信息字段
   */
  onChange = ({ field, value }) => {
    console.log(this.state().toJS(), field);
    this.dispatch('app: upgrade: edit', { field, value });
    if (field == 'versionNo') {
      const list = this.state().toJS();
      console.log(list.appUpgrade_list, 'list', value);
      list.appUpgrade_list.forEach((ele) => {
        if (ele.versionNo == value) {
          console.log(list.appUpgrade_list, 'listasdasd', value);
          this.dispatch('init', ele);
        }
      });
    }
  };

  /**
   * 编辑保存
   * @param info
   * @returns {Promise<void>}
   */
  onSaveSetting = async (info) => {
    const info_data = this.state();
    // if (info_data.toJS().appUpgrade.buildNos >= info_data.toJS().appUpgrade.buildNo) {
    const data = {
      buildNo: info_data.toJS().appUpgrade.buildNo
        ? Number(info_data.toJS().appUpgrade.buildNo)
        : '',
      openWechatLongFlag: info_data.toJS().appUpgrade.openWechatLongFlag,
      updatePromptStatus: info_data.toJS().appUpgrade.updatePromptStatus,
      versionNo: info_data.toJS().appUpgrade.versionNo
    };
    const { res } = await webapi.iosVer_add(data);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功！');
      this.init();
    } else {
      message.error(res.message);
    }
    // } else {
    //     message.error('不能少于当前版本构建号。');
    //     return
    // }
  };
}
