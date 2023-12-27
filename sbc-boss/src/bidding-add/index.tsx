import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline } from 'qmkit';
import AppStore from './store';
import EditForm from './component/bidding-add-form';
import SortModal from './component/sort-modal';

const BiddingAddForm = Relax(Form.create()(EditForm));

@StoreProvider(AppStore, {})
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { bid } = this.props.match.params;
    const biddingType = this.props.location.state.biddingType;
    this.store.init(bid, biddingType);
  }

  render() {
    const { bid } = this.props.match.params;
    return (
      <div>
        {/* 面包屑导航 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>{bid ? '编辑' : '新增'}商品竞价排名</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          {/* 头部标题 */}
          <Headline title={bid ? '编辑商品竞价排名' : '新增商品竞价排名'} />

          {/* 数据列表区域 */}
          <BiddingAddForm />

          {/*排序*/}
          <SortModal />
        </div>
      </div>
    );
  }
}
