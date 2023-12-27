import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history, AuthWrapper } from 'qmkit';
import { Breadcrumb, Button } from 'antd';
import AppStore from './store';
import SearchForm from './components/search-form';
import CustomerList from './components/list';
import EditForm from './components/edit-form';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { customerId } = this.props.match.params;
    this.store.init(customerId);
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb>
          <Breadcrumb.Item>导入子账号</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container customer">
          <Headline title="导入子账号" />

          {/*搜索条件*/}
          <SearchForm />

          {/*tab的客户列表*/}
          <CustomerList />

          <EditForm />
        </div>
      </div>
    );
  }
}
