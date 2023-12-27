import React, { Component, useContext } from 'react';
import { Form,Breadcrumb} from 'antd';
import { AuthWrapper, BreadCrumb } from 'qmkit';
// import { noop, SelectGroup, Const } from 'qmkit';
import FromBanner from './compontent/from-banner';
import FormColumns from './compontent/form-columns';
import { StoreProvider, Relax } from 'plume2';
// import querystring from 'query-string';
import Stores from './store';
// import { timeStamp } from 'console';
const BiFromBanner = Relax(Form.create()(FromBanner));
const BiFormColumns = Relax(Form.create()(FormColumns));
@StoreProvider(Stores, { debug: __DEV__ })
export default class Start extends Component {
  store: Stores;
  constructor(props, context) {
    super(props);
  }
  state={
    params:{
      type:0,
      id:null
    }
  }
  componentDidMount() {
    let obj: any = this.props;
    const params = obj.match.params;
    this.setState({params});
    this.store.queryBut(params);
  }
  render() {
    return (
      // <AuthWrapper functionName='f_batch_advertising'>
      <div>
        {/* <BreadCrumb /> */}
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{this.state.params.id ? '编辑' : '创建'}{Number(this.state.params.type)? '分栏' : '通栏'}推荐位</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container coupon">
          {!Number(this.state.params.type)? <BiFromBanner /> : <BiFormColumns />}
        </div>
      </div>
      // </AuthWrapper>
    );
  }
}
