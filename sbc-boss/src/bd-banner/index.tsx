import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';
import { Store } from 'plume2';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BdBannerSetting extends React.Component<any, any> {
  store: AppStore;

  _store: Store;
  constructor(props) {
    super(props);
    console.log(this, '这个值');
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const SettingFormDetail = Form.create({})(SettingForm);

    return (
      <AuthWrapper functionName="f_bd_banner">
        <div>
          <BreadCrumb />
          <div className="container">
            <Headline title="首页banner设置" />
            <SettingFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
