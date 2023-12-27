import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import { noop } from 'qmkit';

import LiveCompanyList from './live-company-list';

@Relax
export default class LiveListTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveCompanyTab: string;
      changeLiveCompanyTab: Function;
    };
  };

  static relaxProps = {
    currentLiveCompanyTab: 'currentLiveCompanyTab',
    changeLiveCompanyTab: noop
  };

  render() {
    const {
      currentLiveCompanyTab,
      changeLiveCompanyTab
    } = this.props.relaxProps;

    return (
      <Tabs
        activeKey={currentLiveCompanyTab}
        onChange={(key) => changeLiveCompanyTab(key)}
      >
        <TabPane tab="待审核" key="1">
          <LiveCompanyList />
        </TabPane>
        <TabPane tab="已审核" key="2">
          <LiveCompanyList />
        </TabPane>
        <TabPane tab="审核未通过" key="3">
          <LiveCompanyList />
        </TabPane>
        <TabPane tab="禁用中" key="4">
          <LiveCompanyList />
        </TabPane>
      </Tabs>
    );
  }
}
