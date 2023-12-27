import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline,BreadCrumb,AuthWrapper } from 'qmkit';
import AppStore from './store';
import FundsList from './component/funds-list';
import Search from './component/search';
// import Statistics from './component/statistics';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerFunds extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // this.store.statistics();
    this.store.init();

  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        <AuthWrapper functionName="f_customer_funds_list">
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>会员资金</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="用户鲸币列表" />

          {/*会员资金统计展示区*/}
          {/* <Statistics /> */}

          {/*搜索框*/}
          <Search />

          {/*列表*/}
          <FundsList />
        </div>
        </AuthWrapper>
      </div>
    );
  }
}
