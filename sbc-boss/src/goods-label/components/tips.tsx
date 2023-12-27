import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.PureComponent<any, any> {
  props: {
    title?: string;
    style?: any;
  };

  render() {
    return (
      <Alert
        message="操作说明"
        description={
          <div>
            <p>1.商品标签最多可设置20个，支持拖拽排序</p>
            <p>
              2.商家可在商品详情页关联已设置的商品标签，启用状态的商品标签会展示在前端商品列表和商品详情页
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
