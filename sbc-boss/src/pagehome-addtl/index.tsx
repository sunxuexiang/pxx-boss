import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import RegisteredAddForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(RegisteredAddForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { advertisingId, wareId } = this.props.match.params;
    console.log(advertisingId, 'advertisingIdadvertisingId');
    this.store.changeFormField({ wareId: wareId });
    if (advertisingId) {
      this.store.init(wareId, advertisingId, this._form.initSelectStore);
      console.log(this._form);
    }
  }

  render() {
    const id = this.store.state().getIn(['activity', 'advertisingId']);
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return [
      <AuthWrapper functionName={'f_coupon_addhome'}>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{id ? '编辑' : '创建'}通栏推荐位</Breadcrumb.Item>
        </BreadCrumb>
        ,
        <div className="container" key="container">
          <Headline title={id ? '编辑通栏推荐位' : '创建通栏推荐位'} />
          <WrappedForm wrappedComponentRef={(form) => (this._form = form)} />
        </div>
      </AuthWrapper>
    ];
  }
}
