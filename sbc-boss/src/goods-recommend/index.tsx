import React from 'react';
import { Alert, Breadcrumb, Button, Form, Radio, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline } from 'qmkit';
import GoodsRecommendForm from './components/goods-recommend-form';
import AppStore from './store';
import { GoodsCatesModal } from 'biz';
import RadioGroup from 'antd/es/radio/group';
import styled from 'styled-components';
import IntelligentRecommend from './components/intelligent_recommend_form';

const TitleBox = styled.div`
  background: #fafafa;
  height: 60px;
  padding-left: 10px;
  padding-right: 20px;
  line-height: 60px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-radio-group {
    width: calc(100% - 230px);
    margin-left: 20px;
    .ant-radio-wrapper:last-child {
      margin-left: 40px;
    }
  }
`;
const GoodsRecommendFormWrapper = Form.create()(GoodsRecommendForm);
const IntelligentRecommendWrapper = Form.create()(IntelligentRecommend);
@StoreProvider(AppStore, { debug: __DEV__ })
export default class AppShare extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.onWareHousePage();
  }

  render() {
    const store = this.store as any;
    const state = store.state();
    const strategy = state.get('strategy');
    const isIntelligentRecommend = state.get('tab');
    const goodsModalVisible = state.get('goodsModalVisible');
    const goodsRows = state.get('goodsRows');
    let goodsInfoIds = goodsRows.toJS()
      ? goodsRows.map((item, i) => {
          return item.get('goodsInfoId');
        })
      : [];
    const wareId = state.get('wareId');
    console.log('wareId', wareId);
    // let goodsInfoIds =
    //   state.get('goodsInfoIds') == null ? [] : state.get('goodsInfoIds');

    return (
      <div>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品推荐</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <Headline title="商品推荐" />
          <Alert
            message={
              <div>
                此功能涉及到前端各模块的推荐商品展示，设置即时生效，请谨慎选择。
              </div>
            }
            type="info"
            showIcon
          />
          <TitleBox>
            设置推荐策略:
            <RadioGroup
              onChange={(e: any) =>
                this.store.fieldSave({
                  field: 'strategy',
                  value: e.target.value
                })
              }
              value={strategy}
            >
              <Radio value={0}>手动推荐</Radio>
              <Radio value={1}>智能推荐</Radio>
            </RadioGroup>
            <Button type="primary" onClick={() => this._saveStrategy(strategy)}>
              保存设置
            </Button>
          </TitleBox>

          <Tabs
            activeKey={isIntelligentRecommend + ''}
            defaultActiveKey={isIntelligentRecommend + ''}
            onChange={(value) => this.store.fieldSave({ field: 'tab', value })}
            tabBarStyle={{ marginTop: 16 }}
          >
            <Tabs.TabPane tab="手动推荐" key={0 + ''}>
              <GoodsCatesModal
                showValidGood={true}
                checkAddedGood={true}
                visible={goodsModalVisible}
                selectedSkuIds={goodsInfoIds.toJS()}
                selectedRows={goodsRows.toJS()}
                onOkBackFun={this._onOkBackFun}
                onCancelBackFun={store.onCancelBackFun}
                searchForm={{ wareId: wareId }}
                skuLimit={500}
              />
              <GoodsRecommendFormWrapper />
            </Tabs.TabPane>
            <Tabs.TabPane tab="智能推荐" key={1 + ''}>
              <IntelligentRecommendWrapper />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    this.store.onOkBackFun(skuIds, rows);
  };

  /**
   * 保存推荐策略
   */
  _saveStrategy = (strategy) => {
    this.store.onStrategyFun(strategy);
  };
}
