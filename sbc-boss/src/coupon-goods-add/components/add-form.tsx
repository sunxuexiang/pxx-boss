import * as React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Popover,
  Icon,
  message,
  DatePicker
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, history, QMMethod, ValidConst } from 'qmkit';
import { WmRangePicker } from 'biz';
const RangePicker = DatePicker.RangePicker;
import { fromJS } from 'immutable';
import ChooseCoupons from '../common-components/choose-coupons';
import GoodsModal from './modoul/goods-modal';

import SelectedGoodsGrid from './selected-goods-grid';

const FormItem = Form.Item;
const img01 = require('../img/tips-img.png');
const NumBox = styled.div`
  .chooseNum .has-error .ant-form-explain {
    margin-left: 90px;
  }
`;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

export default class StoreForm extends React.Component<any, any> {
  props;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    const relaxProps = this._store.state();
    console.log(relaxProps.toJS(), 'relaxPropsrelaxPropsrelaxProps');
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      //营销活动已选的商品信息
      selectedSkuIds: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows: fromJS([])
    };
  }

  render() {
    const { selectedRows, skuExists } = this.state;
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const disableTimeList = store.state().get('disableTimeList');
    const { getFieldDecorator } = form;
    //进店赠券图片
    const tipsImg = (
      <div style={{ width: 240, height: 298 }}>
        <img src={img01} alt="" style={{ width: 240, height: 298 }} />
      </div>
    );

    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('activityName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '活动名称不超过40个字'
                },
                { min: 1, max: 40, message: '1-40字符' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorEmoji(rule, value, callback, '活动名称');
                  }
                }
              ],
              onChange: (e) => {
                store.changeFormField({ activityName: e.target.value });
              },
              initialValue: activity.get('activityName')
            })(
              <Input
                placeholder="活动名称不超过40个字"
                style={{ width: 360 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="赠券通知标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写赠券通知标题'
                },
                { min: 1, max: 10, message: '赠券通知标题不超过10个字符' }
              ],
              onChange: (e) => {
                store.changeFormField({ activityTitle: e.target.value });
              },
              initialValue: activity.get('activityTitle')
            })(<Input style={{ width: 360 }} />)}
            {/* <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#1890ff' }}
              />
            </Popover> */}
          </FormItem>

          <FormItem {...formItemLayout} label="赠券通知描述">
            {getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写赠券通知描述'
                },
                { min: 1, max: 20, message: '赠券通知描述不超过20个字' }
              ],
              onChange: (e) => {
                store.changeFormField({ activityDesc: e.target.value });
              },
              initialValue: activity.get('activityDesc')
            })(<Input style={{ width: 360 }} />)}
            {/* <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#1890ff' }}
              />
            </Popover> */}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="起止时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择起止时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      value[0] &&
                      moment()
                        .second(0)
                        .unix() > value[0].unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else if (value[0] && value[0].unix() >= value[1].unix()) {
                      callback('开始时间必须早于结束时间');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date &&
                  dateString &&
                  dateString[0] != '' &&
                  dateString[1] != '') {
                  store.changeFormField({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                } else {
                  store.changeFormField({
                    startTime: '',
                    endTime: ''
                  });
                }
              },
              initialValue: activity.get('startTime') &&
                activity.get('endTime') &&
                activity.get('startTime') != '' &&
                activity.get('endTime') != '' && [
                  moment(activity.get('startTime')),
                  moment(activity.get('endTime'))
                ]
            })(
              <WmRangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={false}
                format={Const.DAY_FORMAT}
                placeholder={['起始时间', '结束时间']}
                disableRanges={disableTimeList.toJS()}
              />
            )}
            &nbsp;&nbsp;
            <span style={{ color: '#999' }}>
              相关优惠券仅限活动期间展示及领取
            </span>
          </FormItem> */}
          <FormItem {...formItemLayout} label="起止时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择起止时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      moment().second(0) &&
                      moment().second(0).unix() > value[0].unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else if (value[0] && value[0].unix() >= value[1].unix()) {
                      callback('开始时间必须早于结束时间');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date) {
                  store.changeFormField({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }
              },
              initialValue: activity.get('startTime') &&
                activity.get('endTime') && [
                  moment(activity.get('startTime')),
                  moment(activity.get('endTime'))
                ]
            })(
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                disabledDate={(current) => {
                  return current && current.isBefore(moment().startOf('day'));
                }}
                allowClear={false}
                format={Const.DATE_FORMAT}
                placeholder={['开始时间', '结束时间']}
                showTime={{ format: 'HH:mm' }}
              />
            )}
            &nbsp;&nbsp;
            <span style={{ color: '#999' }}>
              相关优惠券仅限活动期间展示及领取
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator(
              'coupons',
              {}
            )(
              <ChooseCoupons
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  store.onChosenCoupons(coupons);
                  this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId) => {
                  store.onDelCoupon(couponId);
                  this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount) =>
                  store.changeCouponTotalCount(index, totalCount)
                }
                type={2}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="指定商品" required={true}>
            {getFieldDecorator(
              'goods',
              {}
            )(
              <div>
                <div style={{ display: 'flex' }}>
                  <Button
                    type="primary"
                    icon="plus"
                    onClick={this.openGoodsModal}
                  >
                    添加指定商品
                  </Button>
                  &nbsp;&nbsp;
                  <div>至少1个指定商品</div>
                </div>
                <SelectedGoodsGrid
                  selectedRows={selectedRows}
                  skuExists={skuExists}
                  itmelist={[]}
                  deleteSelectedSku={this.deleteSelectedSku}
                  cheBOx={this.cheBOx}
                  purChange={this.purChange}
                />
              </div>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="优惠券总组数">
            {getFieldDecorator('receiveCount', {
              rules: [
                {
                  required: true,
                  pattern: ValidConst.noZeroNineNumber,
                  message: '请输入1-999999999的整数'
                }
              ],
              onChange: (val) => store.changeFormField({ receiveCount: val }),
              initialValue: activity.get('receiveCount')
            })(<InputNumber />)}
            <span style={{ color: '#999' }}>（1-999999999组）</span>
          </FormItem>

          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button
                onClick={() => this._onSave()}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>返回</Button>
            </Col>
          </Row>
        </Form>
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          // marketingId={marketingId}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
      </NumBox>
    );
  }

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    console.log(
      selectedSkuIds,
      selectedRows.toJS(),
      'selectedSkuIds, selectedRows'
    );
    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    if (selectedSkuIds.length > 0) {
      this.props.form.resetFields('goods');
      this.setState({
        selectedSkuIds,
        selectedRows,
        goodsModal: { _modalVisible: false }
      });
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
  };
  purChange = (value, id) => {
    console.log('====================================');
    console.log(value, 'valuevalue');
    console.log('====================================');
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.purchaseNum = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  cheBOx = (id) => {
    console.log(id, '22222222222222');
    const { selectedRows } = this.state;
    console.log(selectedRows.toJS(), '66666666666666');
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.checked = !e.checked;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };
  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    console.log(
      selectedSkuIds,
      '这是什么',
      selectedSkuIds.findIndex((item) => item == skuId)
    );
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId)
      )
    });
  };

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;
    // selectedRows.toJS().forEach((item) => {
    //   if (selectedSkuIds.indexOf(item.goodsInfoId) == -1) {
    //     selectedSkuIds.push(item.marketingVO ? item.marketingVO.goodsInfoId : item.goodsInfoId)
    //   }
    // })

    // console.log(
    //   selectedSkuIds,
    //   selectedRows.toJS(),
    //   'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    // );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };
  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const { selectedSkuIds } = this.state;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 1.验证优惠券列表
    let errors = this._validCoupons(activity.get('coupons'), form);
    if (!activity.activityId) {
      form.resetFields(['time']);
      //强制校验创建时间
      if (
        moment().second(0).unix() > moment(activity.get('startTime')).unix()
      ) {
        form.setFields({
          ['time']: {
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        errors = true;
      }
    }
    if (selectedSkuIds.length >= 1) {
      // activity.set(
      //   'skuIds',
      //   selectedSkuIds
      // );
      store.changeFormField({ skuIds: selectedSkuIds });
    } else {
      message.error('至少添加1个指定商品');
      return false;
    }
    console.log(activity.toJS(), 'selectedSkuIdsselectedSkuIds');

    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs) => {
      if (!errs && !errors) {
        // 3.验证通过，保存
        store.save();
      }
    });
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };
}
