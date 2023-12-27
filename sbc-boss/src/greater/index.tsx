import React from 'react';
import { Button } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import Tips from './compontens/tips';
import SettingForm from './compontens/form';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderSetting extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (

      <div>
          <AuthWrapper functionName={'f_gre'}>

        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>订单</Breadcrumb.Item>
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="零售配送配置" />
          <Tips />

            <SettingForm />
            <div className="bar-button">
              <Button
                type="primary"
                onClick={() => this.store.saveEditConfigs()}
              >
                保存
              </Button>
            </div>

        </div>
        </AuthWrapper>

      </div>

    );
  }
}
