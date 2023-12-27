import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import { Tabs } from 'antd';
import ContractList from './components/contract-list';
import TemplateList from './components/template-list';
import WaitList from './components/wait-list';
import PdfModal from './components/pdf-modal';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BusinessContract extends React.Component<any, any> {
  store: AppStore;
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '0'
    };
  }

  componentDidMount(): void {
    this.store.getManagerList();
    this.store.getAllMarkets();
    this.store.getContractList('waitList');
    this.store.getContractList('contract');
  }

  render() {
    const { tabKey } = this.state;
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container storeEvaluate">
          <Headline title="商家合同" />
          <Tabs onChange={(key) => this.onTabChange(key)} activeKey={tabKey}>
            <Tabs.TabPane tab="未签署合同" key="0">
              <WaitList tabKey={tabKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="已签署合同" key="1">
              <ContractList tabKey={tabKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="合同模板" key="2">
              <Tabs defaultActiveKey="isPerson">
                <Tabs.TabPane tab="个体工商户" key="isPerson">
                  <TemplateList isPerson={1} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="企事业单位" key="isCompany">
                  <TemplateList isPerson={2} />
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
          </Tabs>
          <PdfModal />
        </div>
      </div>
    );
  }

  onTabChange = (key) => {
    this.setState({ tabKey: key });
  };
}
