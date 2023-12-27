import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import BrandList from './component/brand-list';
import BrandModal from './component/brand-modal';
import Tool from './component/tool';
import Search from './component/search';
import Tips from './component/tips';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsBrand extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
    this.store.getMaxNum();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品品牌</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="商品品牌">
            <span className="brandsTotal">
              当前共 {this.store.state().get('total')} 个品牌
            </span>
          </Headline>

          {/*提示信息*/}
          <Tips />

          {/*搜索框*/}
          <Search />

          {/*工具条*/}
          <Tool />

          {/*列表*/}
          <BrandList />

          {/*弹框*/}
          <BrandModal />
        </div>
      </div>
    );
  }
}
