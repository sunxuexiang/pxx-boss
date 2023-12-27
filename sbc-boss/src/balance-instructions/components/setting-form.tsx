import React from 'react';
import { Row, Col, Button, Form } from 'antd';

import PropTypes from 'prop-types';
import { AuthWrapper, isSystem, noop, UEditor } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IMap } from '../../../typings/globalType';
import Store from '../store';
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

export default class settingForm extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    form?: any;
    relaxProps?: {
      settings: IMap;
      imgType: number;
      refEditor: Function;
      setVisible: Function;
    };
  };

  static relaxProps = {
    imgType: 'imgType',
    settings: 'settings',
    refEditor: noop,
    setVisible: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const settingForm = _state.get('settings');
    const store = this._store as any;

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="鲸币说明设置" required={true}>
              {getFieldDecorator(
                'expensesCostContent',
                {}
              )(
                <UEditor
                  key="expensesCostContent"
                  ref={(UEditor) => {
                    store.refexpensesCostContent(
                      (UEditor && UEditor.editor) || {}
                    );
                  }}
                  id="equities"
                  height="320"
                  content={settingForm.get('expensesCostContent')}
                  insertImg={() => store.setVisible(1, 2)}
                  chooseImgs={[]}
                  imgType={store.state().get('imgType')}
                  maximumWords={500}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="提现说明设置" required={true}>
              {getFieldDecorator(
                'content',
                {}
              )(
                <UEditor
                  key="content"
                  ref={(UEditor) => {
                    store.refEditor((UEditor && UEditor.editor) || {});
                  }}
                  id="equities"
                  height="320"
                  content={settingForm.get('content')}
                  insertImg={() => store.setVisible(1, 2)}
                  chooseImgs={[]}
                  imgType={store.state().get('imgType')}
                  maximumWords={500}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        {/* <Row>
          <Col span={30}>
          <FormItem {...formItemLayout} label="用户协议说明" required={true}>
              {getFieldDecorator(
                'expensesCostContentMent',
                {}
              )(
                <UEditor
                  key="expensesCostContentMent"
                  ref={(UEditor) => {
                    store.refexpensesCostContentMent(
                      (UEditor && UEditor.editor) || {}
                    );
                  }}
                  id="equities"
                  height="320"
                  content={settingForm.get('expensesCostContentMent')}
                  insertImg={() => store.setVisible(1, 2)}
                  chooseImgs={[]}
                  imgType={store.state().get('imgType')}
                  maximumWords={500}
                />
              )}
            </FormItem>
          </Col>
        </Row> */}
        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editSetting(values);
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
