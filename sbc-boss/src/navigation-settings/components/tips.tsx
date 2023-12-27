import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>
              1、导航功能为固定功能，可通过该页面配置，实时替换导航文案、图标
              <br />
              2、每个导航可上传gif、png图片，大小为25kb以内，每个导航两种状态图标
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
