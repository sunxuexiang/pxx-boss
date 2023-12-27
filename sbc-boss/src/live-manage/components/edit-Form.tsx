import React from 'react';
import { Form, Input, Select, message, Icon } from 'antd';
// import { IMap, IList } from 'typings/globalType';
// import { noop } from 'qmkit';
import { fromJS } from 'immutable';
// import { Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Store } from 'plume2';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
const Option = Select.Option;

// @Relax
export default class EditForm extends React.Component<any, any> {
  _store:Store;
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }
  // props: {
  //   form: any;
  //   relaxProps?: {
  //     formData: IMap;
  //     // editFormData: Function;
  //     // editImages: Function;
  //     onFormBut: Function;
  //     onSelectCompany: Function;
  //     companyCates: IList;
  //     brandCates: IList;
  //     pageLiveCates: IList;
  //     operationCates: IList;
  //   };
  // };
  // static relaxProps = {
  //   // editImages: noop,
  //   onFormBut: noop,
  //   onSelectCompany: noop,
  //   companyCates: 'companyCates',
  //   formData: 'formData',
  //   brandCates: 'brandCates',
  //   pageLiveCates: 'pageLiveCates',
  //   operationCates: 'operationCates',
  // };

  render() {
    // const {
    //   formData,
    //   onFormBut,
    //   companyCates,
    //   brandCates,
    //   pageLiveCates,
    //   operationCates
    // } = this.props.relaxProps;
    const {onFormBut,onSelectCompany,_state}=this._store as any;

    const formData=_state.get('formData');
    const companyCates=_state.get('companyCates');
    const brandCates=_state.get('brandCates');
    const pageLiveCates=_state.get('pageLiveCates');
    const operationCates=_state.get('operationCates');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="直播间名称">
          {getFieldDecorator('liveRoomName', {
            rules: [
              { required: true, whitespace: true, message: '请输入直播间名称' },
              { max: 20, message: '直播间名称长度必须为2-20个字符之间' },
            ],
            initialValue: formData.get('liveRoomName'),
            onChange: (e) => {
              onFormBut('liveRoomName', e.target.value);
            },
          })(<Input placeholder="请输入直播间名称" disabled={formData.get('sysFlag') == 0 ? true : false} />)}
        </FormItem>
        {/* {formData.get('companyId')}---456436{JSON.stringify(companyCates)} */}
        <FormItem {...formItemLayout} label="选择厂商">
          {getFieldDecorator('companyId', {
            initialValue: formData.get('companyId'),
            rules: [
            ]
          })(
            <>
              {formData.get('sysFlag') == 0 ? <div style={styles.uploadTit}>全平台</div> : 
            <Select
                placeholder="请选择厂商"
                value={formData.get('companyId')?formData.get('companyId'):[]}
                optionFilterProp="title"
                onChange={this.chooseCompanyCateIds}
                showSearch
              >
                {companyCates.map((cate) => {
                  return (
                    <Option key={cate.get('companyId')} value={Number(cate.get('companyId'))} title={cate.get('companyName')}>
                      {cate.get('companyName')}
                    </Option>
                  );
                })}
              </Select>}
            </>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="选择品牌">
          {getFieldDecorator('brandCateIds', {
            initialValue: formData.toJS().brandCateIds,
            rules: [
            ]
          })(
            <div>
              {formData.get('sysFlag') == 0 ? <div style={styles.uploadTit}>全平台</div> : <Select
              mode="multiple"
              placeholder="请选择品牌"
              value={formData.toJS().brandCateIds}
              onChange={this.chooseBrandCateIds}
              optionFilterProp="title"
              // optionLabelProp="title"
            >
              {brandCates.map((cate) => {
                return (
                  <Option key={cate.get('brandId')} value={cate.get('brandId')} title={cate.get('brandName')} >
                    {cate.get('brandName')}
                  </Option>
                );
              })}
            </Select>}
            </div>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="绑定直播账号">
          {getFieldDecorator('liveCateIds', {
            initialValue: formData.toJS().liveCateIds,
            rules: [
            ]
          })(
            <Select
              mode="multiple"
              placeholder="请选择直播账号"
              onChange={this.chooseLiveCateIds}
              optionFilterProp="title"
            >
              {pageLiveCates.map((cate) => {
                return (
                  <Option key={cate.get('customerId')} value={cate.get('customerId')} title={cate.get('customerAccount')}>
                    ({cate.get('customerName')}){cate.get('customerAccount')}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="绑定运营账号">
          {getFieldDecorator('operationCateIds', {
            initialValue: formData.toJS().operationCateIds,
            rules: [
            ]
          })(
            <Select
              mode="multiple"
              placeholder="请选择运营账号"
              onChange={this.chooseOperationCateIds}

            >
              {operationCates.map((cate) => {
                return (
                  <Option key={cate.get('employeeId')} value={cate.get('employeeId')}>
                    ({cate.get('employeeName')}){cate.get('accountName')}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }

  brandFilterOption=(inputValue,option)=>{
    console.log(inputValue,option)
    return true
  };

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    // const { editFormData } = this.props.relaxProps;
    // editFormData({ key, value });
  };
  /**
   * 厂商选择
   */
  chooseCompanyCateIds = (value) => {
    const {onFormBut,onSelectCompany}=this._store as any;
    onFormBut('brandCateIds', fromJS([]));
    onFormBut('brandCatesNames', []);
    onFormBut('companyId', value);
    // const { onSelectCompany } = this.props.relaxProps;
    onSelectCompany(value);
  };
  // 品牌选择
  chooseBrandCateIds = (value, key) => {
    const {onFormBut}=this._store as any;
    const brandCatesNames = [];
    key.map((item, index) => {
      brandCatesNames.push(item.props.title);
    });
    onFormBut('brandCateIds', value);
    onFormBut('brandCatesNames', brandCatesNames);
  };
  // 直播选择
  chooseLiveCateIds = (value, key) => {
    const {onFormBut}=this._store as any;
    const liveCateNames = [];
    key.map((item, index) => {
      liveCateNames.push(item.props.children[3]);
    });
    onFormBut('liveCateIds', value);
    onFormBut('liveCateNames', liveCateNames);
  };
  // 运营选择
  chooseOperationCateIds = (value, key) => {
    const {onFormBut}=this._store as any;
    const operationCateName = [];
    key.map((item, index) => {
      operationCateName.push(item.props.children[3]);
    });
    onFormBut('operationCateIds', value);
    onFormBut('operationCateName', operationCateName);
  }
}
const styles = {
  uploadTit:{
    width:322,
    height:32,
    background: '#f5f5f5',
    lineHeight: '32px',
    borderRadius: 4,
    padding:'0 0 0 13px',
    border:'1px solid #d9d9d9',
    color:'rgba(0, 0, 0, 0.25)'
  }
}
