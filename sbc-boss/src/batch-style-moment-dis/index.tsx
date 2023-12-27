import React, { Component, useContext } from 'react';
import { Form } from 'antd';
import { AuthWrapper, BreadCrumb,Headline} from 'qmkit';
import { Alert ,Breadcrumb} from 'antd';
// import { noop, SelectGroup, Const } from 'qmkit';
// import FromBanner from './compontent/from-banner';
import FormColumns from './compontent/form-columns';
import { StoreProvider, Relax } from 'plume2';
// import querystring from 'query-string';
import Stores from './store';
// import { any } from 'prop-types';
// import { timeStamp } from 'console';
// const BiFromBanner = Relax(Form.create()(FromBanner));
const BiFormColumns = Relax(Form.create()(FormColumns));
@StoreProvider(Stores, { debug: __DEV__ })
export default class Start extends Component<any,any> {
  store: Stores;
  constructor(props, context) {
    super(props);
    console.log(props);
  }
  state={
    params:{
      type:''
    }
  }
  componentDidMount() {
    const params = this.props.match.params;
    this.setState({params});
    this.store.queryBut(params);
  }
  typeBut=()=>{
    let val=this.state.params.type
    let obj={
      'add':'新建场次',
      'edit':'编辑场次',
      'dis':'场次详情',
      'copy':'复制场次',
    }
    return obj[val]
  }
  render() {
    return (
      // <AuthWrapper functionName='f_batch_advertising'>
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{this.typeBut()}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container coupon">
          <Headline title={`${this.typeBut()}`} />
          <BiFormColumns />
        </div>
      </div>
      // </AuthWrapper>
    );
  }
}
