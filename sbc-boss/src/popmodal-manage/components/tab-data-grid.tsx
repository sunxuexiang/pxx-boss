import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import SearchForm from './search-form';
import ButtonGroup from './button-group';
import PayOrderList from './list';
import ReceiveModal from './receive-modal';
import ReceiveViewModal from './receive-view-modal';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      onTabChange: Function;
      queryTab: string;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    queryTab: 'queryTab'
  };

  render() {
    const { onTabChange, queryTab } = this.props.relaxProps;
    return (
      <Tabs
        onChange={(key) => onTabChange(key)}
        activeKey={queryTab.toString()}
      >
        <Tabs.TabPane tab="全部" key="0" className="resetTable">
          <PayOrderList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="进行中" key="1" className="resetTable">
          <PayOrderList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="暂停中" key="2" className="resetTable">
          <PayOrderList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="未开始" key="3" className="resetTable">
          <PayOrderList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="已结束" key="4" className="resetTable">
          <PayOrderList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
