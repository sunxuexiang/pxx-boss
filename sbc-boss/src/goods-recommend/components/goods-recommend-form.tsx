import React from 'react';
import { Row, Col, Form, Switch, Checkbox, Radio, Button, Tabs } from 'antd';
import PropTypes from 'prop-types';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import GoodsGrid from './recruit-setting-goods-grid';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 6 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 16,
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

export default class GoodsRecommendForm extends React.Component<any, any> {
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
    const enabled = state.get('enabled');
    const priority = state.get('priority') ? state.get('priority') : 0;
    const entries = state.get('entries');
    const rule = state.get('rule') ? state.get('rule') : 0;
    const goodsInfoIds = state.get('goodsInfoIds');
    const warehouseList = state.get('warehouseList').toJS();
    const wareRowList = state.get('wareRowList').toJS();
    const wareIndex = state.get('wareIndex');
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
            <FormItem {...formItemLayout} label="商品推荐开关">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={enabled}
                onChange={(e) => {
                  this._store.onFormFieldChange('enabled', e);
                  this.props.form.resetFields();
                }}
              />
            </FormItem>
          </Col>
        </Row>
        {enabled && (
          <Row>
            <Col span={30}>
              <FormItem {...formItemLayout} label="商品推荐入口">
                {getFieldDecorator('entries', {
                  initialValue: entries.toJS(),
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
        {enabled && (
          <Row>
            <Col span={30}>
              <FormItem
                {...formItemLayout}
                label="推荐商品优先级"
                required={enabled}
              >
                {getFieldDecorator('priority', {
                  initialValue: priority,
                  onChange: (e) =>
                    this._store.onFormFieldChange('priority', e.target.value)
                })(
                  <RadioGroup>
                    {/*<Radio value={0}>位置</Radio>*/}
                    <Radio value={0}>最新上架时间</Radio>
                    <Radio value={1}>关注度</Radio>
                    {/*<Radio value={2}>浏览量</Radio>*/}
                    <Radio value={3}>销量</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
        )}

        {enabled && rule == 0 && (
          <Row>
            <Col span={50}>
              {
                <FormItem {...formItemLayout} label="选择商品">
                  {getFieldDecorator('goodsInfoIds', {
                    initialValue: goodsInfoIds,
                    rules: [{ required: enabled, message: '请选择商品' }]
                  })(
                    <Tabs onChange={this.callback}>
                      {warehouseList.map((item, i) => (
                        <TabPane tab={item.wareName} key={`${i}`}>
                          <GoodsGrid />
                        </TabPane>
                      ))}
                    </Tabs>
                  )}
                </FormItem>
              }
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
    this._store.onFormFieldChange('entries', checkedValues);
  };
  callback = (eve) => {
    console.log('-------------eve', eve);
    let { warehouseList, wareIndex } = this._store.state().toJS();
    console.log('warehouseList', warehouseList[Number(eve)].wareId);
    this._store.onFormFieldChange('wareIndex', Number(eve));
    this._store.onOkBackFun([], []);
    this._store.onChangeWareId(warehouseList[Number(eve)].wareId);
    this._store.init(warehouseList[Number(eve)].wareId);
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
