import React from 'react';
import { Relax } from 'plume2';
import { Tabs, Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import TabDataGrid from './tab-data-grid';
import ListManage from './list-manage';
import SearchForm from './search-form';
import PayOrderList from './list';

@Relax
export default class TabInfoGrid extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      onTabChangeInfo: Function;
      infoKey: 'infoKey';
    };
  };

  static relaxProps = {
    onTabChangeInfo: noop,
    infoKey: 'infoKey'
  };

  render() {
    const { onTabChangeInfo, infoKey } = this.props.relaxProps;
    return (
      <Tabs
        type="card"
        onChange={(key) => onTabChangeInfo(key)}
        activeKey={infoKey}
      >
        <Tabs.TabPane tab="弹窗列表" key="0" className="resetTable">
          <SearchForm />
          <TabDataGrid />
        </Tabs.TabPane>
        <Tabs.TabPane tab="页面弹窗管理" key="1" className="resetTable">
          <ListManage />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
