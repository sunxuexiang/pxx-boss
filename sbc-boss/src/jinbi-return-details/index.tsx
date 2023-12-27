import React from 'react';

import { Breadcrumb, Tabs, Button } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history } from 'qmkit';

import AppStore from './store';
import JinbiReturnDes from './common/components/jinbi-return-des';
import GoodsList from './common/components/goods-list';
import Bottom from './common/components/bottom';
import JinbiReturnRecord from './common/components/jinbi-return-record';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiReturnDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { activityId, pageNum, have } = this.props.match.params;
    if (pageNum) {
      sessionStorage.setItem('pageNum', pageNum);
    }
    this.store.init(activityId);
    if (!have) {
      this.store.getRecordInfo({ pageNum: 0, pageSize: 10 }, activityId);
    }
  }

  render() {
    const title = '返鲸币活动详情';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={title} />

          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab="活动信息" key="0">
              {/*返鲸币活动顶部描述*/}
              <JinbiReturnDes />
              {/*商品列表*/}
              <GoodsList />

              {/*返鲸币活动底部*/}
              <Bottom />
            </Tabs.TabPane>
            <Tabs.TabPane tab="领取记录" key="1">
              <JinbiReturnRecord />
            </Tabs.TabPane>
          </Tabs>

          <div className="bar-button">
            <Button
              onClick={() => {
                history.push('/jinbi-return-list');
              }}
              style={{ marginLeft: 10 }}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
