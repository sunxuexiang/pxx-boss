import React from 'react';
import { Row, Col, Button, Form, Input } from 'antd';

import PropTypes from 'prop-types';
import { noop, UEditor } from 'qmkit';
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

  componentDidMount() {
    this._store.init();
  }

  props: {
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
    // @ts-ignore
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
            <FormItem {...formItemLayout} label="托运部" required={true}>
              {getFieldDecorator('logisticsContent', {
                initialValue: settingForm.get('logisticsContent')
              })(
                // <UEditor
                //   key="logisticsContent"
                //   ref={(UEditor) => {
                //     store.refexpensesCostContent(
                //       (UEditor && UEditor.editor) || {}
                //     );
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('logisticsContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="指定专线" required={true}>
              {getFieldDecorator('specifyLogisticsContent', {
                initialValue: settingForm.get('specifyLogisticsContent')
              })(
                // <UEditor
                //   key="specifyLogisticsContent"
                //   ref={(UEditor) => {
                //     store.refEditor((UEditor && UEditor.editor) || {});
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('specifyLogisticsContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={30}>
            <FormItem
              {...formItemLayout}
              label="快递到家(到付)"
              required={true}
            >
              {getFieldDecorator('expressArrivedContent', {
                initialValue: settingForm.get('expressArrivedContent')
              })(
                // <UEditor
                //   key="expressArrivedContent"
                //   ref={(UEditor) => {
                //     store.refExpressToHomePay(
                //       (UEditor && UEditor.editor) || {}
                //     );
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('expressArrivedContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={30}>
            <FormItem
              {...formItemLayout}
              label="快递到家(自费)"
              required={true}
            >
              {getFieldDecorator('expressContent', {
                initialValue: settingForm.get('expressContent')
              })(
                // <UEditor
                //   key="expressContent"
                //   ref={(UEditor) => {
                //     store.refLogisticsContent(
                //       (UEditor && UEditor.editor) || {}
                //     );
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('expressContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="同城配送" required={true}>
              {getFieldDecorator('intraCityLogisticsContent', {
                initialValue: settingForm.get('intraCityLogisticsContent')
              })(
                // <UEditor
                //   key="intraCityLogisticsContent"
                //   ref={(UEditor) => {
                //     store.refExpressContent((UEditor && UEditor.editor) || {});
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('intraCityLogisticsContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="自提" required={true}>
              {getFieldDecorator('doorPickContent', {
                initialValue: settingForm.get('doorPickContent')
              })(
                // <UEditor
                //   key="doorPickContent"
                //   ref={(UEditor) => {
                //     store.refPickSelfContent((UEditor && UEditor.editor) || {});
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('doorPickContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="配送到店" required={true}>
              {getFieldDecorator('deliveryToStoreContent', {
                initialValue: settingForm.get('deliveryToStoreContent')
              })(
                // <UEditor
                //   key="deliveryToStoreContent"
                //   ref={(UEditor) => {
                //     store.refDeliveryToStore((UEditor && UEditor.editor) || {});
                //   }}
                //   id="equities"
                //   height="320"
                //   content={settingForm.get('deliveryToStoreContent')}
                //   insertImg={() => store.setVisible(1, 2)}
                //   chooseImgs={[]}
                //   imgType={store.state().get('imgType')}
                //   maximumWords={500}
                // />
                <Input.TextArea rows={4}></Input.TextArea>
              )}
            </FormItem>
          </Col>
        </Row>

        {/* <AuthWrapper functionName="f_homeDeliverySetting_1"> */}
        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
        {/* </AuthWrapper> */}
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    // @ts-ignore
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editSetting(values);
      }
    });
  };
}

// const styles = {
//   box: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center'
//   } as any,
//   plus: {
//     color: '#999',
//     fontSize: '28px'
//   },
//   alertBox: {
//     marginLeft: 10
//   },
//   toolBox: {
//     marginLeft: 10,
//     height: 40,
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center'
//   } as any
// };
