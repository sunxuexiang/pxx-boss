import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import SettingEditor from './components/setting-ueditor';
import PrintSettingHead from './components/print-setting-header';
import PicModal from './components/pic-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PrintSetting extends React.Component<any, any> {
  store: AppStore;

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
        <BreadCrumb />
        <div className="container">
          <Headline title="打印设置" />
          <div>
            <PrintSettingHead />
          </div>
          <div style={{ marginTop: 20 }}>
            <SettingEditor />
          </div>
          <PicModal />
        </div>
      </div>
    );
  }
}
