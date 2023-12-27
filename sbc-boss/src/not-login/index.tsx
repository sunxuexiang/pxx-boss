import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import Appstore from './store';
import SpecifyAddForm from './components/add-form';

const WrappedForm = Form.create()(SpecifyAddForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { activityId } = this.props.match.params;
    this.store.init(activityId);
  }

  render() {
    const id = this.store.state().getIn(['activity', 'activityId']);
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{id ? '编辑' : '创建'}久未登录赠劵</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline title={id ? '编辑久未登录赠劵' : '创建久未登录赠劵'} />
        <Alert
          message={
            <div>
              <p>操作说明：</p>
              <p>优惠券将在指定发放时间发放至用户账户，无需用户手动领取；</p>
            </div>
          }
          type="info"
        />
        <WrappedForm ref={(form) => (this._form = form)} />
      </div>
    ];
  }
}
