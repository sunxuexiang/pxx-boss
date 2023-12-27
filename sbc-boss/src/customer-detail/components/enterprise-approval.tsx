import { IMap, Relax } from 'plume2';
import * as React from 'react';
import { Form, Icon, Input, Col, Row } from 'antd';
const defaultImg = require('../img/default-img.png');

import {
  noop,
  Tips,
  Const,
  ValidConst,
  QMUpload,
  history,
  OneAuthWrapper
} from 'qmkit';

const formItemLayout = {
  labelCol: {
    span: 3,
    xs: { span: 24 },
    sm: { span: 11 }
  },
  wrapperCol: {
    span: 19,
    xs: { span: 24 },
    sm: { span: 13 }
  }
};

const formItemLayoutTr = {
  labelCol: {
    span: 4,
    xs: { span: 24 },
    sm: { span: 24 }
  },
  wrapperCol: {
    span: 18,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const formItemLayoutRight = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 18,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 6 }
};

const CUSTOMER_REGISTER_TYPE = {
  0: '家用',
  1: '商户',
  2: '单位',
  null: '-'
};

/**
 * 增票资质
 */
@Relax
export default class EnterpriseApproval extends React.Component<any, any> {
  _enterpriseSetFormBaseBase: any;

  constructor(props) {
    super(props);
    this._enterpriseSetFormBaseBase = Form.create()(EnterpriseSetFormBase);
  }

  props: {
    type?: string;
    relaxProps?: {
      customerForm: IMap;
      onFormChange: Function;
      releaseBindCustomer: Function;
      modifyEnterpriseInfo: Function;
      enterpriseModalShow: Function;
      validateCustomerType: Function;
    };
  };

  static relaxProps = {
    customerForm: 'customerForm',
    onFormChange: noop,
    releaseBindCustomer: noop,
    modifyEnterpriseInfo: noop,
    enterpriseModalShow: noop,
    validateCustomerType: noop
  };

  render() {
    let EnterpriseSetForm = this._enterpriseSetFormBaseBase;
    const { customerForm } = this.props.relaxProps;

    return (
      <div>
        <div className="base-info article-wrap">
          <Row className="wrap custom-detail-body">
            <Col {...colLayout} className="head">
              <img
                src={customerForm.get('headImg') || defaultImg}
                className="head-img"
              />
              <div className="info">
                <p className="name">
                  {customerForm && customerForm.get('customerName')}
                </p>
                <p className="phone">
                  账号：{customerForm && customerForm.get('customerAccount')}
                </p>
                <p className="status">
                  类型：
                  {customerForm &&
                    CUSTOMER_REGISTER_TYPE[
                      customerForm.get('customerRegisterType')
                    ]}
                </p>
              </div>
            </Col>
          </Row>
        </div>

        <EnterpriseSetForm
          ref="_enterpriseSetFormBaseBase"
          type={this.props.type}
          {...{ relaxProps: this.props.relaxProps }}
        />
      </div>
    );
  }
}

