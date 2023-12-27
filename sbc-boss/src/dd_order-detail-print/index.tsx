import React from 'react';
import { Breadcrumb, Button, message, Modal } from 'antd';
import { StoreProvider, IMap, Relax } from 'plume2';
import AppStore from './store';

import OrderPrintHeader from './components/order-print-header';
import OrderPrintBody from './components/order-print-body';
import OrderPrintBottom from './components/order-print-bottom';
import Headline from './components/head-line';

import { BreadCrumb, noop, Const, history } from 'qmkit';
import { setPrintCount } from './webapi';
import './index.less';

const { confirm } = Modal;
/**
 * 订单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderDetailPrint extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { tid } = this.props.match.params;
    this.store.init(tid);
  }

  render() {
    const detail = this.store.state().get('detail');
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const userInfo = JSON.parse(
      sessionStorage.getItem('s2b-platform@login') || '{}'
    );
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>订单打印</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="订单打印" />
          <div id="container-print">
            <div className="container-print-body">
              <OrderPrintHeader />
              <OrderPrintBody />
              <OrderPrintBottom />
              {/* <div style={{ marginTop: '20px' }}>
                <div>温馨提示：</div>
                <div>
                  1.所有商品非质量问题，概不退货（一线及进口产品坚果炒货裸散无售后）。
                </div>
                <div>
                  2.自提及送货上门客户，请当面核对商品品类及数量，并请签字确认。
                </div>
                <div>
                  3.本货物为代办运输，货交第一承运人户的风险由客户承担。
                </div>
                <div>
                  4.接货时请检查外包装（可拆箱检查），第三方物流配送损坏而造成的损失，请跟物流当面沟通处理。
                </div>
                <div>
                  5.保质期未过三分之一，不失为老期产品，不得因此而退货。
                </div>
                <div>最终解释权归大白鲸所有。</div>
              </div> */}
            </div>
          </div>
          <div className="bar-button">
            {/* {flowState === 'AUDIT' &&
            payState === 'PAID' &&
            ['system', '13068208375', '18374975168', '18188888888'].includes(
              userInfo.accountName
            ) &&
            !detail.get('pickingStatus') ? (
              <Button
                type="primary"
                style={{ marginRight: '16px' }}
                onClick={() => {
                  Modal.confirm({
                    title: '是否已拣货',
                    onOk: () => {
                      this.store.onOrderPicking();
                    }
                  });
                }}
              >
                拣货
              </Button>
            ) : null} */}
            <Button type="primary" onClick={this._showPrinyTip}>
              打印
            </Button>
            <Button
              type="primary"
              onClick={() => history.push({ pathname: '/order-list' })}
              style={{ marginLeft: '12px' }}
            >
              返回
            </Button>
          </div>
        </div>
      </div>
    );
  }

  _showPrinyTip = () => {
    const printCount = this.store.state().getIn(['detail', 'printCount']);
    if (printCount && printCount > 0) {
      confirm({
        title: `您的剩余可打印次数为${printCount},是否继续打印？`,
        onOk: async () => {
          const { tid } = this.props.match.params;
          const { res } = await setPrintCount(tid);
          if (res && res.code === Const.SUCCESS_CODE) {
            this._printInfo();
          } else {
            message.error(res.message || '');
          }
        }
      });
    } else {
      message.error('您的剩余可打印次数为0，不可打印', 4);
    }
  };

  _printInfo() {
    window.document
      .getElementsByClassName('container-print-body')[0]
      .setAttribute('style', 'padding: 32px 16px;');
    window.document.body.innerHTML =
      window.document.getElementById('container-print').innerHTML;
    window.print();
    window.location.reload();
  }
}
