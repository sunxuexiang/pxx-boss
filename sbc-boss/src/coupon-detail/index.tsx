import React, { Component } from 'react';

import { StoreProvider } from 'plume2';

import { Breadcrumb, Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import Appstore from './store';
import CouponBasicInfo from './components/coupon-basic-info';
import CouponRecord from './components/coupon_record';

const COUPON_TYPE = {
  0: '优惠券',
  1: '运费券',
  2: '优惠券'
};

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { cid } = this.props.match.params;
    await this.store.setcouponId(cid);
   await this.store.init(cid);
   await this.store.inits({ pageNum: 0, pageSize: 10 });
  }

  render() {
    const couponType = this.store.state().getIn(['coupon', 'couponType']);
    const title = COUPON_TYPE[couponType]
      ? `${COUPON_TYPE[couponType]}详情`
      : '';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item >
            {COUPON_TYPE[couponType]}
            详情
          </Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">" key="Breadcrumb">
          <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
          <Breadcrumb.Item>优惠券列表</Breadcrumb.Item>
          <Breadcrumb.Item>
            {COUPON_TYPE[couponType]}
            详情
          </Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container" key="container">
          <Headline title={title} />
          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab="优惠券信息" key="0">
              <CouponBasicInfo />
            </Tabs.TabPane>
            <Tabs.TabPane tab="领取记录" key="1">
              <CouponRecord />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
