import * as React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Modal,
  Input,
  Form,
  DatePicker,
  Select,
  Radio,
  message,
  InputNumber
} from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { noop, ValidConst } from 'qmkit';

const FormItem = Form.Item;
const { Option } = Select;

const GreyText = styled.span`
  color: #999999;
  font-size: 12px;
  margin-left: 5px;
`;
const RedPoint = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

@Relax
export default class SupplierModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      supplierVisible: boolean;
      supplierModal: Function;
      supplierCheckInfo: Function; //商家审核信息
      checkInfo: IMap;
      acceptSupplier: Function; //审核商家
      company: IMap; //商家信息
    };
  };

  static relaxProps = {
    // 弹框是否显示
    supplierVisible: 'supplierVisible',
    // 关闭弹框
    supplierModal: noop,
    supplierCheckInfo: noop,
    checkInfo: 'checkInfo',
    company: 'company',
    acceptSupplier: noop
  };

  render() {
    const { supplierVisible, checkInfo, supplierCheckInfo } =
      this.props.relaxProps;

    console.info('------------ checkInfo --------- ', checkInfo.toJS());
    const rangeDate = checkInfo.get('contractStartDate')
      ? [
          moment(checkInfo.get('contractStartDate')),
          moment(checkInfo.get('contractEndDate'))
        ]
      : [];
    this.state = {
      rangeDate: rangeDate
    };
    const { getFieldDecorator } = this.props.form;
    if (!supplierVisible) {
      return null;
    }
    return (
      <Form>
        <Modal
          maskClosable={false}
          title={
            <div>
              商家审核<GreyText>请补充签约信息</GreyText>
            </div>
          }
          visible={supplierVisible}
          onCancel={this._handleModelCancel}
          onOk={this._handleOK}
          okText="保存"
          width={620}
        >
          <div>
            <FormItem {...formItemLayout} required={true} label="商家类型">
              {getFieldDecorator('companyType', {
                initialValue: checkInfo.get('companyType'),
                rules: [{ required: true, message: '请选择商家类型' }]
              })(
                <Radio.Group
                  onChange={(e) =>
                    supplierCheckInfo({
                      field: 'companyType',
                      value: e.target.value
                    })
                  }
                >
                  <Radio value={0}>自营商家</Radio>
                  <Radio value={2}>统仓统配</Radio>
                  <Radio value={1}>第三方商家</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="建行商家编号">
              {getFieldDecorator('constructionBankMerchantNumber', {
                initialValue: checkInfo.get('constructionBankMerchantNumber'),
                rules: [{ required: true, message: '请填写建行商家编号' }]
              })(
                <Input
                  style={{ width: '150px' }}
                  onChange={(e) =>
                    supplierCheckInfo({
                      field: 'constructionBankMerchantNumber',
                      value: e.target.value
                    })
                  }
                />
              )}
              <span style={styles.tipSpan}>
                请输入在建行平台生成的该商家编码
              </span>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="交易手续费">
              {getFieldDecorator('shareRatio', {
                initialValue: checkInfo.get('shareRatio'),
                rules: [
                  { required: true, message: '请填写交易手续费' },
                  {
                    pattern: ValidConst.discount,
                    message: '请填写正确的交易手续费'
                  }
                ]
              })(
                <Input
                  style={{ width: '100px' }}
                  onChange={(e) =>
                    supplierCheckInfo({
                      field: 'shareRatio',
                      value: e.target.value
                    })
                  }
                />
              )}
              <span>%</span>
              <span style={styles.tipSpan}>
                请输入0.00-100.00之间的任意数并保留两位小数
              </span>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="结算周期">
              {getFieldDecorator('settlementCycle', {
                initialValue: checkInfo.get('settlementCycle'),
                rules: [{ required: true, message: '请填写结算周期' }]
              })(
                <InputNumber
                  style={{ width: '100px' }}
                  precision={0}
                  min={1}
                  max={155}
                  onChange={(value) =>
                    supplierCheckInfo({ field: 'settlementCycle', value })
                  }
                />
              )}
              <span>天</span>
              <span style={styles.tipSpan}>请输入1-155 之间的整数</span>
            </FormItem>

            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 10 }}>
                <RedPoint>*</RedPoint>
                <H2>签约有效期</H2>
                <GreyText>商家店铺有效期</GreyText>
              </div>
              <DatePicker
                value={moment(
                  moment(new Date()).format('YYYY-MM-DD 00:00:00').toString()
                )}
                format="YYYY-MM-DD HH:mm:ss"
                disabled={true}
              />
              ~
              <DatePicker
                defaultValue={
                  checkInfo.get('contractEndDate')
                    ? moment(checkInfo.get('contractEndDate'))
                    : null
                }
                format="YYYY-MM-DD 23:59:59"
                onChange={(param) => this._changeCalender(param)}
                disabledDate={this.disabledDate}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
              />
              {/*<RangePicker*/}
              {/*value={this.state.rangeDate}*/}
              {/*onChange={(param) => this._changeCalender(param)}*/}
              {/*disabledDate={this.disabledDate}*/}
              {/*format="YYYY-MM-DD HH:mm:ss"*/}
              {/*/>*/}
            </div>
          </div>
        </Modal>
      </Form>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { supplierModal, supplierCheckInfo } = this.props.relaxProps;
    supplierCheckInfo({ field: 'contractStartDate', value: '' });
    supplierCheckInfo({ field: 'constructionBankMerchantNumber', value: '' });
    supplierCheckInfo({ field: 'shareRatio', value: '' });
    supplierCheckInfo({ field: 'settlementCycle', value: '' });
    supplierModal();
  };

  /**
   * 选择签约有效期
   * @param params
   * @private
   */
  _changeCalender = (params) => {
    const { supplierCheckInfo } = this.props.relaxProps;
    let endTime;
    if (params) {
      endTime = params.format('YYYY-MM-DD 23:59:59');
    }
    supplierCheckInfo({ field: 'contractEndDate', value: endTime });
  };

  /**
   * 保存所选中的信息
   * @private
   */
  _handleOK = async () => {
    const { acceptSupplier, supplierCheckInfo, checkInfo } =
      this.props.relaxProps;
    const form = this.props.form;
    //校验决算日期的输入是否有误
    form.validateFields((errs) => {
      if (!errs) {
        //审核信息中的审核状态置为1
        supplierCheckInfo({ field: 'auditState', value: 1 });
        //非空校验
        if (!checkInfo.get('contractEndDate')) {
          message.error('请选择签约有效期');
          return;
        } else {
          //审核信息
          acceptSupplier();
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 禁选择的日期(昨天和昨天之前)
   * @param current
   * @returns {any|boolean}
   */
  disabledDate(current) {
    return (
      current && current <= moment(new Date().getTime() - 1000 * 60 * 60 * 24)
    );
  }
}

const styles = {
  tipSpan: {
    paddingLeft: '10px',
    color: 'red'
  }
};
