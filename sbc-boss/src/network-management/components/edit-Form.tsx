import React from 'react';
import { Form, Input,TreeSelect,Cascader } from 'antd';
import moment from 'moment';
import { IMap } from 'typings/globalType';
import { FindArea,ValidConst } from 'qmkit';

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
      formData: IMap;
      editFormData: Function;
      changeCityArea:Function;
    };
  };
  
  render() {
    const { formData,changeCityArea } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="网点名称">
          {formData.get('networkName')}
        </FormItem>
        <FormItem {...formItemLayout} label="网点地址">
          {formData.get('networkAddress')}
        </FormItem>
  
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('contacts', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入联系人'
              },
              { max: 20, message: '最多可输入20个字符' }
            ],
            onChange: (e) =>
              this._changeFormData('contacts', e.target.value),
            initialValue: formData.get('contacts')
          })(<Input placeholder="请输入联系人" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入联系电话'
              },
              { pattern: ValidConst.phone, message: '请输入正确的联系电话' }
            ],
            onChange: (e) =>
              this._changeFormData('phone', e.target.value),
            initialValue: formData.get('phone')
          })(<Input placeholder="请输入联系电话" />)}
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




  
}
