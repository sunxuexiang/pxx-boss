import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, AuthWrapper } from 'qmkit';
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
    this.store.onSearchPage();
    this.store.init();
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>缺货记录</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container tab-but">
          {/* 头部标题 */}
          <Headline title="缺货记录" />
          <AuthWrapper functionName={'f_goods_outStock_list1'}>
            {/* 页面提示 */}
            {/*  <TopTips />*/}

            {/* 搜索项区域 */}
            <SearchDataForm />

            {/* 操作按钮区域 */}
            <ButtonGroup />

            {/* 数据列表区域 */}
            <InfoList />
          </AuthWrapper>
        </div>
      </div>
    );
  }
}
