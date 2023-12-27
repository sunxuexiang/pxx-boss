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
  constructor(props) {
    super(props);
    this.state = {
      modalName: ''
    };
  }
  UNSAFE_componentWillMount() {
    const { id, name } = this.props.match.params;
    this.setState({
      modalName: name
    });
    this.store.init(id);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>页面弹窗管理</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container  resetTable">
          <Headline title="页面弹窗管理" />
          <AddModal modalName={this.state.modalName} />
        </div>
      </div>
    );
  }
}
