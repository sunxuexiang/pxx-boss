import React from 'react';

import { Tabs } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import List from './list';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      extractStatus: any;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    extractStatus: 'extractStatus'
  };

  render() {
    const { onTabChange, extractStatus } = this.props.relaxProps;
    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={extractStatus}
        >
          <Tabs.TabPane tab="全部" key="0">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="待审核" key="1">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="待打款" key="2">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已完成" key="3">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已拒绝" key="4">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已取消" key="6">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="打款失败" key="5">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
