import React from 'react';
import { Alert } from 'antd';

export default class TopTips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>
              1、通过邀请链接注册或者注册输入邀请人账号的用户均可享受新客价
            </p>
            <p>
              2、该设置代表每位新用户以新客价购买的最大商品数量
            </p>
            <p>
              3、此处代表的是商品的总件数并非商品种类数
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
