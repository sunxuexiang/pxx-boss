//财务-订单收款
import React from 'react';
import { StoreProvider } from 'plume2';
import { Form, Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import AddModal from './components/addModal';
import './style.less';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;
  UNSAFE_componentWillMount() {
    const {wareId } = this.props.match.params;
    this.store.init();
    if (this.props.location.state != undefined) {
      this.store.onTabChange(this.props.location.state.key);
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>新增弹窗</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container  resetTable">
          <Headline title="新增弹窗" />
          <AddModal />
        </div>
      </div>
    );
  }
}
