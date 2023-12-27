import React from 'react';
import { Alert } from 'antd';
import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import PrivacyPolicySetting from './components/privacy-policy-setting';
import PicModal from './components/pic-modal';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;
  _a: any;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
  }

  render() {
    return (
      <div>
        <AuthWrapper functionName={'f_privacy_cancella'}>
          <BreadCrumb />
          <div className="container">
            <Headline title="注销政策设置" />
            {/* <Alert
              message={
                <div>
                  <p>用户首次启动App时</p>
                </div>
              }
              type="info"
            /> */}
            <PrivacyPolicySetting />
            <PicModal />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
