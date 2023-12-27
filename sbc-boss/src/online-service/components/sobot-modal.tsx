import React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Modal, Radio, Checkbox } from 'antd';
import { noop } from 'qmkit';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

/**
 * 生效终端
 * @type {{label: string; value: string}[]}
 */
const plainOptions = [
  { label: 'PC', value: 'pc' },
  { label: 'APP', value: 'app' },
  { label: '小程序', value: 'mini' },
  { label: 'h5', value: 'h5' }
];

@Relax
export default class SobotModal extends React.Component<any, any> {
  _form: any;

  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      sobotVisible: boolean;
      sobotCancel: Function;
      sobotServer: IMap;
      onSobotChange: Function;
      saveSobot: Function;
    };
  };

  static relaxProps = {
    sobotVisible: 'sobotVisible',
    sobotCancel: noop,
    sobotServer: 'sobotServer',
    onSobotChange: noop,
    saveSobot: noop
  };

  render() {
    const {
      sobotVisible,
      sobotCancel,
      sobotServer,
      onSobotChange
    } = this.props.relaxProps;

    if (!sobotVisible) {
      return null;
    }

    const { getFieldDecorator } = this.props.form;

    const initTerminal = [];
    if (sobotServer.get('effectivePc') == '1') {
      initTerminal.push('pc');
    }
    if (sobotServer.get('effectiveApp') == '1') {
      initTerminal.push('app');
    }
    if (sobotServer.get('effectiveMiniProgram') == '1') {
      initTerminal.push('mini');
    }
    if (sobotServer.get('effectiveH5') == '1') {
      initTerminal.push('h5');
    }

    return (
      <Modal
        maskClosable={false}
        title="编辑智齿客服"
        visible={sobotVisible}
        onOk={this._handleOK}
        onCancel={() => sobotCancel()}
        width="600px"
      >
        <Form className="login-form">
          <FormItem {...formItemLayout} label="启用开关">
            <RadioGroup
              value={sobotServer.get('enableFlag')}
              onChange={this._handleChange}
            >
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="生效终端">
            {getFieldDecorator('effectTerminal', {
              initialValue: initTerminal,
              rules: [
                {
                  required: sobotServer.get('enableFlag') != 0,
                  message: '启用时请选择生效终端'
                }
              ]
            })(
              <CheckboxGroup
                options={plainOptions}
                onChange={(val) =>
                  onSobotChange({ field: 'effectTerminal', value: val })
                }
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="AppKey">
            {getFieldDecorator('appKey', {
              initialValue: sobotServer.get('appKey'),
              rules: [
                { required: true, message: '请填写AppKey' }
                // { max: 5, message: '不可超过5个字' },
                /*  {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorEmoji(rule, value, callback, '客服标题');
                  }
                }*/
              ]
            })(
              <Input
                style={{ width: '96%' }}
                placeholder="请输入AppKey"
                onChange={(e) =>
                  onSobotChange({ field: 'appKey', value: e.target.value })
                }
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="AppId">
            {getFieldDecorator('appId', {
              initialValue: sobotServer.get('appId'),
              rules: [{ required: true, message: '请填写AppId(应用ID)' }]
            })(
              <Input
                style={{ width: '96%' }}
                placeholder="请输入AppId(应用ID)"
                onChange={(e) =>
                  onSobotChange({ field: 'appId', value: e.target.value })
                }
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="web端URL">
            {getFieldDecorator('h5Url', {
              initialValue: sobotServer.get('h5Url'),
              rules: [{ required: true, message: '请填写web端URL' }]
            })(
              <Input
                addonBefore="https://"
                style={{ width: '96%' }}
                placeholder="请输入web端URL"
                onChange={(e) =>
                  onSobotChange({ field: 'h5Url', value: e.target.value })
                }
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  /**
   * 启用时请选择生效终端
   * @param _rule
   * @param value
   * @param callback
   */
  _handleChange = async (e) => {
    const { onSobotChange } = this.props.relaxProps;
    await onSobotChange({
      field: 'enableFlag',
      value: (e as any).target.value
    });
    this.setState({ enableFlag: (e as any).target.value });
  };

  /**
   * 保存弹框编辑
   * @private
   */
  _handleOK = () => {
    const form = this.props.form;
    const { saveSobot, sobotServer } = this.props.relaxProps;
    form.validateFields(null, (errs, values) => {
      if (sobotServer.get('serverStatus') == 1) {
        if (values.effectTerminal.length < 1) {
          this.props.form.setFields({
            effectTerminal: {
              value: [],
              errors: [new Error('启用时请选择生效终端')]
            }
          });
        }
      }
      // console.log('handle ok =========>', errs, values);
      //如果校验通过
      if (!errs) {
        saveSobot();
      } else {
        this.setState({});
      }
    });
  };
}
