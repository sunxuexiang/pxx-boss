import React from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Radio,
  Row,
  Switch
} from 'antd';
import PropTypes from 'prop-types';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ValidConst } from 'qmkit';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
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

const entryOptions = [
  { label: '个人中心（移动端）', value: '0' },
  { label: '商品列表', value: '1' },
  { label: '好友代付（移动端）', value: '2' },
  { label: '支付成功', value: '3' },
  { label: '商品详情页', value: '4' },
  { label: '购物车', value: '5' }
];

export default class IntelligentRecommend extends React.Component<any, any> {
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
    const state = this._store.state();
    const intelligentRecommend = state.get('intelligentRecommend');
    const enabled = intelligentRecommend.get('enabled');
    const entries = intelligentRecommend.get('entries');
    const priority = intelligentRecommend.get('priority');
    const intelligentRecommendDimensionality = intelligentRecommend.get(
      'intelligentRecommendDimensionality'
    );
    const intelligentRecommendAmount = intelligentRecommend.get(
      'intelligentRecommendAmount'
    );
    if (state.get('loading')) {
      return null;
    }

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 1500 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={30}>
            <FormItem {...formItemLayout} label="智能推荐开关">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={enabled}
                onChange={(e) => {
                  this._store.intelligentRecommendSave({
                    field: 'enabled',
                    value: e
                  });
                  this.props.form.resetFields();
                }}
              />
            </FormItem>
          </Col>
        </Row>
        {enabled && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="推荐数量" required={true}>
                {getFieldDecorator('intelligentRecommendAmount', {
                  initialValue: intelligentRecommendAmount,
                  rules: [
                    {
                      required: true,
                      message: '请填写0-50之间的正整数',
                      pattern: ValidConst.number
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: 300 }}
                    min={0}
                    max={50}
                    placeholder="请填写0-50之间的正整数"
                    onChange={(val) => {
                      this._store.intelligentRecommendSave({
                        field: 'intelligentRecommendAmount',
                        value: val
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        {enabled && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="推荐排序" required={enabled}>
                {getFieldDecorator('priority', {
                  initialValue: priority,
                  onChange: (e) =>
                    this._store.intelligentRecommendSave({
                      field: 'priority',
                      value: e.target.value
                    })
                })(
                  <RadioGroup>
                    <Radio value={4}>按默认</Radio>
                    <Radio value={5}>按综合</Radio>
                    <Radio value={3}>按销量</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
        )}
        {enabled && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="推荐维度" required={enabled}>
                {getFieldDecorator('intelligentRecommendDimensionality', {
                  initialValue: intelligentRecommendDimensionality,
                  onChange: (e) =>
                    this._store.intelligentRecommendSave({
                      field: 'intelligentRecommendDimensionality',
                      value: e.target.value
                    })
                })(
                  <RadioGroup>
                    <Radio value={0}>三级类目</Radio>
                    <Radio value={1}>品牌</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
        )}
        {enabled && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="商品推荐入口">
                {getFieldDecorator('entries', {
                  initialValue: entries,
                  rules: [
                    { required: enabled, message: '启用时请选择生效入口' }
                  ]
                })(
                  <CheckboxGroup
                    options={entryOptions}
                    onChange={this._onCheckedEntryOptions}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    );
  }

  _onCheckedEntryOptions = (checkedValues) => {
    this._store.intelligentRecommendSave({
      field: 'entries',
      value: checkedValues
    });
  };

  /**
   * 提交
   */
  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this._store.save();
      }
    });
  };
}
