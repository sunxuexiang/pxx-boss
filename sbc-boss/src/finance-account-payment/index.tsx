/**
 *财务-收款账户
 */
import React from 'react';
import { Tabs, Card, Button } from 'antd';
import { Headline, BreadCrumb,AuthWrapper } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import AccountList from './components/account-list';
import AccountModal from './components/account-modal';
// import PayModal from './components/pay-modal';
// import UnionB2BModal from './components/union-b2b-modal';
// import WxPayModal from './components/wx_pay_modal';
// import AliPayModal from './components/alipay-modal';
// import BalanceModal from './components/balance-model';
// import ReplaceWxModal from './components/replace-wx-model';
// import ReplaceAliModal from './components/replace-ali-model';
// import Attract from './components/attract';
// import {  AuthWrapper } from '../qmkit/checkAuth';

// const gateways_imgsrc = {
//   PING: require('./img/ju01.png'),
//   UNIONB2B: require('./img/union.png'),
//   WECHAT: require('./img/WeChat.png'),
//   ALIPAY: require('./img/zhifubao.png'),
//   BALANCE: require('./img/balance_pay.png'),
//   REPLACEWECHAT: require('./img/WeChat.png'),
//   REPLACEALIPAY: require('./img/zhifubao.png'),
//   CMB: require('./img/attract.png')
// };

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceAccoutReceivable extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.initOffLineAccounts();
  }

  render() {
    // const gatewaysList = this.store.state().get('gateways');

    return (
      <div>
        <BreadCrumb />
        
        <div className="container">
          <Headline title="付款账户" />
          <Tabs>
            <Tabs.TabPane tab="鲸币提现" key="1">
              <div className="handle-bar">
                <AuthWrapper functionName="f_finance_account_payment_add">
                  <Button
                    type="primary"
                    onClick={() => this.store.onAdd()}
                    disabled={
                      this.store
                        .state()
                        .get('dataList')
                        .count() >= 50
                    }
                  >
                    新增
                  </Button>
                </AuthWrapper>
              </div>

              <AuthWrapper functionName={'f_finance_account_payment_list'}>
                <AccountList />
              </AuthWrapper>
            </Tabs.TabPane>
          </Tabs>

          <AccountModal />
          {/* <PayModal />
          <UnionB2BModal />
          <WxPayModal />
          <AliPayModal />
          <BalanceModal />
          <ReplaceWxModal />
          <ReplaceAliModal />
          <Attract /> */}
        </div>
      </div>
    );
  }
}

// const styles = {
//   methodItem: {
//     padding: 10,
//     textAlign: 'center',
//     paddingBottom: 0
//   } as any,
//   title: {
//     color: '#ffffff',
//     fontSize: 18,
//     paddingTop: 15,
//     paddingBottom: 15
//   } as any,
//   bar: {
//     height: 38,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingLeft: 10,
//     paddingRight: 10
//   } as any,
//   status: {
//     fontSize: 12,
//     color: '#666'
//   },
//   links: {
//     fontSize: 12,
//     marginLeft: 10
//   },
//   imgBox: {
//     width: '100%',
//     textAlign: 'center',
//     height: 150,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     border: '1px solid #f3f3f3'
//   } as any,
//   cardBox: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     flexWrap: 'wrap'
//   } as any,
//   cardContent: {
//     width: 285,
//     marginRight: 20,
//     marginBottom: 20
//   } as any
// };
