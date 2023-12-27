import React from 'react';
import { Form, Input } from 'antd';
import { IMap } from 'typings/globalType';
import { SensitiveWordsValid } from 'qmkit';
import UploadImg from './upload-img';

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
    };
  };

  render() {
    const { formData } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    console.log(formData.toJS());
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="标签名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, whitespace: true, message: '请输入标签名称' },
              { max: 4, message: '最多4个字符' }
            ],
            onChange: (e) =>
              this._changeFormData(
                'name',
                e.target.value.toString().replace(/\s/g, '')
              ),
            initialValue: formData.get('name')
          })(<Input placeholder="请输入标签名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="标签图标">
          {getFieldDecorator('image', {
            rules: [
              { required: true, whitespace: true, message: '请选择标签图标' }
            ],
            onChange: (e) => this._changeFormData('image', e.target.value),
            initialValue: formData.get('image')
          })(<UploadImg />)}
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
}
