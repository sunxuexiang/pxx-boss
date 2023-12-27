import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import { Form } from 'antd';
import AppStore from './store';
import SettingForm from './components/setting-form';
const SettingFormDetail = Form.create()(SettingForm);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InviteNewRecord extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container customer">
          <Headline title="首页设置" />

          <SettingFormDetail />
        </div>
      </div>
    );
  }
}
