import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import InformList from './info-list';
import { noop } from 'qmkit';
import CustomerList from '../../customer-list/components/list';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      searchData: IMap;
      tabStatus: any;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    searchData: 'searchData',
    tabStatus: 'tabStatus'
  };

  render() {
    const { onTabChange, searchData } = this.props.relaxProps;
    const status = searchData.get('status');

    return (
      <Tabs
        onChange={(key) => onTabChange(key)}
        activeKey={status}
        defaultActiveKey="-1"
      >
        <Tabs.TabPane tab="全部" key="-1">
          <InformList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="待处理" key="0">
          <InformList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="已处理" key="1">
          <InformList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
