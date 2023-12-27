import React from 'react';
import { Store, Relax } from 'plume2';
import { Tabs } from 'antd';
import PointsDetail from '../../../points-detail/index';
// import CustomerGrowValue from '../../../customer-grow-value/index';
// import CustomerFunds from '../../../customer-funds-detail/index';
import CustomerDetail from '../../../customer-detail/index';
import OrderList from '../../../order-list/index';

@Relax
export default class InfoSummary extends React.Component<any, any> {
  _store: Store;
  props: {
    customerId: string;
  };

  render() {
    const { customerId } = this.props;

    return (
      <div className="article-wrap">
        <Tabs type="card">
          <Tabs.TabPane tab="TA的订单" key="1">
            <OrderList buyerId={customerId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="积分" key="2">
            <PointsDetail cid={customerId} />
          </Tabs.TabPane>
          {/*<Tabs.TabPane tab="余额" key="4">*/}
          {/*<CustomerFunds customerId={customerId} />*/}
          {/*</Tabs.TabPane>*/}
          <Tabs.TabPane tab="收货地址" key="6">
            <CustomerDetail customerId={customerId} tabIndex={2} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="增票资质" key="7">
            <CustomerDetail customerId={customerId} tabIndex={3} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="企业认证" key="8">
            <CustomerDetail customerId={customerId} tabIndex={4} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="物流公司" key="9">
            <CustomerDetail customerId={customerId} tabIndex={5} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
