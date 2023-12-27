import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import GoodsList from './components/goods-list';
import ForbidModal from './components/forbid-modal';
import SortModal from './components/sort-modal';
import Tool from './components/tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const pageNum = sessionStorage.getItem('pageNum');
    this.store.init({ pageNum: pageNum ? Number(pageNum) : 0, pageSize: 10 });
    sessionStorage.removeItem('pageNum');
  }
  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品列表</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="商品列表" />

          {/*搜索*/}
          <SearchForm />

          {/*工具条*/}
          {/* <Tool /> */}

          {/*列表*/}
          <GoodsList />

          {/*禁售理由弹出框*/}
          <ForbidModal />
          {/*价格弹框*/}
          <SortModal />
        </div>
      </div>
    );
  }
}
