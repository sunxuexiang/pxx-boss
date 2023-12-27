import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      settings: {
        topImg: '', // 顶部背景图
        topImgStatus: 0, // 顶部背景图开关
        sloganImg: '', //天气图
        sloganImgStatus: 0, // 天气图开关
        componentStatus: 0, // 组件显示
        searchBackColor: '#f7f7f7', // 搜索框背景色
        searchBackStatus: 0 // 搜索框背景色开关
      }
    };
  }

  @Action('home:setting')
  setting(state: IMap, data) {
    return state.set('setting', data);
  }

  @Action('setting:editSetting')
  editSetting(state, data: IMap) {
    return state.update('settings', (settings) => settings.merge(data));
  }
}
