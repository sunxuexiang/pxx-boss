import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StockActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.getStoreList();
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_stock_activities_list'}>
        <div>
          <BreadCrumb />
          <div className="container activity">
            <Headline title="囤货活动列表" />
            <SearchHead />
            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
