import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import CustomerList from './components/tab-data-grid';
import CustomerModal from './components/customer-modal';
import RejectModal from './components/reject-modal';
import ForbidModal from './components/forbid-modal';
import ImportModal from './components/customer-import-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else if (state && state.addCustomer) {
      this.store.onAdd();
      this.store.init();
    } else {
      this.store.init();
    }
    this.store.getCRMConfig();
  }

  render() {
    console.log(this.state);
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>客户管理</Breadcrumb.Item>
          <Breadcrumb.Item>客户列表</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container customer">
          <Headline title="客户列表" />

          {/*搜索条件*/}
          <SearchForm />

          {/*操作按钮组*/}
          <ButtonGroup />

          {/*tab的客户列表*/}
          <CustomerList />

          {/*新增弹窗*/}
          <CustomerModal />

          {/*驳回弹窗*/}
          <RejectModal />

          {/*禁用弹窗*/}
          <ForbidModal />
          {/* 批量导入客户 */}
          <ImportModal />
        </div>
      </div>
    );
  }
}
