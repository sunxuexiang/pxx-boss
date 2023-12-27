import React from 'react';
import { Form, Input, Alert } from 'antd';
import moment from 'moment';
import { IMap } from 'typings/globalType';

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

export default class EditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      mergeAccountDetails: IMap;
      editFormData: Function;
      customerStatus: number;
    };
  };

  render() {
    const { mergeAccountDetails, customerStatus } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form errorFeedback">
        {this._returnTest(customerStatus)}
        <br />
        <FormItem {...formItemLayout} label="主账号">
          {getFieldDecorator('socialCreditCode', {
            onChange: (e) =>
              this._changeFormData('socialCreditCode', e.target.value),
            initialValue: mergeAccountDetails.customerAlready.customerAccount
              ? mergeAccountDetails.customerAlready.customerAccount
              : ''

            //mergeAccountDetails.get('customerAlready').get('customerAccount')
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="主客户名称">
          {getFieldDecorator('approvalCustomerId', {
            onChange: (e) =>
              this._changeFormData('approvalCustomerId', e.target.value),
            initialValue:
              mergeAccountDetails.customerAlready.customerDetail &&
              mergeAccountDetails.customerAlready.customerDetail.contactName
                ? mergeAccountDetails.customerAlready.customerDetail.contactName
                : ''
            //mergeAccountDetails.get('customerAlready').get('contactName')
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="子账号">
          {getFieldDecorator('registedCustomerId', {
            onChange: (e) =>
              this._changeFormData('registedCustomerId', e.target.value),
            initialValue: mergeAccountDetails.customer.customerAccount
              ? mergeAccountDetails.customer.customerAccount
              : ''
            //mergeAccountDetails.get('customer').get('customerAccount')
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="子客户名称">
          {getFieldDecorator('accountMergeStatus', {
            onChange: (e) =>
              this._changeFormData('accountMergeStatus', e.target.value),
            initialValue:
              mergeAccountDetails.customer.customerDetail &&
              mergeAccountDetails.customer.customerDetail.contactName
                ? mergeAccountDetails.customer.customerDetail.contactName
                : ''
            //mergeAccountDetails.get('customer').get('customerDetail').get('contactName')
          })(<Input disabled={true} />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };

  /**
   * 获取初始化的日期时间
   */
  _getInitDate(dateStr, dateFormat) {
    return dateStr ? moment(dateStr, dateFormat) : null;
  }

  /**
   * 日期时间组件公用属性
   */
  _getDateCommProps(dateFormat) {
    return {
      getCalendarContainer: () => document.getElementById('page-content'),
      allowClear: true,
      format: dateFormat
    };
  }

  /**
   * 不可选的日期
   */
  _disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  _returnTest(value) {
    if (value === 0) {
      return (
        <Alert
          message="警告:该合并子账户已关联其他主账号"
          type="warning"
          showIcon
        />
      );
    }
    if (value === 1) {
      return (
        <Alert
          message="警告:该合并子账户下存在子账号"
          type="warning"
          showIcon
        />
      );
    }
  }
}
