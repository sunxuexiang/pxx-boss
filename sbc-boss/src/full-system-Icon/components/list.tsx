import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Tooltip } from 'antd';

import PropTypes from 'prop-types';
import { Const, Tips, QMUpload, AuthWrapper, isSystem, noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import UploadImg from './upload-img';
import { message } from 'antd';
import { Relax } from 'plume2';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};
const dataType = [
  { name: '满减', value: 'fullReductionIcon' },
  { name: '立减', value: 'onceReductionIcon' },
  { name: '买折', value: 'discountIcon' },
  { name: '买赠', value: 'discountGiftIcon' }
];

@Relax
export default class settingForm extends React.Component<any, any> {
  form;
  _form;
  _store;
  WrapperForm: any;
  props: {
    type;
    relaxProps?: {
      onSave: Function;
    };
  };

  static relaxProps = {
    onSave: noop
  };
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.WrapperForm = Form.create()(MyForm as any);
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const dataList = _state.get('dataList');
    const WrapperForm = this.WrapperForm;
    return (
      <WrapperForm
        ref={(form) => (this._form = form)}
        relaxProps={this.props.relaxProps}
        _handleSubmit={this._handleSubmit.bind(this)}
        dataList={dataList}
      />
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this._form as WrappedFormUtils;
    form.resetFields();

    form.validateFields(null, (errs) => {
      if (!errs) {
        const { onSave } = this.props.relaxProps;
        onSave();
      }
    });
  };
}

function MyForm(props) {
  const { getFieldDecorator } = props.form;
  const dataList = props.dataList.toJS();
  return (
    <Form
      style={{ paddingBottom: 50, maxWidth: 900 }}
      onSubmit={isSystem(props._handleSubmit)}
    >
      {dataType.map((item) => (
        <Row>
          <Col span={18}>
            <FormItem
              required={true}
              {...formItemLayout}
              label={item.name}
              labelAlign="left"
              hasFeedback
            >
              {getFieldDecorator(item.value, {
                initialValue: dataList[item.value],
                rules: [
                  {
                    required: true,
                    message: '该内容是必填项'
                  }
                ]
              })(<UploadImg type={item.value} />)}
            </FormItem>
          </Col>
        </Row>
      ))}

      <AuthWrapper functionName="f_basicSetting_1">
        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </AuthWrapper>
    </Form>
  );
}
