import React from 'react';
import { Tabs } from 'antd';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';

import DeliveryRule from './components/rule';
// import CarriageTemp from './components/carriageTemp';
import Copywriting from './components/copywriting';
import StoreList from './components/storeList';

const { TabPane } = Tabs;
const DeliveryToStore = function () {
  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="配送到店" />
        <Tabs defaultActiveKey="1">
          <TabPane tab="规则设置" key="1">
            <AuthWrapper functionName="f_deliveryStore_rule">
              <DeliveryRule />
            </AuthWrapper>
          </TabPane>
          {/* <TabPane tab="运费模板" key="2">
            <AuthWrapper functionName="f_deliveryStore_plate">
              <CarriageTemp />
            </AuthWrapper>
          </TabPane> */}
          <TabPane tab="文案说明" key="3">
            <AuthWrapper functionName="f_deliveryStore_text">
              <Copywriting />
            </AuthWrapper>
          </TabPane>
          <TabPane tab="参与商家" key="4">
            <AuthWrapper functionName="f_deliveryStore_list">
              <StoreList />
            </AuthWrapper>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryToStore;
