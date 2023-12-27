import React from 'react';
import { Form, Select, DatePicker, Input } from 'antd';
import { StoreProvider } from 'plume2';
import { QMMethod } from 'qmkit';
import AppStore from '../store';

const FormItem = Form.Item;
const Option = Select.Option;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class DeliveryForm extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {}

  render() {
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} required={true} label="物流公司">
          {getFieldDecorator('deliverId', {
            rules: [
              {
                required: true,
                message: '请输入物流公司'
              }
            ]
          })(
            <Select
              dropdownStyle={{ zIndex: 1053 }}
              notFoundContent="您还未设置常用物流公司"
            >
              {this.state.logistics.map((v) => (
                <Option key={v.expressCode} value={v.expressCompanyId + ''}>
                  {v.expressName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} required={true} label="物流单号">
          {getFieldDecorator('deliverNo', {
            rules: [
              { required: true, message: '请输入物流单号' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorDeliveryCode(
                    rule,
                    value,
                    callback,
                    '物流单号'
                  );
                }
              }
            ]
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem {...formItemLayout} required={true} label="发货日期">
          {getFieldDecorator('deliverTime', {
            rules: [
              {
                required: true,
                message: '请输入发货日期'
              }
            ]
          })(<DatePicker disabledDate={this.disabledDate} />)}
        </FormItem>
      </Form>
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}
