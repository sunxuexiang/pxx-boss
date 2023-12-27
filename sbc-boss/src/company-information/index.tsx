import React from 'react';
import { Form,message } from 'antd';
import { Headline,BreadCrumb,checkAuth, AuthWrapper } from 'qmkit';
import { StoreProvider } from 'plume2';
import InfoForm from './components/info-form';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CompanyInformation extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(checkAuth('f_companyInformation_0')){
      this.store.init();
    }else{
      message.error('此功能您没有权限访问');
    }    
  }

  render() {
    const InfoFormDetail = Form.create()(InfoForm);

    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>站点设置</Breadcrumb.Item>
          <Breadcrumb.Item>公司信息</Breadcrumb.Item>
        </Breadcrumb> */}
        {
          <AuthWrapper functionName="f_companyInformation_0">
           <div className="container">
              <Headline title="公司信息" />
              <InfoFormDetail />
           </div>
          </AuthWrapper>
        }
      </div>
    );
  }
}