class EnterpriseSetFormBase extends React.Component<any, any> {
  render() {
    const {
      form: { getFieldDecorator },
      relaxProps: {
        customerForm,
        onFormChange,
        releaseBindCustomer,
        validateCustomerType
      }
    } = this.props;

    const customerRelates = customerForm.get('customerRelates');
    let businessLicenseImg = [];
    if (
      businessLicenseImg.length == 0 &&
      customerForm.get('businessLicenseUrl')
    ) {
      businessLicenseImg.push({
        uid: 0,
        status: 'done',
        url: customerForm.get('businessLicenseUrl')
      });
    }

    return (
      <Form>
        <table style={{ display: 'flex', overflow: 'auto' }}>
          <tbody style={{ width: '30%' }}>
            <tr style={{ width: '100%', display: 'inline-block' }}>
              <td style={{ width: '100%', display: 'inline-block' }}>
                <Form.Item
                  {...formItemLayout}
                  label="企业信息："
                  hasFeedback={true}
                >
                  <a
                    style={{ marginLeft: 20 }}
                    onClick={() => validateCustomerType()}
                  >
                    编辑
                  </a>
                </Form.Item>
              </td>
            </tr>
            <tr style={{ width: '100%', display: 'inline-block' }}>
              <td style={{ width: '100%', display: 'inline-block' }}>
                <Form.Item
                  {...formItemLayout}
                  label="企业名称："
                  hasFeedback={true}
                >
                  <span>{customerForm.get('enterpriseName') || ''}</span>
                </Form.Item>
                {/*<Form.Item*/}
                {/*{...formItemLayout}*/}
                {/*label="企业名称："*/}
                {/*hasFeedback={false}*/}
                {/*required={true}*/}
                {/*>*/}
                {/*{getFieldDecorator('enterpriseName', {*/}
                {/*initialValue: customerForm.get('enterpriseName'),*/}
                {/*rules: [*/}
                {/*{*/}
                {/*pattern: ValidConst.xyyCompanyName,*/}
                {/*message: '请输入正确的企业名称'*/}
                {/*}*/}
                {/*]*/}
                {/*})(*/}
                {/*<Input*/}
                {/*disabled={true}*/}
                {/*onChange={(e) =>*/}
                {/*onFormChange({*/}
                {/*field: 'enterpriseName',*/}
                {/*value: (e.target as any).value*/}
                {/*})*/}
                {/*}*/}
                {/*/>*/}
                {/*)}*/}
                {/*</Form.Item>*/}
              </td>
            </tr>
            <tr style={{ width: '100%', display: 'inline-block' }}>
              <td style={{ width: '100%', display: 'inline-block' }}>
                <Form.Item
                  {...formItemLayout}
                  label="企业统一社会信用代码："
                  hasFeedback={true}
                >
                  <span>{customerForm.get('socialCreditCode') || ''}</span>
                </Form.Item>
                {/*<Form.Item*/}
                {/*{...formItemLayout}*/}
                {/*label="企业统一社会信用代码："*/}
                {/*hasFeedback={false}*/}
                {/*required={true}*/}
                {/*>*/}
                {/*{getFieldDecorator('socialCreditCode', {*/}
                {/*initialValue: customerForm.get('socialCreditCode'),*/}
                {/*rules: [*/}
                {/*{*/}
                {/*pattern: ValidConst.socialCreditCodeNew,*/}
                {/*message: '请输入正确的社会信用代码且必须8-30字符'*/}
                {/*}*/}
                {/*]*/}
                {/*})(*/}
                {/*<Input*/}
                {/*onChange={(e) =>*/}
                {/*onFormChange({*/}
                {/*field: 'socialCreditCode',*/}
                {/*value: (e.target as any).value*/}
                {/*})*/}
                {/*}*/}
                {/*disabled={true}*/}
                {/*/>*/}
                {/*)}*/}
                {/*</Form.Item>*/}
              </td>
            </tr>
            <tr style={{ width: '100%', display: 'inline-block' }}>
              <td style={{ width: '100%', display: 'inline-block' }}>
                <Form.Item
                  {...formItemLayout}
                  label="营业执照："
                  required={true}
                >
                  {getFieldDecorator('businessLicenseImg', {
                    initialValue: customerForm.get('businessLicenseUrl')
                  })(
                    <div>
                      <QMUpload
                        name="uploadFile"
                        style={styles.box}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        fileList={businessLicenseImg}
                        listType={'picture-card'}
                        accept={'.jpg,.png,.gif,.jpeg'}
                        disabled={true}
                      >
                        {!businessLicenseImg ||
                        businessLicenseImg.length < 1 ? (
                          <Icon type="plus" style={styles.plus} />
                        ) : null}
                      </QMUpload>
                      {/*<Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且不超过5M，最多上传1张" />*/}
                    </div>
                  )}
                </Form.Item>
              </td>
            </tr>
          </tbody>
          <tbody style={styles.height}>
            <tr style={{ width: '100%', display: 'inline-block' }}>
              <td style={{ width: '100%', display: 'inline-block' }}>
                <Form.Item
                  {...formItemLayoutRight}
                  label="关联账号："
                  hasFeedback={true}
                >
                  <span></span>
                </Form.Item>
              </td>
            </tr>
            {customerRelates &&
              customerRelates.map((item, index) => {
                return (
                  <tr style={{ width: '100%', display: 'inline-block' }}>
                    <td style={{ width: '100%', display: 'inline-block' }}>
                      <Form.Item
                        {...formItemLayoutRight}
                        label={index + 1}
                        hasFeedback={true}
                      >
                        <div style={{ width: 300 }}>
                          {item.get('customerAccount')}
                          <a
                            style={{ float: 'right' }}
                            onClick={() =>
                              releaseBindCustomer(item.get('customerId'))
                            }
                          >
                            解绑
                          </a>
                          <a
                            style={{ marginRight: 10, float: 'right' }}
                            onClick={() =>
                              history.push(
                                `/customer-detail/${item.get('customerId')}`
                              )
                            }
                          >
                            查看
                          </a>
                        </div>
                      </Form.Item>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <OneAuthWrapper
          functionName={
            'f_customer_detail_edit,f_enterprise_customer_detail_edit'
          }
        >
          <div
            className={this.props.type === 'modal' ? 'btn-wrap' : 'bar-button'}
          ></div>
        </OneAuthWrapper>
      </Form>
    );
  }
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
  height: {
    height: 353,
    overflow: scroll,
    marginLeft: 100,
    width: '50%'
  }
};
