import React from 'react';
import { Form } from 'antd';
import { Headline, BreadCrumb ,AuthWrapper} from 'qmkit';
import SettingForm from './components/setting-form';
import { StoreProvider } from 'plume2';
import AppStore from './store';
const SettingFormDetail = Form.create()(SettingForm);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_balance_instructions'}>
      <div>
        <BreadCrumb />
        <div className="container">
          {/* <Headline title="余额说明" /> */}
          <SettingFormDetail />
        </div>
      </div>
      </AuthWrapper>
    );
  }
}
