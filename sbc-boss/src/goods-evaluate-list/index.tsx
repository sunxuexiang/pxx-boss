import React from 'react';
import { Alert } from 'antd';
import { StoreProvider } from 'plume2';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import CustomerList from './components/list';
import See from './components/see';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_goods_eval_manage">
        <div>
          {/*导航面包屑*/}
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>评价管理</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container customer">
            <Headline title="评价管理" />
            <div>
              <Alert
                message="可在‘设置-高级设置-商品设置’开启商品评价功能，会员购买订单后可对商家服务和商品进行评价，商品评价经过审核后，在商品列表、商品详情、店铺列表、店铺详情页面查看相应评价内容"
                type="info"
                showIcon
              />
            </div>
            {/*搜索条件*/}
            <SearchForm />
            {/*tab的评价列表*/}
            <CustomerList />
            <See />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
