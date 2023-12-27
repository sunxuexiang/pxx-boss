import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs, Button } from 'antd';
import InformList from './info-list';
import { noop } from 'qmkit';
import styled from 'styled-components';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      onExportModalShow: Function;
      searchData: IMap;
      replenishmentFlag: any;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    onExportModalShow: noop,
    searchData: 'searchData',
    replenishmentFlag: 'replenishmentFlag'
  };

  render() {
    const { onTabChange, searchData, onExportModalShow } =
      this.props.relaxProps;
    const replenishmentFlag = searchData.get('replenishmentFlag');
    const operations = (
      <Button
        style={{ display: 'block' }}
        onClick={() => {
          onExportModalShow({
            byParamsTitle: '导出筛选出的信息',
            byIdsTitle: '导出勾选的信息',
            byAllTitle: '导出全部信息'
          });
        }}
      >
        批量导出
      </Button>
    );
    return (
      <Tabs
        onChange={(key) => onTabChange(key)}
        activeKey={replenishmentFlag}
        defaultActiveKey="0"
        tabBarExtraContent={operations}
      >
        <Tabs.TabPane tab="缺货提醒" key="2">
          <InformList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="暂未补齐" key="0">
          <InformList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="已经补齐" key="1">
          <InformList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
