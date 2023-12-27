import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { Tabs } from 'antd';
import AppStore from './store';

import MoneyInfo from './components/money-info';
import UserSearch from './components/user-form';
import UserList from './components/user-list';
import CompanySearch from './components/company-form';
import CompanyList from './components/company-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiAccount extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const currentTab = this.store.state().get('currentTab');
    return (
      <AuthWrapper functionName="f_jinbi_account">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          <div className="container customer">
            <Headline title="鲸币账户列表" />

            <Tabs
              activeKey={currentTab}
              onChange={(activeKey) => this.store.tabChange(activeKey)}
            >
              <Tabs.TabPane tab="用户账户" key="0" forceRender>
                <MoneyInfo />
                <UserSearch />
                <UserList />
              </Tabs.TabPane>
              <Tabs.TabPane tab="企业账户" key="1" forceRender>
                <MoneyInfo />
                <CompanySearch />
                <CompanyList />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
