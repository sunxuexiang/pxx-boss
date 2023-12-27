import React from 'react';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const type = this.props.match.path === '/store-activity-list' ? 2 : 1;
    this.store.init({ pageNum: 0, pageSize: 10 }, type);
    if (type === 1) {
      this.store.checkIEP();
    } else {
      this.store.getStoreList();
    }
  }

  render() {
    return (
      <AuthWrapper
        functionName={'f_coupon_activity_list,f_store_activity_list'}
      >
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
            <Breadcrumb.Item>优惠券活动</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container activity">
            <Headline title="优惠券活动" />
            <SearchHead />

            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
