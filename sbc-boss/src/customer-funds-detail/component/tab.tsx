import React from 'react';
import { IMap, Relax } from 'plume2';

import { Tabs } from 'antd';
import { noop } from 'qmkit';

import List from '../component/list';
import Search from './search';
@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changeTab: Function;
      searchForm: IMap;
    };
  };

  static relaxProps = {
    changeTab: noop,
    searchForm: 'searchForm'
  };

  render() {
    const { searchForm } = this.props.relaxProps;
    const key = searchForm.get('tabType');
    return (
      <div>
        <Tabs activeKey={key} onChange={(key) => this._handleClick(key)}>
          <Tabs.TabPane tab="鲸币明细" key="1">
            {/*搜索框*/}
            <Search />
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }

  /**
   * 切换tab
   */
  _handleClick = (key) => {
    this.props.relaxProps.changeTab(key);
  };
}
