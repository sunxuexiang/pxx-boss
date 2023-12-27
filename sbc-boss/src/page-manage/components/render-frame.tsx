import React from 'react';
import { Const } from 'qmkit';
import MagicBox from '@wanmi/magic-box';
import './render-frame.less';

export default class RenderFrame extends React.Component<any, any> {
  render() {
    return (
      <div className="render-frame">
        <MagicBox
          style={{
            height: '100vh',
            paddingBottom: 44,
            WebkitOverflowScrolling: 'auto'
          }}
          {...props}
        />
      </div>
    );
  }
}

const props = {
  renderHost: Const.RENDER_HOST,
  ossHost: Const.OSS_HOST,
  systemCode: 'd2cStore',
  envCode: 'test1',
  storeId: '',
  platform: 'weixin',
  pageType: 'index',
  uid: '000000',
  onDataLoaded: ({ title, shareInfo }) => {
    document.title = title;
    let shareTitle = shareInfo ? shareInfo.title : '';
    if (shareTitle == '') {
      shareTitle = title;
    }
  },
  api: {}
};
