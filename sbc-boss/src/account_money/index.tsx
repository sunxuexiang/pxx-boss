//财务-资金管理-增值税资质审核
import React from 'react';
import { Form } from 'antd';
import { Headline, BreadCrumb,AuthWrapper } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';

// import ButtonGroup from './components/button-group';
import SearchList from './components/search-tab-list';
// import InvoiceModal from './components/invoice-modal';
import Moneyaccount from './components/Moneytotal';
import OperateModal from './components/modal';

const ModalForm = Form.create()(OperateModal as any);

/**
 * 新增增专税发票
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    if (this.props.location.state) {
      this.store.onTabChange(this.props.location.state.key);
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <div>
        <AuthWrapper functionName="f_account_money">
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>开票管理</Breadcrumb.Item>
          <Breadcrumb.Item>增票资质审核</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container resetTable">
          <Headline title="账户余额" />
          <Moneyaccount />
          {/* <SearchForm /> */}
          {/* <ButtonGroup /> */}

          <SearchList />
          {/* <InvoiceModal /> */}

          {/* 禁用弹框 */}
          <ModalForm />
        </div>
        </AuthWrapper>
      </div>
    );
  }
}
