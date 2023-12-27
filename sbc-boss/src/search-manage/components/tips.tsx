import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    const { type } = this.props;
    if (type == 'preset') {
      return (
        <Alert
          message=""
          description={
            <div>
              <p>
                您可添加预置搜索词，预置搜索词将会展示在搜索上，并在进入搜索页面时自动填写在搜索文本框内
              </p>
              <p>最多可设置20个热搜词，可通过拖拽排序调整在前端的展示顺序；</p>
            </div>
          }
          type="info"
        />
      );
    } else if (type == 'association') {
      return (
        <Alert
          message=""
          description={
            <div>
              <p>您可以添加搜索词、搜索词的联想词、搜索联想词的长尾词；</p>
              <p>
                每个搜索词最多可设置20个联想词，可通过拖拽排序调整联想词在前端的展示顺序；
              </p>
            </div>
          }
          type="info"
        />
      );
    } else if (type == 'popular') {
      return (
        <Alert
          message=""
          description={
            <div>
              <p>
                您可以添加热搜词，还可以设置热搜词的点击落地页，热搜词会展示在搜索页面，设置了落地页的热门搜索词点击后可直接跳转页面；
              </p>
              <p>最多可设置20个热搜词，可通过拖拽排序调整在前端的展示顺序；</p>
            </div>
          }
          type="info"
        />
      );
    } else {
      return <div />;
    }
  }
}
