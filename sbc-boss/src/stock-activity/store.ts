import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const, util } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import StockListActor from './actor/stock-activity-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new StockListActor()];
  }

  //获取所有商家
  getStoreList = async () => {
    const { res } = await webapi.fetchAllStore();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('init: storeList', fromJS(res.context || []));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 初始化页面
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state().get('form').toJS();
    const queryTab = this.state().get('queryTab');
    if (query.joinLevel == -3) {
      query.joinLevel = null;
    }
    if (query.couponActivityType == -1) {
      query.couponActivityType = null;
    }
    const { res } = await webapi.pileActivityPage({
      ...query,
      queryTab: Number(queryTab),
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let activityList = res.context.content;
    const now = moment();
    activityList = activityList.map((item) => {
      //设置活动状态
      let pauseFlag;
      const flag = item.pauseFlag;
      const startTime = moment(item.startTime);
      const endTime = moment(item.endTime);
      if (endTime.isBefore(now) || item.terminationFlag == 1) {
        pauseFlag = 4;
      } else if (startTime.isAfter(now)) {
        pauseFlag = 3;
      } else if (now.isBetween(startTime, endTime)) {
        if (flag == 1) {
          pauseFlag = 2;
        } else {
          pauseFlag = 1;
        }
      }
      item.pauseFlag = pauseFlag;
      return item;
    });
    this.dispatch('init', {
      activityList: fromJS(activityList),
      total: res.context.totalElements,
      pageNum: pageNum + 1
    });
  };

  /**
   * tab框切换
   */
  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };

  /**
   * 点击搜索
   */
  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 搜索框字段改变
   */
  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 删除活动
   */
  deleteActivity = async (id) => {
    const { res } = await webapi.deleteActivity({ id });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      //刷新页面
      this.init();
    } else {
      message.error(res.message || '');
    }
  };

  /**
   * 关闭活动
   */
  pauseActivity = async (id) => {
    const { res } = await webapi.pileActivityClose({ id });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      //刷新页面
      this.init();
    } else {
      message.error(res.message || '');
    }
  };
}
