import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import EvaluateList from './components/tab-data-grid';
import SeeRecord from './components/see-record';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreEvaluateList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
      this.store.init();
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商家</Breadcrumb.Item>
          <Breadcrumb.Item>商家管理</Breadcrumb.Item>
          <Breadcrumb.Item>商家评价</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container storeEvaluate">
          <Headline title="商家评价" />
          {/*tab的商家评价*/}
          <EvaluateList />
          <SeeRecord />
        </div>
      </div>
    );
  }
}
