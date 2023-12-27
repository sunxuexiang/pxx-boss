import React from 'react';
import { Form, InputNumber, Button} from 'antd';
import { IMap,IList } from 'typings/globalType';
import { noop,AuthWrapper } from 'qmkit';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
// import PropTypes from 'prop-types';
// import { Store } from 'plume2';

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

@Relax
export default class OldForm extends React.Component<any, any> {

  props: {
    form: any;
    relaxProps?: {
        oldForm: IMap;
        onStateEditOldForm: Function;
        onSave:Function;
    };
  };

  static relaxProps = {
    oldForm: 'oldForm',
    onStateEditOldForm: noop,
    onSave:noop,
  };

  render() {
    const {
        oldForm,
        onStateEditOldForm,
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="老客单笔订单兑换商品最大数量限制">
          {getFieldDecorator('oldCustomersBuyLimit', {
            rules: [
              { required: true, whitespace: true, message: '请输入老客单笔订单兑换商品最大数量限制' },
            ],
            initialValue: oldForm.get('oldCustomersBuyLimit'),
            onChange: (e) => {
                onStateEditOldForm('oldCustomersBuyLimit', e.target.value);
            },
          })(<div>
            <InputNumber value={oldForm.get('oldCustomersBuyLimit')} precision={0} min={1} max={99999} />
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
  /**
   * 保存
   */
   _save = () => {
    const {onSave}=this.props.relaxProps;
    onSave()
  };
}
