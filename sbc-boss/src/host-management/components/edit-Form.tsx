import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
// import { IMap,IList } from 'typings/globalType';
import { noop,ValidConst } from 'qmkit';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import { Store } from 'plume2';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
  _store: Store;
  //声明上下文依赖
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
  //     editFormData: Function;
  //     onFormBut: Function;
  //     couponCates: IList;
  //   };
  // };

  // static relaxProps = {
  //   formData: 'formData',
  //   onFormBut: noop,
  //   couponCates: 'couponCates',
  // };

  render() {
    // const {
    //   formData,
    //   onFormBut,
    //   couponCates
    // } = this.props.relaxProps;
    const {onFormBut,_state}=this._store as any;
    const formData=_state.get('formData');
    const couponCates=_state.get('couponCates');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="主播姓名">
          {getFieldDecorator('hostName', {
            rules: [
              { required: true, whitespace: true, message: '请输入主播名称' },
              {min:2, max: 20,  message: '账号长度必须为2-20个字符之间' },
            ],
            initialValue: formData.get('hostName'),
            onChange: (e) => {
              onFormBut('hostName', e.target.value);
            },
          })(<Input placeholder="请输入主播名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="主播类型">
          {getFieldDecorator('hostType', {
            initialValue: formData.get('hostType'),
          })(
            <RadioGroup
            onChange={(e: any) =>
              onFormBut('hostType', e.target.value)
            }
            >
              <Radio value={0}>官方</Radio>
              <Radio value={1}>入驻</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator('contactPhone', {
            rules: [
              { required: true, whitespace: true, message: '请输入正确的联系方式' },
              {
                pattern: ValidConst.phone,
                message: '请输入正确的手机号码'
              }
            ],
            initialValue: formData.get('contactPhone'),
            onChange: (e) => {
              onFormBut('contactPhone', e.target.value);
            },
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>
        
        <FormItem {...formItemLayout} label="绑定直播账号">
        {getFieldDecorator('couponCateIds', {
            initialValue: formData.get('couponCateIds').toJS(),
            rules: []
          })(
            <Select
              mode="multiple"
              placeholder="请选择直播账号"
              allowClear={true}
              onChange={this.chooseCouponCateIds}
            >
              {couponCates.toJS().map((cate,i) => {
                return (
                  <Option key={i} value={cate.customerId} disabled={
                    formData.get('hostId')?
                    (formData.get('customerId')&&formData.get('customerId').includes(cate.customerId)?false:cate.myCustomer)
                    :cate.myCustomer
                  }>
                    {cate.customerName}({cate.customerAccount})
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="运营人员">
          {getFieldDecorator('accountName', {
            rules: [
              { required: true, whitespace: true, message: '请输入人员名称' },
              { min:2, max: 20, message: '名称长度必须为2-20个字符之间' }
            ],
            initialValue: formData.get('accountName'),
            onChange: (e) => {
              onFormBut('accountName', e.target.value);
            },
          })(<Input placeholder="填写运营人员账号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="在职状态">
          {getFieldDecorator('workingState', {
            initialValue: formData.get('workingState'),
          })(
            <RadioGroup
            onChange={(e: any) =>
              onFormBut('workingState', e.target.value)
            }
            >
              <Radio value={1}>在职</Radio>
              <Radio value={0}>离职</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }
  /**
   * 直播账号选择
   */
  chooseCouponCateIds = (value,option) => {
    const {onFormBut}=this._store as any;
    const accounts = [];
    option.map((item, index) => {
      accounts.push({customerId:item.props.value,customerAccount:item.props.children[2]});
    });
    onFormBut( 'couponCateIds', fromJS(value)  );
    onFormBut( 'accounts', accounts );
  };
}
