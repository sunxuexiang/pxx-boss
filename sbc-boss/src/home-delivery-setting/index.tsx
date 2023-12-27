import React from 'react';
import { Form, Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';
import SettingFormBoss from './components/setting-form-boss';
import { StoreProvider } from 'plume2';
import AppStore from './store';
const SettingFormDetail = Form.create()(SettingForm);
const SettingFormDetail2 = Form.create()(SettingFormBoss);

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  render() {
    const avtiveTab = this.store.state().get('activeTab');
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="配送方式文案" />
          <Tabs
            activeKey={avtiveTab}
            onChange={(key) => this.store.changeActiveTab(key)}
          >
            <Tabs.TabPane tab="APP说明" key="1">
              {avtiveTab === '1' && <SettingFormDetail />}
            </Tabs.TabPane>
            <Tabs.TabPane tab="后台说明" key="2">
              {avtiveTab === '2' && <SettingFormDetail2 />}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
