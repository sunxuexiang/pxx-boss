import { Action, Actor, IMap, Store } from 'plume2';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  bindActor(): Actor[] {
    return [new StartUp()];
  }
  // 删除
  deleteCoupon = async (advertisingId) => {
    const { res } = await webapi.DeleteStart({
      advertisingId
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
    }
  };
  // 列表
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const { hotName, status } = this.state().toJS();
    const { res } = await webapi.ListStart({
      pageSize,
      pageNum,
      hotName: hotName ? hotName : null,
      status: status ? status : "0",
      // advertisingType: advertisingType ? advertisingType : null
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let startList = null;
    if (res.context.hotStyleMomentsPage) {
      startList = res.context.hotStyleMomentsPage.content;
      this.dispatch('init', {
        startList: fromJS(startList),
        total: res.context.hotStyleMomentsPage.total,
        pageNum: pageNum + 1
      });
    }
  };
  // 修改fromn值
  onFormFieldChange = (keys, value) => {
    this.dispatch('start-set', { keys, value });
  };
  // 提前开始爆款时刻
  onchangeStart = async (hotId) => {
    const { res } = await webapi.earlytart({hotId});
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
    }
  };
  // 启动或暂停爆款时刻活动（只有进行中的才有启动/暂停按钮）
  onPauseById=async(hotId,isPause)=>{
    const { res } = await webapi.pauseById({hotId,isPause});
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
    }
  }
  onTerminationById=async(hotId)=>{
    const { res } = await webapi.terminationById({hotId});
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
    }
  }

}
class StartUp extends Actor {
  defaultState(): Object {
    return {
      hotName: null,
      status: '0',
      advertisingType: '',
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      startList: fromJS([])
    };
  }
  @Action('start-set')
  onFormFieldChange(state: IMap, { keys, value }) {
    console.log(keys, value, 'keys, value');

    return state.set(keys, value);
  }
  @Action('init')
  init(state, { startList, total, pageNum }) {
    return state
      .set('startList', startList)
      .set('total', total)
      .set('pageNum', pageNum);
  }
}
