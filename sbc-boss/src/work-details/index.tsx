import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import WorkDetailsShow from './componets/work-details';
import Edeit from './componets/work-details-edit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class WorkDetails extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    const { workOrderId } = this.props.match.params;
    const checkFlag = this.props.location.state.checkFlag;
    this.store.init(workOrderId, checkFlag);
  }

  render() {
    return (
      <div>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>客户工单</Breadcrumb.Item>
          <Breadcrumb.Item>编辑工单</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <Headline title="基本设置" />
          <WorkDetailsShow />
          <Headline title="工单信息" />
          <Edeit />
        </div>
      </div>
    );
  }
}
