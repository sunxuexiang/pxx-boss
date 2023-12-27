import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import moment from 'moment';
import MarketingActor from './common/actor/marketing-actor';
import ListActor from './common/actor/list-actor';
import LoadingActor from './common/actor/loading-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new MarketingActor(), new ListActor(), new LoadingActor()];
  }

  init = async (activityId?: string) => {
    const result = await webapi.fetchCoinInfo(activityId);
    if (result.res.code == Const.SUCCESS_CODE) {
      this.dispatch('jinbiActor:init', result.res.context);
    } else {
      message.error(result.res.message);
    }
  };

  getRecordInfo = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 },
    activityId?: string
  ) => {
    let paramId;
    if (activityId) {
      this.dispatch('activityId', activityId);
      paramId = activityId;
    } else {
      paramId = this.state().get('activityId');
    }
    const query = this.state().get('form').toJS();
    this.dispatch('loading:start');
    this.dispatch('list:inits', {
      content: fromJS([])
    });
    Promise.all([
      webapi.fetchcoupRecordList({
        ...query,
        activityId: paramId, // 暂时写死假数据
        pageNum,
        pageSize
      })
    ]).then((res) => {
      console.log(res[0].res.context.total, '123123');

      if (res[0].res.code != Const.SUCCESS_CODE) {
        message.error(res[0].res.message);
      }

      let couponList = null;
      if (res[0].res.context) {
        couponList = res[0].res.context.content;
        this.dispatch('loading:end');
        this.dispatch('list:inits', {
          content: fromJS(couponList),
          total: res[0].res.context.total,
          pageNum: pageNum + 1
        });
      }
    });
  };

  search = () => {
    this.getRecordInfo({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 搜索条件表单的变更
   * @param {any} key
   * @param {any} value
   */
  onFormFieldChange = (key, value) => {
    this.dispatch('form:field', { key, value });
  };
}
