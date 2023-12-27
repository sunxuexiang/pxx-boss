import * as React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Alert, Form, Input, Modal, Switch } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';

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
    sm: { span: 18 }
  }
};

@Relax
export default class PayModal extends React.Component<any, any> {
  _form;
  GateWaysForm: any;

  constructor(props) {
    super(props);
    this.GateWaysForm = Form.create()(GateWaysForm as any);
  }

  props: {
    relaxProps?: {
      attract__visible: boolean;
      onSaveChannel: Function;
      attract_hide: Function;
      channelJson: IMap;
      onFormValueChange: Function;
    };
  };

  static relaxProps = {
    attract__visible: 'attract__visible',
    onSaveChannel: noop,
    attract_hide: noop,
    channelJson: 'channelJson',
    onFormValueChange: noop
  };

  render() {
    const { attract__visible, attract_hide } = this.props.relaxProps;

    const GateWaysForm = this.GateWaysForm;

    if (!attract__visible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        width={1100}
        title={'配置一网通支付'}
        visible={true}
        onOk={() => this._handleOk()}
        onCancel={() => attract_hide()}
      >
        <div>
          <Alert
            message={
              <ul>
                <li>
                  1、我们已经接入了一网通支付。
                </li>
                <li>
                  2、启用一网通支付需在一网通商户中心完成一网通相关入网流程，并维护相应参数。
                </li>
                <li>3、参数配置在点击保存后生效。</li>
              </ul>
            }
            type="info"
          />
          <div>
            <div className="pay-title">
              <h2>一网通支付接口</h2>
              <span>重要参数请谨慎配置，填写错误将无法正常使用在线支付</span>
              {/*<a href="/pay-help-doc" target="_blank">*/}
              {/*查看帮助*/}
              {/*</a>*/}
            </div>
            <div style={{ width: 640, marginTop: 20 }}>
              <GateWaysForm ref={(form) => (this._form = form)} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  _handleOk() {
    const gatewayForm = this._form as WrappedFormUtils;
    const { onSaveChannel } = this.props.relaxProps;
    gatewayForm.validateFields(null, (errs) => {
      if (!errs) {
        onSaveChannel();
      }
    });
  }
}

class GateWaysForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const channelJson = this._store.state().get('channelJson');
    if (!channelJson) return;
    const onFormValueChange = this._store.onFormValueChange;

    const fromValue = channelJson.get('payGatewayConfig');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="Api-Key" required={true}>
          {getFieldDecorator('apiKey', {
            initialValue: fromValue.get('apiKey'),
            rules: [
              { required: true, whitespace: true, message: '请输入Api-Key' },
              { max: 30, message: '最多30字符' }
            ]
          })(
            <Input
              placeholder="请填写您获得的Api-Key（入网成功后，一网通会邮件发送，通常为商户号）"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.apiKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="publicKey" required={true}>
          {getFieldDecorator('publicKey', {
            initialValue: fromValue.get('publicKey'),
            rules: [
              { required: true, whitespace: true, message: '请输入publicKey' },
            ]
          })(
            <Input
              placeholder="请填写您获得的publicKey"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.publicKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="BOSS后台接口地址" required={true}>
          {getFieldDecorator('bossBackUrl', {
            initialValue: fromValue.get('bossBackUrl'),
            rules: [
              { required: true, message: '请输入BOSS后台接口地址' },
              { max: 200, message: '最多200字符' },
              { validator: this.checkWebsite }
            ]
          })(
            <Input
              placeholder="请填写BOSS后台接口地址"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.bossBackUrl',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="PC前台接口地址" required={true}>
          {getFieldDecorator('pcBackUrl', {
            initialValue: fromValue.get('pcBackUrl'),
            rules: [
              { required: true, message: '请输入PC前台接口地址' },
              { max: 200, message: '最多200字符' },
              { validator: this.checkWebsite }
            ]
          })(
            <Input
              placeholder="请填写PC前台接口地址"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.pcBackUrl',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否启用" required={true}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(e) => {
              onFormValueChange('isOpen', e ? 1 : 0);
            }}
            defaultChecked={channelJson.get('isOpen') == 1}
          />
        </FormItem>
      </Form>
    );
  }
  checkWebsite = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    const pcWebsiteReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!pcWebsiteReg.test(value)) {
      callback(new Error('请输入正确的网址'));
      return;
    }

    callback();
  };
}
