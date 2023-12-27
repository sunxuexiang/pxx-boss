import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import BrandList from './component/brand-list';
import BrandModal from './component/brand-modal';
import Tool from './component/tool';
import Search from './component/search';
import Tips from './component/tips';
import { Breadcrumb } from 'antd';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsBrand extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { cateId } = this.props.location.state;
    this.store.editCateId(cateId);
  }

  render() {
    const { cateName, cateId } = this.props.location.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{cateName}</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品品牌</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="分类品牌排序"></Headline>
          <div className="brandsTotal" style={{ marginBottom: 16 }}>
            当前类目：{cateName}
          </div>
          {/*提示信息*/}
          {/* <Tips /> */}

          {/*搜索框*/}
          <Search cateId={cateId} />

          {/*工具条*/}
          <Tool cateId={cateId} cateName={cateName} />

          {/*列表*/}
          <BrandList cateId={cateId} />

          {/*弹框*/}
          <BrandModal cateId={cateId} />
        </div>
      </div>
    );
  }
}
