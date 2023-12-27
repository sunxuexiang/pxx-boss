import React, { Component } from 'react';
import { Popconfirm, Form, Input, Button, Select } from 'antd';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
// import { noop, SelectGroup, Const } from 'qmkit';
import Fromsa from './compontent/from';
import List from './compontent/list';
import { StoreProvider } from 'plume2';

import Stores from './store';

@StoreProvider(Stores, { debug: __DEV__ })
export default class Start extends Component {
  store: Stores;
  componentDidMount() {
    this.store.init();
  }
  render() {
    return (
      <AuthWrapper functionName={'start'}>
        <div>
          <BreadCrumb />
          <div className="container coupon">
            <Fromsa  />
            <List />
          </div>
        </div>
      </AuthWrapper>
    )
  }
}
