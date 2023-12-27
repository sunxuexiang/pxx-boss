import React from 'react';
import { Form, Input, Button } from 'antd';
import { IMap,IList } from 'typings/globalType';
import { noop,AuthWrapper,UEditor } from 'qmkit';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
// import PropTypes from 'prop-types';
// import { Store } from 'plume2';

const FormItem = Form.Item;
const formItemLayout = {
//   labelCol: {
//     span: 2,
//     xs: { span: 24 },
//     sm: { span: 6 }
//   },
//   wrapperCol: {
//     span: 24,
//     xs: { span: 24 },
//     sm: { span: 14 }
//   }
};

@Relax
export default class RulesForm extends React.Component<any, any> {

  props: {
    form: any;
    relaxProps?: {
        rulesForm: IMap;
        onStateEditRulesForm: Function;
        refexpensesCostContent:Function;
        onSave:Function;
    };
  };

  static relaxProps = {
    rulesForm: 'rulesForm',
    onStateEditRulesForm: noop,
    refexpensesCostContent:noop,
    onSave:noop,
  };

  render() {
    const {
        rulesForm,
        onStateEditRulesForm,
        refexpensesCostContent
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="规则说明：">
          {getFieldDecorator('invitationRules', {
            // rules: [
            //   { required: true, whitespace: true, message: '请输入主播名称' },
            //   {min:2, max: 20,  message: '账号长度必须为2-20个字符之间' },
            // ],
            // initialValue: rulesForm.get('hostName'),
            // onChange: (e) => {
            //     onStateEditRulesForm('hostName', e.target.value);
            // },
          })(
            <UEditor
                  key="invitationRules"
                  ref={(UEditor) => {
                    refexpensesCostContent(
                      (UEditor && UEditor.editor) || {}
                    );
                  }}
                  id="equities"
                  height="320"
                  content={rulesForm.get('invitationRules')}
                  chooseImgs={[]}
                  maximumWords={500}
                />
          )}
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
