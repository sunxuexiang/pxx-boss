import { IOptions, Store } from 'plume2';
import PointsDetailActor from './actor/points-detail-actor';
import CustomerInfoActor from './actor/customer-info-actor';
import { history } from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';

import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }
  bindActor() {
    return [new PointsDetailActor(), new CustomerInfoActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    let customerId = this.state().get('customerId');
    const { res } = await webapi.pointDetailList({
      customerId,
      pageNum,
      pageSize
    });
    if (res.code != 'K-000000') return;
    let pointsDetailList = res.context.customerPointsDetailVOPage
      .content as any;
    this.dispatch('init', {
      pointsDetailList: fromJS(pointsDetailList),
      total: res.context.customerPointsDetailVOPage.totalElements,
      pageNum: pageNum + 1
    });
  };

  setCustomerId = (customerId: string) => {
    this.dispatch('point-detail:customerId', customerId);
  };

  queryInfo = async () => {
    let customerId = this.state().get('customerId');
    const { res } = (await webapi.userInfo(customerId)) as any;
    let userInfo = res;
    let data = {
      pointsUsed: userInfo.pointsUsed,
      pointsAvailable: userInfo.pointsAvailable,
      customerName: userInfo.customerDetail.customerName,
      customerAccount: userInfo.customerAccount,
      headImg: userInfo.headImg
    };
    this.dispatch('pointsDetail:userInfo', fromJS(data));
  };

  /**
   * 会员积分修改，新增一条假数据
   */
  addList = () => {
    let pointsDetail = this.state().get('pointsDetailList');
    let firstValue = fromJS(pointsDetail.get(0));
    let test = {
      points: '-',
      pointsAvailable: firstValue.get('pointsAvailable'),
      // customerName: firstValue.customerName,
      opTime: new Date(),
      customerAccount: firstValue.get('customerAccount'),
      serviceType: 20,
      content: null,
      customerId: firstValue.get('customerId'),
      type: 3
    };
    const total = this.state().get('total');
    const pageNum = this.state().get('pageNum');

    const newPointsInfo = pointsDetail.unshift(test);

    this.dispatch('edit', {
      pointsDetailList: fromJS(newPointsInfo),
      total,
      pageNum
    });
  };

  handlerChangeAvailablePoints = ({ key, value }) => {
    this.dispatch('form:edit', { key, value });
  };

  /**
   * 会员积分修改，取消操作
   */
  handlerChangeEdit = () => {
    let pointsDetail = this.state().get('pointsDetailList');
    pointsDetail = pointsDetail.shift();
    this.handlerChangeAvailablePoints({ key: 'isEdit', value: false });
    this.handlerChangeAvailablePoints({
      key: 'pointsDetailList',
      value: pointsDetail
    });
  };

  /**
   * 会员积分修改
   * @param pageNum
   */
  updatePoint = async (param) => {
    let customerId = this.state().get('customerId');
    let pointsAvailable = this.state().get('pointsAvailable');
    if (pointsAvailable == null || pointsAvailable == param) {
      message.error('您未修改积分');
      return;
    }
    if (!this.checkNum(pointsAvailable)) return;
    const { res } = await webapi.updatePoints({
      customerId,
      pointsAvailable
    });
    if (res.code != 'K-000000') {
      message.error(res.message);
      return;
    }
    let pointsDetailList = res.context.customerPointsDetailVOPage
      .content as any;
    this.dispatch('init', {
      pointsDetailList: fromJS(pointsDetailList),
      total: res.context.customerPointsDetailVOPage.totalElements,
      pageNum: 1
    });

    this.handlerChangeAvailablePoints({ key: 'isEdit', value: false });
    this.queryInfo();
    //this._goto(customerId);
  };

  /**
   * 纯数字校验
   * @param tel
   * @returns {boolean}
   */
  checkNum = (num) => {
    //数字
    const regex = /^\d+$/;
    if (num) {
      if (!regex.test(num)) {
        message.error('请填写正确数字！');
        return false;
      } else {
        return true;
      }
    } else {
      message.error('请填写积分！');
      return false;
    }
  };

  /**
   * 页面跳转
   * @private
   */
  _goto = (id) => {
    history.push(`/customer-detail/${id}`, { tabKey: '2' });
  };
}
