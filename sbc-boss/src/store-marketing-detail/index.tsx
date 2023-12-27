import React from 'react';

import { Breadcrumb, Tabs, Button, message } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history } from 'qmkit';

import AppStore from './store';
import MarketingDes from './common/components/marketing-des';
import GoodsList from './common/components/goods-list';
import Bottom from './common/components/bottom';
import GiftList from './gift-details/components/gift-list';
import MarketingRule from './common/components/marketing-rule';

const MAK_TYPE = {
  0: '满减',
  1: '满折',
  2: '满赠',
  3: '套装'
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { marketingId, pageNum } = this.props.match.params;
    if (pageNum) {
      sessionStorage.setItem('pageNum', pageNum);
    }
    this.store.init(marketingId);
  }
  state = {
    btnDisabled: false,
    goods: [],
    gifList: []
  };

  render() {
    const marketingType = this.store.state().get('marketingType');
    const title = MAK_TYPE[marketingType] + '活动详情';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={title} />

          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab="活动信息" key="0">
              {/*满赠顶部描述*/}
              <MarketingDes />
              {marketingType === 1 ? (
                <MarketingRule />
              ) : marketingType === 2 ? (
                <GiftList />
              ) : (
                <MarketingRule />
              )}
              {/*商品列表*/}
              <GoodsList marketingType={marketingType} />

              {/*满赠底部*/}
              <Bottom />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="领取记录" key="1">
              <CouponRecord />
            </Tabs.TabPane> */}
          </Tabs>

          <div className="bar-button">
            <Button
              onClick={() => {
                history.push('/storeMarketing-list');
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
