import React from 'react';
import { StoreProvider } from 'plume2';
import { BreadCrumb, AuthWrapper } from 'qmkit';
import { Tabs, Breadcrumb } from 'antd';
import AppStore from './store';

import AccountInfo from './components/account-indo';
import SearchForm from './components/search-form';
import AccountList from './components/list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiAccountDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { type, id } = this.props.match.params;
    this.store.init(id, type === 'company');
  }

  render() {
    const { type } = this.props.match.params;
    return (
      <AuthWrapper functionName="f_jinbi_account_detail">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>账户明细</Breadcrumb.Item>
          </BreadCrumb>
          {/*导航面包屑*/}
          <div className="container customer">
            <AccountInfo />
            <Tabs defaultActiveKey="0">
              <Tabs.TabPane tab="账户明细" key="0"></Tabs.TabPane>
            </Tabs>
            <SearchForm type={type} />
            <AccountList type={type} />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
