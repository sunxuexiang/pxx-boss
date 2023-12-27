/*
 * @Author: zengliaohua666 2251604356@qq.com
 * @Date: 2022-08-05 14:19:38
 * @LastEditors: zengliaohua666 2251604356@qq.com
 * @LastEditTime: 2022-08-08 14:48:06
 * @FilePath: \sbc-boss\src\app-live\components\live-tabs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Relax } from 'plume2';
import { Tabs, Form, Button } from 'antd';
const { TabPane } = Tabs;
import { noop } from 'qmkit';

import LiveListSearch from './llive-list/live-list-search-form';
import LiveListTabs from './llive-list/live-list-tabs';
import LiveGoodsSearch from './live-goods/live-goods-search-form';
// import Tool from './live-goods/tool';
import LiveGoodsTab from './live-goods/live-goods-tabs';
import LiveCompanySearch from './live-company/live-company-search-form';
import LiveCompanyTabs from './live-company/live-company-tabs';

const LiveListSearchForm = Relax(Form.create()(LiveListSearch));
const LiveGoodsSearchForm = Relax(Form.create()(LiveGoodsSearch));
const LiveCompanySearchForm = Relax(Form.create()(LiveCompanySearch));

@Relax
export default class LiveTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentCardTab: string;
      setCurrentTab: Function;
    };
  };

  static relaxProps = {
    currentCardTab: 'currentCardTab',
    setCurrentTab: noop
  };

  render() {
    const { currentCardTab, setCurrentTab } = this.props.relaxProps;

    return (
      <Tabs onChange={(key) => setCurrentTab(key)} activeKey={currentCardTab}>
        <TabPane tab="直播列表" key="0">
          {/* 搜索项区域 */}
          <LiveListSearchForm />

          {/* 直播列表tab */}
          <LiveListTabs />
        </TabPane>
        <TabPane tab="直播商品" key="1">
          {/* 搜索项区域 */}
          <LiveGoodsSearchForm />

          {/*批量提审 */}
          {/* <Tool /> */}

          {/* 直播商品库tab */}
          <LiveGoodsTab />
        </TabPane>
        <TabPane tab="直播优惠券" key="2">
          {/* 搜索项区域 */}
          <LiveCompanySearchForm />

          {/* 直播优惠券tab */}
          <LiveCompanyTabs />
        </TabPane>
      </Tabs>
    );
  }
}
