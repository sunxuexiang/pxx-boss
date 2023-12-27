import React from 'react';

import { StoreProvider } from 'plume2';
import { message } from 'antd';
import { Headline, BreadCrumb, checkAuth } from 'qmkit';
import List from './components/list';
import AppStore from './store';
import Tips from './components/tips';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SensitiveWordsList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    //有查看权限，方能查询
    if (checkAuth('f_navigation-settings_0')) {
      this.store.init();
    } else {
      message.error('此功能您没有权限访问');
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>站点设置</Breadcrumb.Item>
          <Breadcrumb.Item>敏感词库</Breadcrumb.Item>
        </Breadcrumb> */}
        {/* <AuthWrapper functionName="f_navigation-settings_0"> */}
        <div className="container">
          <Headline title="满系图标" />
          <Tips />

          <List />
        </div>
        {/* </AuthWrapper> */}
      </div>
    );
  }
}
