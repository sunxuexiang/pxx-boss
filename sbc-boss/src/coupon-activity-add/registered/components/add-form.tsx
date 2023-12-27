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
  message
} from 'antd';
import PropTypes from 'prop-types';
import { Store ,Relax} from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, history, QMMethod, ValidConst ,QMUpload ,Tips } from 'qmkit';
import { WmRangePicker } from 'biz';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../common-components/choose-coupons';

const FormItem = Form.Item;
const img01 = require('../img/tips-img.png'); // 注册赠券提示图片

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

const FILE_MAX_SIZE = 5 * 1024 * 1024;
// @Relax
export default class RegisteredAddForm extends React.Component<any, any> {
  // props;
  props: {
    form?: any;
    relaxProps?: {
      // 退货说明
      description: any;
      // 附件信息
      images: any;
      editItem: Function;
      editImages: Function;
    };
  };
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }
  static relaxProps =  {
    // 退货说明
    description: 'description',
    // 附件信息
    images: 'images',
  }

  render() {
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const images = store.state().get('images').toJS();
    const description = store.state().get('description');
    const disableTimeList = store.state().get('disableTimeList');
    const imageUrl = store.state().get('activity');
    console.log('====================================');
    console.log(images,'imageUrlimageUrl');
    console.log('====================================');
    const { getFieldDecorator } = form;
    // 注册赠券提示图片
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
                  message: '请填写活动名称'
                },
                { min: 1, max: 40, message: '活动名称不超过40个字' },
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

          <FormItem {...formItemLayout} label="参与成功通知标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写参与成功通知标题'
                },
                { min: 1, max: 10, message: '参与成功通知标题不超过10个字符' }
              ],
              onChange: (e) => {
                store.changeFormField({ activityTitle: e.target.value });
              },
              initialValue: activity.get('activityTitle')
            })(<Input style={{ width: 360 }} />)}
            <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#F56C1D' }}
              />
            </Popover>
          </FormItem>

          <FormItem {...formItemLayout} label="参与成功通知描述">
            {getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写参与成功通知描述'
                },
                { min: 1, max: 20, message: '参与成功通知描述不超过20个字' }
              ],
              onChange: (e) => {
                store.changeFormField({ activityDesc: e.target.value });
              },
              initialValue: activity.get('activityDesc')
            })(<Input style={{ width: 360 }} />)}
            <Popover
              getPopupContainer={() => document.getElementById('page-content')}
              content={tipsImg}
              placement="right"
            >
              <Icon
                type="question-circle-o"
                style={{ marginLeft: 10, color: '#F56C1D' }}
              />
            </Popover>
          </FormItem>

          <FormItem {...formItemLayout} label="起止时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择活动时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      value[0] &&
                      moment()
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .unix() > value[0].unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (
                  date &&
                  dateString &&
                  dateString[0] != '' &&
                  dateString[1] != ''
                ) {
                  store.changeFormField({
                    startTime: dateString[0] + ' 00:00:00',
                    endTime: dateString[1] + ' 23:59:59'
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
                placeholder={['开始时间', '结束时间']}
                disableRanges={disableTimeList.toJS()}
              />
            )}
            &nbsp;&nbsp;
            <span style={{ color: '#999' }}>
              相关优惠券仅限活动期间展示及领取
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="弹窗设置">
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl,
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传弹窗'
              //   }
              // ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages}
                  action={
                    Const.HOST + '/uploadResource?resourceType=IMAGE'
                  }
                  fileList={images}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您的弹窗图片上传,支持的图片格式：jpg、jpeg、png、gif，文件大小不超过5M,最多上传10张" />
              </div>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator('coupons', {})(
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
                type={3}
              />
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
              <Button onClick={() => history.goBack()}>取消</Button>
            </Col>
          </Row>
        </Form>
      </NumBox>
    );
  }

    /**
   * 检查文件格式
   */
     _checkUploadFile = (file) => {
      let fileName = file.name.toLowerCase();
      // 支持的图片格式：jpg、jpeg、png、gif
      if (
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.gif')
      ) {
        if (file.size <= FILE_MAX_SIZE) {
          return true;
        } else {
          message.error('文件大小不能超过5M');
          return false;
        }
      } else {
        message.error('文件格式错误');
        return false;
      }
    };

    /**
   * 改变图片
   */
     _editImages = ({ file, fileList }) => {
      if (file.status == 'error') {
        message.error('上传失败');
      }
      const store = this._store as any;
      store.editImages(fromJS(fileList));
    };

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 1.验证优惠券列表
    let errors = this._validCoupons(activity.get('coupons'), form);
    if (!activity.activityId) {
      form.resetFields(['time']);
      //强制校验创建时间
      if (
        moment()
          .hour(0)
          .minute(0)
          .second(0)
          .unix() > moment(activity.get('startTime')).unix()
      ) {
        form.setFields({
          ['time']: {
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        errors = true;
      }
    }
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
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  } as any,

  avatar: {
    width: 150,
    height: 150
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  } as any,
  imgPlus: {
    width: 88,
    height: 88,
    border: '1px solid #eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
