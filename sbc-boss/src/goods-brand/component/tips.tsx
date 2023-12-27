import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message="对平台品牌的编辑或删除将会影响到签约商家的商品展示与销售，请谨慎操作！"
        type="info"
        // style={{ marginBottom:  }}
      />
    );
  }
}
