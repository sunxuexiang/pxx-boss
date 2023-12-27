import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline } from 'qmkit';
import AppStore from './store';
import TopTips from './components/top-tips';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/tab-data-grid';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>竞价排名</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          {/* 头部标题 */}
          <Headline title="商品竞价排名" />

          {/* 页面提示 */}
          {/*  <TopTips />*/}

          {/* 搜索项区域 */}
          <SearchDataForm />

          {/* 操作按钮区域 */}
          <ButtonGroup />

          {/* 数据列表区域 */}
          <InfoList />
        </div>
      </div>
    );
  }
}
