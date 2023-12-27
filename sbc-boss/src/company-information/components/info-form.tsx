import React from 'react';
import { Row, Col, Button, Input, Form, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { AuthWrapper, QMMethod, checkAuth } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;

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

export default class InfoForm extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const infoForm = _state.get('infomation');

    let companyName = {
      initialValue: infoForm.get('companyName')
    };

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50, maxWidth: 950 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label="公司名称"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('companyName', {
                ...companyName,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value.trim()) {
                        callback(new Error('请填写公司信息'));
                        return;
                      }
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        '公司名称',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(<Input size="large" readOnly={!checkAuth('f_basicSetting_1')} />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="公司名称既是您前台商城（包括PC商城、移动商城）的名称也是您管理后台的名称。"
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <AuthWrapper functionName={'f_companyInformation_1'}>
          <div className="bar-button">
            <Button type="primary" htmlType="submit" disabled={!checkAuth('f_basicSetting_1')}>
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
  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editInfo(values);
      }
    });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
