import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { Relax, StoreProvider } from 'plume2';
import { AuthWrapper, Headline } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';
import Tips from './components/tips';

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
          <Breadcrumb.Item>商品标签</Breadcrumb.Item>
        </Breadcrumb>

        {/* <AuthWrapper functionName={'f_goods_label_1'}> */}
        <div className="container">
          {/* 头部标题 */}
          <Headline title="标签管理" />
          <Tips />
          {/* 搜索项区域 */}
          {/*<SearchDataForm />*/}

          {/* 操作按钮区域 */}
          <ButtonGroup />

          {/* 数据列表区域 */}
          <InfoList />

          {/* 编辑弹框 */}
          <EditModal />
        </div>
        {/* </AuthWrapper> */}
      </div>
    );
  }
}
