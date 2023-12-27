import React from 'react';

import { Breadcrumb, Tooltip, Icon } from 'antd';
import { StoreProvider } from 'plume2';
import styled from 'styled-components';

import { Headline, BreadCrumb } from 'qmkit';

import Detail from './components/detail';
import List from './components/list';
import Bottom from './components/bottom';
import AppStore from './store';
import './style.less';

const OptionDiv = styled.div`
  width: 100%;
  text-align: right;
  display: block;
  position: absolute;
  right: 40px;
  top: 90px;
`;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BillingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { settleId } = this.props.match.params;
    this.store.init(settleId);
  }

  render() {
    return (
      <div
        style={{
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
          margin: -10,
          padding: 10,
          position: 'relative'
        }}
      >
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>结算明细</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title="结算明细" />
          <OptionDiv>
            <Tooltip placement="bottomLeft" title={this._renderTitle}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />&nbsp;&nbsp;结算说明
              </a>
            </Tooltip>
          </OptionDiv>
          <Detail />
          <List settleId={this.props.match.params.settleId} />
          <Bottom />
        </div>
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <div>
          <p>
            所有订单在订单完成并且超过退款时效的次日入账，如存在未处理完的退单，则延迟到退单处理完成（对应退单状态为：拒绝收货、拒绝退款、已作废、已完成）的次日入账；
          </p>
          <br />
          <p>名词解释：</p>
          <p>- 供货单价：商品供货单价；</p>
          <p>
            - 数量(不含退)：结算时订单中商品数量需排除掉退款完成的数量；
          </p>
          <p>
            - 供应商应收金额：每笔订单供应商应收金额=每个商品供货价×数量；
          </p>
        </div>
      </div>
    );
  };
}
