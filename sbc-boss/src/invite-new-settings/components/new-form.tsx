import React from 'react';
import { Form, InputNumber,Button } from 'antd';
import { IMap } from 'typings/globalType';
import { noop,AuthWrapper } from 'qmkit';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
// import PropTypes from 'prop-types';
// import { Store } from 'plume2';

const FormItem = Form.Item;
// const RadioGroup = Radio.Group;
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
// const Option = Select.Option;

@Relax
export default class NewForm extends React.Component<any, any> {

  props: {
    form: any;
    relaxProps?: {
      newForm: IMap;
      onStateEditNewForm:Function;
      onSave:Function;
    };
  };

  static relaxProps = {
    newForm: 'newForm',
    onStateEditNewForm: noop,
    onSave:noop
  };

  render() {
    const {
        newForm,onStateEditNewForm
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="新客单笔订单购买特价商品最大数量限制">
          {getFieldDecorator('newCustomersBuyLimit', {
            rules: [
              { required: true, whitespace: true, message: '请输入新客单笔订单购买特价商品最大数量限制' },
            ],
            initialValue: newForm.get('newCustomersBuyLimit'),
            onChange: (e) => {
                onStateEditNewForm('newCustomersBuyLimit', e.target.value);
            },
          })(<div>
            <InputNumber value={newForm.get('newCustomersBuyLimit')} precision={0} min={1} max={99999} />
            件
          </div>)}
        </FormItem>
        <div className="bar-button">
            <AuthWrapper  functionName='f_invite_new_settings_edit'>
                <Button
                    type="primary"
                    onClick={this._save}
                    style={{ marginRight: 10 }}
                >
                    保存
                </Button>
            </AuthWrapper>
        </div>
      </Form>
    );
  }
 
  _save=()=>{
    const {onSave}=this.props.relaxProps;
    onSave()
  }
}
