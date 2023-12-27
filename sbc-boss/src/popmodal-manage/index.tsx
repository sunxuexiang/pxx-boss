//财务-订单收款
import React from 'react';
import { StoreProvider } from 'plume2';
import { Form } from 'antd';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';

import './style.less';

import TabInfoGrid from './components/tab-info-grid';

const TabModalaGrid = Form.create()(TabInfoGrid as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {
    if (this.props.location.state != undefined) {
      this.store.onTabChange(this.props.location.state.key);
    }
    this.store.init({ isInit: true });
    this.store.onWareHousePage();
  }
  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container  resetTable">
          <Headline title="弹窗管理" />
          <AuthWrapper functionName="f_popup_administration">
            <TabModalaGrid />
          </AuthWrapper>
        </div>
      </div>
    );
  }
}
