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
              通过移动建站增加该分类页轮播管理，可自由对一级类目添加轮播，添加轮播后，仅支持在移动端首页配置了单独的一级分类页入口页面展示该轮播；
            </p>
            <p>前端展示：需保证运营一级类目已配置完成，且轮播状态为“显示”</p>
          </div>
        }
        type="info"
      />
    );
  }
}
