import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-tab-list';
import './index.less';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderList extends Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const buyerId = this.props.buyerId;
    if (buyerId) {
      this.store.setData({ field: 'type', value: 'modal' });
      this.store.setData({ field: 'buyerId', value: buyerId });
      this.store.onSearch({
        buyerId,
        consigneeName: '',
        id: '',
        orderType: 'NORMAL_ORDER',
        pageNum: 0,
        pageSize: 10,
        skuName: '',
        supplierName: '',
        tradeState: {}
      });
      return;
    }

    const state = this.props.location.state;

    if (state) {
      if (state.key) {
        this.store.onTabChange(this.props.location.state.key);
      }

      if (state.payStatus) {
        const params = {
          tradeState: { payState: state.payStatus }
        };
        this.store.onSearch(params);
      }
    } else {
      let searchCacheForm =
        JSON.parse(sessionStorage.getItem('searchCacheForm')) || {};
      let orderForm = searchCacheForm?.orderForm || {};
      let orderAddonBeforeForm = searchCacheForm?.orderAddonBeforeForm || {};
      let tabKey = searchCacheForm?.tabKey || '';
      this.store.onWareHousePage();
      if (orderForm?.pageSize) {
        this.store.onSearchOrderForm(orderForm, orderAddonBeforeForm, tabKey);
      } else {
        this.store.init();
      }
      delete searchCacheForm['orderForm'];
      delete searchCacheForm['orderAddonBeforeForm'];
      delete searchCacheForm['tabKey'];
      sessionStorage.setItem(
        'searchCacheForm',
        JSON.stringify(searchCacheForm)
      );
    }
  }

  render() {
    return (
      <div className="order-con">
        {!this.props.buyerId && <BreadCrumb />}
        <div
          className="container"
          style={this.props.buyerId ? { padding: 0, margin: 0 } : {}}
        >
          <SearchHead buyerId={this.props.buyerId} />
          <SearchList />
        </div>
      </div>
    );
  }
}
