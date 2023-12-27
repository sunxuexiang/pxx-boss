import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { Relax, StoreProvider } from 'plume2';
import { Headline } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.marketId) {
      this.store.init(this.props.location.state.marketId);
    }
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item>物流公司</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          {/* 头部标题 */}
          <Headline title="物流公司列表" />

          {/* 页面提示 */}
          {/*    <TopTips/>*/}

          {/* 搜索项区域 */}
          <SearchDataForm />

          {/* 操作按钮区域 */}
          <ButtonGroup />

          {/* 数据列表区域 */}
          <InfoList />

          {/* 编辑弹框 */}
          <EditModal />
        </div>
      </div>
    );
  }
}
