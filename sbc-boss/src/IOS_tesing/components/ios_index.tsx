import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Input, Form, Switch, Radio, message } from 'antd';
import { QMMethod, noop, ValidConst, AuthWrapper, isSystem } from 'qmkit';
import styled from 'styled-components';
import { validCode } from 'src/find-password/webapi';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 6 },
    sm: { span: 5 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 19 }
  }
};

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;

@Relax
export default class InfoForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      appUpgrade: IMap;
      //改变升级配置基本信息
      onChange: Function;
      onSaveSetting: Function;
    };
  };

  static relaxProps = {
    appUpgrade: 'appUpgrade',
    onChange: noop,
    onSaveSetting: noop
  };

  componentDidMount() {
    this.setState({});
  }

  render() {
    const { appUpgrade, onChange } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={isSystem(this._handleSubmit)}
      >
        <FormItem
          {...formItemLayout}
          label="版本号"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('versionNo', {
            initialValue: appUpgrade.get('versionNo'),
            rules: [
              { required: true, message: '请填写版本号' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '版本号',
                    1,
                    20
                  );
                }
              }
            ]
          })(
            <Input
              placeholder="请填写版本号"
              onChange={(e: any) =>
                onChange({
                  field: 'versionNo',
                  value: e.target.value
                })
              }
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="版本构建号"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('buildNo', {
            initialValue: appUpgrade.get('buildNo'),
            rules: [
              { required: true, message: '请填写版本构建号' },
              { pattern: ValidConst.number, message: '请填写数字' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '版本构建号',
                    1,
                    20
                  );
                }
              }
            ]
          })(
            <Input
              placeholder="请填写版本构建号"
              onChange={
                (e: any) =>
                  onChange({
                    field: 'buildNo',
                    value: e.target.value
                  })
                // {
                //   if(e.target.value >= appUpgrade.get('buildNo')) {
                //     onChange({
                //       field: 'buildNos',
                //       value: e.target.value
                //     })
                //   }else {
                //     message.error('不能少于当前版本构建号。');
                //   }
                // }
              }
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="提示更新状态" required={true}>
          {getFieldDecorator('updatePromptStatus', {
            initialValue: appUpgrade.get('updatePromptStatus')
          })(
            <RadioGroup
              onChange={(e) =>
                onChange({
                  field: 'updatePromptStatus',
                  value: e.target.value
                })
              }
            >
              <Radio value={1}>不提示更新</Radio>
              <Radio value={2}>提示更新但不强制更新</Radio>
              <Radio value={3}>强制更新</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="是否打开微信登录标志" hasFeedback>
          {getFieldDecorator('openWechatLongFlag')(
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={appUpgrade.get('openWechatLongFlag') == 1}
              onChange={(e) =>
                onChange({
                  field: 'openWechatLongFlag',
                  value: e.valueOf() ? 1 : 0
                })
              }
            />
          )}
          {/* <GreyText>开启后App必须完成更新才可进行使用</GreyText> */}
        </FormItem>

        <AuthWrapper functionName={'f_check_update_edit'}>
          <div className="bar-button">
            <Button type="primary" onClick={isSystem(this._handleSubmit)}>
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  /**
   * 提交
   * @param e
   * @private
   */
  _handleSubmit = () => {
    const { appUpgrade } = this.props.relaxProps;
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSaveSetting(appUpgrade);
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 校验网址
   * @param rule
   * @param value
   * @param callback
   */
  checkWebsite = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    // const pcWebsiteReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!ValidConst.url.test(value)) {
      callback(new Error('请输入正确的网址'));
      return;
    }

    if (value.length > 100) {
      callback(new Error('下载地址限制100个字符'));
      return;
    }

    callback();
  };
}
