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
    const { advertisingName, status,advertisingType } = this.state().toJS();
    const { res } = await webapi.ListStart({
      pageSize,
      pageNum,
      advertisingName: advertisingName ? advertisingName : null,
      status: status ? status : null,
      advertisingType: advertisingType ? advertisingType : null
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let startList = null;
    if (res.context.advertisingRetailPage) {
      startList = res.context.advertisingRetailPage.content;
      this.dispatch('init', {
        startList: fromJS(startList),
        total: res.context.advertisingRetailPage.total,
        pageNum: pageNum + 1
      });
    }
  };
  // 修改fromn值
  onFormFieldChange = (keys, value) => {
    this.dispatch('start-set', { keys, value });
  };
  // 修改状态
  onchangeStart = async (advertisingId, status,advertisingType) => {
    const { res } = await webapi.modstart({
      advertisingId,
      status,
      advertisingType
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
    }
  };
}
class StartUp extends Actor {
  defaultState(): Object {
    return {
      advertisingName: null,
      status: '',
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
