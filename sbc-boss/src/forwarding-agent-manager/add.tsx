import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Radio,
  Row,
  Select,
  Tabs,
  Upload,
  message
} from 'antd';
import {
  BreadCrumb,
  Const,
  FindArea,
  Headline,
  QMUpload,
  ValidConst,
  history
} from 'qmkit';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './common.less';
import { addCarrier, getAllMarkets } from './webapi';
import moment from 'moment';

const FormItem = Form.Item;

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;

  + p {
    color: #999999;
    width: 430px;
  }
`;

const ExamplePic = styled.div`
  border: 1px solid #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  text-align: center;
  margin-right: 8px;
  display: inline-block;
  position: relative;
  p {
    color: #ffffff;
    width: 100%;
    height: 24px;
    line-height: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
  }
  img {
    border-radius: 4px;
  }
`;

const styles = {
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

const front = require('../supplier-detail/img/front.png');
const back = require('../supplier-detail/img/back.png');
const post = require('../supplier-detail/img/post.png');

const FILE_MAX_SIZE = 2 * 1024 * 1024;

let _bulkMarketDesc = null;

function AddForwardingAgent(props) {
  const { getFieldDecorator } = props.form;

  const { record } = props.location.state
    ? props.location.state
    : { record: null };

  const [provinceCityAreaStreet, setProvinceCityAreaStreet] = useState([]);

  useEffect(() => {
    _loadProvinceData();
    if (record) {
      _changeStreet([]);
    }
  }, []);

  const _loadProvinceData = () => {
    new Promise((resolve) => {
      const data = FindArea.findProvinceCityAreaStreetChooseToStreet();
      resolve(data);
    }).then((res) => {
      setProvinceCityAreaStreet(res as any);
    });
  };

  const formItemLayout = {
    labelCol: {
      span: 2,
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      span: 24,
      xs: { span: 24 },
      sm: { span: 14 }
    }
  };

  const content = (
    <div>
      <img src={post} alt="" height="400" />
    </div>
  );

  const person = (
    <div>
      <img src={front} alt="" height="400" />
    </div>
  );

  const personback = (
    <div>
      <img src={back} alt="" height="400" />
    </div>
  );

  const _changeStreet = async (item) => {
    let provinceId = null;
    if (item.length == 0) {
      provinceId = record.provinceCode;
    } else {
      provinceId = item[0];
    }
    try {
      const { res } = (await getAllMarkets({
        provinceId: provinceId,
        pageNum: 0,
        pageSize: 100
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        const content = res.context.content;
        if (record && record.bulkMarket.length > 0 && item.length == 0) {
          const chooseItems = [];
          for (const item of content) {
            for (const id of record.bulkMarket) {
              if (item.marketId == id) {
                chooseItems.push(item.marketId);
                if (_bulkMarketDesc == null) {
                  _bulkMarketDesc = [];
                }
                _bulkMarketDesc.push(item.marketName);
                break;
              }
            }
          }
          props.form.setFieldsValue({ bulkMarket: chooseItems });
        } else {
          props.form.setFieldsValue({
            bulkMarket: content.map((item) => item.marketId)
          });
        }
        setBulkMarketList(content);
      }
    } catch (error) {
      console.warn('error==>', error);
    }
  };

  const _isPicture = (url: string) => {
    return (
      url.endsWith('.jpg') ||
      url.endsWith('.png') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.gif')
    );
  };

  const _getName = (url: string) => {
    return url.split('/').pop();
  };

  const [attentType, setAttentType] = useState(
    record
      ? (() => {
          let firstItem = null;
          if (Array.isArray(record.contractAttach)) {
            firstItem = record.contractAttach[0];
          } else {
            firstItem = record.contractAttach;
          }
          return _isPicture(firstItem) ? 1 : 2;
        })()
      : 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [bulkMarketList, setBulkMarketList] = useState([]);

  const [formData, setFormData] = useState({
    /** 基础信息 */
    // 承运商名称
    carrierName: record ? record.carrierName : '',
    // 所在地区
    provinceCode: record ? `${record.provinceCode}` : '',
    provinceName: record ? record.provinceName : '',
    cityCode: record ? `${record.cityCode}` : '',
    cityName: record ? record.cityName : '',
    districtCode: record ? `${record.districtCode}` : '',
    districtName: record ? record.districtName : '',
    street: record ? record.street : '',
    streetCode: record ? `${record.streetCode}` : '',
    // 联系人
    contactName: record ? record.contactName : '',
    // 详细地址
    address: record ? record.address : '',
    // 联系电话
    contactMobile: record ? record.contactMobile : '',
    // 所在批发市场,多个逗号隔开
    bulkMarket: [],
    // 后台账号(商家账号)
    carrierAccount: record ? record.carrierAccount : '',

    /** 工商、资质 */
    // 企业名称
    companyName: record ? record.companyName : '',
    // 法人（法人姓名）
    legalPerson: record ? record.legalPerson : '',
    // 法人电话
    legalMobile: record ? record.legalMobile : '',
    //统一社会信用代码
    creditCode: record ? record.creditCode : '',
    // 营业执照副本
    businessLicense: record
      ? [
          {
            uid: record.businessLicense,
            status: 'done',
            url: record.businessLicense,
            name: _getName(record.businessLicense)
          }
        ]
      : [],
    // 法人身份证(正面)
    idCard: record ? 'true' : '',
    idCardFront: record
      ? [
          {
            uid: record.idCardImage.front,
            status: 'done',
            url: record.idCardImage.front,
            name: _getName(record.idCardImage.front)
          }
        ]
      : [],
    // 法人身份证(反面)
    idCardBack: record
      ? [
          {
            uid: record.idCardImage.back,
            status: 'done',
            url: record.idCardImage.back,
            name: _getName(record.idCardImage.back)
          }
        ]
      : [],
    // 道路运输许可证
    transportLicense: record
      ? [
          {
            uid: record.transportLicense,
            status: 'done',
            url: record.transportLicense,
            name: _getName(record.transportLicense)
          }
        ]
      : [],
    // 营运证
    operationLicense: record
      ? [
          {
            uid: record.operationLicense,
            status: 'done',
            url: record.operationLicense,
            name: _getName(record.operationLicense)
          }
        ]
      : [],
    // 其他资质
    otherLicense: record
      ? record.otherLicense.map((item) => {
          return {
            uid: item,
            status: 'done',
            url: item,
            name: _getName(item)
          };
        })
      : [],

    /** 财务信息 */
    // 建行商家编码
    ccbCode: record ? record.ccbCode : '',
    //  收款银行
    bankName: record ? record.bankName : '',
    // 分账比例
    fzRatio: record ? record.fzRatio : '',
    // 账户名
    bankUser: record ? record.bankUser : '',
    // 结算周期
    finalPeriod: record ? record.finalPeriod : '',
    // 收款账户
    bankAccount: record ? record.bankAccount : '',
    // 保证金状态
    bailState: record ? record.bailState : '',
    // 保证金金额
    bailMoney: record ? record.bailMoney : '',
    // 开户支行
    bankBranch: record ? record.bankBranch : '',

    /** 签约信息 */
    // 签约有效开始日期
    contractBeginTime: record ? moment(record.contractBeginTime) : '',
    // 签约有效结束日期
    contractEndTime: record ? moment(record.contractEndTime) : '',
    // 合同附件
    contractAttach: record
      ? (() => {
          const isArray = Array.isArray(record.contractAttach);
          if (isArray) {
            return record.contractAttach.map((item) => {
              return {
                uid: item,
                status: 'done',
                url: item,
                name: _getName(item)
              };
            });
          }
          return [
            {
              uid: record.contractAttach,
              status: 'done',
              url: record.contractAttach,
              name: _getName(record.contractAttach)
            }
          ];
        })()
      : []
  });

  /**
   * 检查文件格式
   */
  const _checkUploadFile = (file, fileList) => {
    if (fileList.length > 1) {
      message.error('只能上传一张图片');
      return false;
    }
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
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  const _editImages = (info, field) => {
    const { file, fileList } = info;
    const status = file.status;
    if (status === 'done') {
      message.success(`${file.name} 上传成功！`);
    } else if (status === 'error') {
      message.error(`${file.name} 上传失败！`);
    }
    if (field.startsWith('idCard')) {
      const hasIdCard =
        formData.idCardFront.length + formData.idCardBack.length > 1;
      props.form.setFieldsValue({
        idCard: fileList.length > 0 && hasIdCard ? 'true' : ''
      });
    } else {
      props.form.setFieldsValue({ [field]: fileList.length > 0 ? 'true' : '' });
    }
    setFormData({ ...formData, [field]: fileList });
  };

  const _saveData = async (values) => {
    setIsLoading(true);
    const param = { ...values };
    param.businessLicense = (() => {
      const item = formData.businessLicense[0];
      // @ts-ignore
      if (item.response) {
        // @ts-ignore
        return item.response.join('');
      } else {
        return item.url;
      }
    })();
    param.idCardFront = (() => {
      const item = formData.idCardFront[0];
      // @ts-ignore
      if (item.response) {
        // @ts-ignore
        return item.response.join('');
      } else {
        return item.url;
      }
    })();
    param.idCardBack = (() => {
      const item = formData.idCardBack[0];
      // @ts-ignore
      if (item.response) {
        // @ts-ignore
        return item.response.join('');
      } else {
        return item.url;
      }
    })();
    param.transportLicense = (() => {
      const item = formData.transportLicense[0];
      // @ts-ignore
      if (item.response) {
        // @ts-ignore
        return item.response.join('');
      } else {
        return item.url;
      }
    })();
    param.operationLicense = (() => {
      const item = formData.operationLicense[0];
      // @ts-ignore
      if (item.response) {
        // @ts-ignore
        return item.response.join('');
      } else {
        return item.url;
      }
    })();
    param.otherLicense = formData.otherLicense.map((item) => {
      if (item.response) {
        return item.response.join('');
      } else {
        return item.url;
      }
    });
    param.contractAttach = formData.contractAttach.map((item) => {
      if (item.response) {
        return item.response.join('');
      } else {
        return item.url;
      }
    });

    const funcs = [
      (code) => {
        param.provinceName = FindArea.findProviceName(code);
        param.provinceCode = code;
      },
      (code) => {
        param.cityName = FindArea.findCity(code);
        param.cityCode = code;
      },
      (code) => {
        param.districtName = FindArea.findArea(code);
        param.districtCode = code;
      },
      (code) => {
        param.street = FindArea.findStreet(code);
        param.streetCode = code;
      }
    ];
    param.streetCode.forEach((code, index) => {
      funcs[index](code);
    });

    param.idCardImage = {
      back: (() => {
        const item = formData.idCardBack[0];
        // @ts-ignore
        if (item.response) {
          // @ts-ignore
          return item.response.join('');
        } else {
          return item.url;
        }
      })(),
      front: (() => {
        const item = formData.idCardFront[0];
        // @ts-ignore
        if (item.response) {
          // @ts-ignore
          return item.response.join('');
        } else {
          return item.url;
        }
      })()
    };
    const expireTime = values.expireTime;
    param.expireTime = '';
    param.contractBeginTime = moment(expireTime[0]).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    param.contractEndTime = moment(expireTime[1]).format('YYYY-MM-DD HH:mm:ss');
    param.bulkMarketDesc = _bulkMarketDesc;
    try {
      if (record) {
        param.id = record.id;
      }
      const { res } = (await addCarrier(param, record ? true : false)) as any;
      if (res.code == 200) {
        message.success(`${record ? '编辑' : '新增'}承运商成功`);
        history.push('/forwarding-agent-manager');
      } else {
        message.error(res.message || `${record ? '编辑' : '新增'}承运商失败`);
      }
    } catch (error) {
      message.error(`${record ? '编辑' : '新增'}承运商失败`);
    } finally {
      setIsLoading(false);
    }
  };

  const _formSubmit = (_e) => {
    props.form.validateFields((err, values) => {
      if (!err) {
        _saveData(values);
      }
    });
  };

  const uploadProps = {
    name: 'uploadFile',
    headers: {
      Accept: 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    action: Const.HOST + '/uploadResource?resourceType=IMAGE',
    accept: attentType === 2 ? '.pdf, .PDF' : '.jpg,.jpeg,.png',
    onChange: (info) => {
      props.form.setFieldsValue({
        contractAttach: info.fileList.length > 0 ? 'true' : ''
      });
      setFormData({ ...formData, contractAttach: info.fileList });
    }
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <BreadCrumb />
      <Form className="container">
        {/* 头部标题 */}
        <Headline title="新增承运商" />
        <Row>
          <div className="add-item-ct">
            <Tabs>
              <Tabs.TabPane tab="基础信息" key="1">
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="承运商名称">
                      {getFieldDecorator('carrierName', {
                        rules: [
                          { required: true, message: '请输入承运商名称' }
                        ],
                        initialValue: formData.carrierName
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="所在地区">
                      {getFieldDecorator('streetCode', {
                        rules: [{ required: true, message: '请选择所在地区' }],
                        initialValue: (() => {
                          const tmp = [];
                          if (formData.provinceCode) {
                            tmp.push(formData.provinceCode);
                          }
                          if (formData.cityCode) {
                            tmp.push(formData.cityCode);
                          }
                          if (formData.districtCode) {
                            tmp.push(formData.districtCode);
                          }
                          if (formData.streetCode) {
                            tmp.push(formData.streetCode);
                          }
                          return tmp;
                        })()
                      })(
                        <Cascader
                          options={provinceCityAreaStreet}
                          allowClear={false}
                          onChange={(e) => {
                            _changeStreet(e);
                          }}
                          placeholder="请选择地区"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="联系人">
                      {getFieldDecorator('contactName', {
                        rules: [{ required: true, message: '请输入联系人' }],
                        initialValue: formData.contactName
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="详细地址">
                      {getFieldDecorator('address', {
                        rules: [{ required: true, message: '请输入详细地址' }],
                        initialValue: formData.address
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="联系电话">
                      {getFieldDecorator('contactMobile', {
                        rules: [{ required: true, message: '请输入联系电话' }],
                        initialValue: formData.contactMobile
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="所在批发市场">
                      {getFieldDecorator('bulkMarket', {
                        rules: [
                          { required: true, message: '请选择所在批发市场' }
                        ],
                        initialValue: formData.bulkMarket
                      })(
                        <Select mode="multiple">
                          {bulkMarketList.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.marketId}>
                                {item.marketName}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="后台账号">
                      {getFieldDecorator('carrierAccount', {
                        rules: [{ required: true, message: '请输入后台账号' }],
                        initialValue: formData.carrierAccount
                      })(<Input disabled={!!record} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <span
                      style={{
                        marginLeft: '-80px',
                        lineHeight: '30px',
                        fontSize: '12px'
                      }}
                    >
                      （该账号用于开通承运商后台的账号，建议用手机号）
                    </span>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className="add-item-ct">
            <Tabs>
              <Tabs.TabPane tab="工商、资质" key="2">
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="企业名称">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '请输入企业名称' }],
                        initialValue: formData.companyName
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="法人">
                      {getFieldDecorator('legalPerson', {
                        rules: [{ required: true, message: '请输入法人' }],
                        initialValue: formData.legalPerson
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="统一社会信用代码">
                      {getFieldDecorator('creditCode', {
                        rules: [
                          { required: true, message: '请输入统一社会信用代码' }
                        ],
                        initialValue: formData.creditCode
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="法人电话">
                      {getFieldDecorator('legalMobile', {
                        rules: [{ required: true, message: '请输入法人电话' }],
                        initialValue: formData.legalMobile
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      required={true}
                      {...formItemLayout}
                      label="营业执照副本"
                    >
                      <PicBox>
                        <QMUpload
                          name="uploadFile"
                          style={styles.box}
                          // @ts-ignore
                          fileList={formData.businessLicense}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) =>
                            _editImages(info, 'businessLicense')
                          }
                          beforeUpload={_checkUploadFile}
                        >
                          {formData.businessLicense.length < 1 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                        {getFieldDecorator('businessLicense', {
                          initialValue: formData.businessLicense[0] || '',
                          rules: [{ required: true, message: '请上传营业执照' }]
                        })(<Input type="hidden" />)}
                        <Popover content={content}>
                          <ExamplePic>
                            <img src={post} alt="" width="100%" />
                            <p>示例</p>
                          </ExamplePic>
                        </Popover>
                      </PicBox>
                      <p>仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传1张</p>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="法人身份证">
                      <PicBox>
                        <QMUpload
                          name="uploadFile"
                          style={styles.box}
                          // @ts-ignore
                          fileList={formData.idCardFront}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) => _editImages(info, 'idCardFront')}
                          beforeUpload={_checkUploadFile}
                        >
                          {formData.idCardFront.length < 1 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                        <Popover content={person}>
                          <ExamplePic>
                            <img src={front} alt="" width="100%" />
                            <p>正面示例</p>
                          </ExamplePic>
                        </Popover>
                        <QMUpload
                          style={styles.box}
                          name="uploadFile"
                          // @ts-ignore
                          fileList={formData.idCardBack}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) => _editImages(info, 'idCardBack')}
                          beforeUpload={_checkUploadFile}
                        >
                          {formData.idCardBack.length < 1 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                        {getFieldDecorator('idCard', {
                          initialValue: formData.idCard,
                          rules: [{ required: true, message: '请上传身份证' }]
                        })(<Input type="hidden" />)}
                        <Popover content={personback}>
                          <ExamplePic>
                            <img src={back} alt="" width="100%" />
                            <p>反面示例</p>
                          </ExamplePic>
                        </Popover>
                      </PicBox>
                      <p>
                        请上传身份证正反面照片，仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传2张
                      </p>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      required
                      label="道路运输许可证"
                    >
                      <PicBox>
                        <QMUpload
                          name="uploadFile"
                          style={styles.box}
                          // @ts-ignore
                          fileList={formData.transportLicense}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) =>
                            _editImages(info, 'transportLicense')
                          }
                          beforeUpload={_checkUploadFile}
                        >
                          {formData.transportLicense.length < 1 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                        {getFieldDecorator('transportLicense', {
                          initialValue:
                            formData.transportLicense.length > 0 ? 'true' : '',
                          rules: [
                            { required: true, message: '请上传道路运输许可证' }
                          ]
                        })(<Input type="hidden" />)}
                      </PicBox>
                      <p>仅限jpg、jpeg、gif、png，大小不超过2M，最多上传1张</p>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} required label="营运证">
                      <PicBox>
                        <QMUpload
                          name="uploadFile"
                          style={styles.box}
                          // @ts-ignore
                          fileList={formData.operationLicense}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) =>
                            _editImages(info, 'operationLicense')
                          }
                          beforeUpload={_checkUploadFile}
                        >
                          {formData.operationLicense.length < 1 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                        {getFieldDecorator('operationLicense', {
                          initialValue:
                            formData.operationLicense.length > 0 ? 'true' : '',
                          rules: [{ required: true, message: '请上传营运证' }]
                        })(<Input type="hidden" />)}
                      </PicBox>
                      <p>仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传1张</p>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="其他资质">
                      <PicBox>
                        <QMUpload
                          name="uploadFile"
                          style={styles.box}
                          fileList={formData.otherLicense}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) => _editImages(info, 'otherLicense')}
                          beforeUpload={_checkUploadFile}
                        >
                          {formData.otherLicense.length < 4 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                      </PicBox>
                      <p>仅限jpg、jpeg、png，大小不超过2M</p>
                    </FormItem>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className="add-item-ct">
            <Tabs>
              <Tabs.TabPane tab="财务信息" key="3">
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="建行商家编号">
                      {getFieldDecorator('ccbCode', {
                        rules: [
                          { required: true, message: '请输入建行商家编号' }
                        ],
                        initialValue: formData.ccbCode
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="收款银行">
                      {getFieldDecorator('bankName', {
                        rules: [{ required: true, message: '请输入收款银行' }],
                        initialValue: formData.bankName
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="分账比例(%)">
                      {getFieldDecorator('fzRatio', {
                        rules: [
                          { required: true, message: '请输入分账比例' },
                          {
                            pattern: ValidConst.discount,
                            message: '请输入正确的分账比例'
                          }
                        ],
                        initialValue: formData.fzRatio
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="账户名">
                      {getFieldDecorator('bankUser', {
                        rules: [{ required: true, message: '请输入账户名' }],
                        initialValue: formData.bankUser
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="结算周期(天)">
                      {getFieldDecorator('finalPeriod', {
                        rules: [
                          { required: true, message: '请输入结算周期' },
                          {
                            pattern: ValidConst.number,
                            message: '请输入正确的结算周期'
                          }
                        ],
                        initialValue: formData.finalPeriod
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="收款账户">
                      {getFieldDecorator('bankAccount', {
                        rules: [{ required: true, message: '请输入收款账户' }],
                        initialValue: formData.bankAccount
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="保证金">
                      <Row>
                        <Col span={12}>
                          <Form.Item>
                            {getFieldDecorator('bailState', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择已交或者未交'
                                }
                              ],
                              initialValue: formData.bailState
                            })(
                              <Radio.Group>
                                <Radio value={1}>已交</Radio>
                                <Radio value={2}>未交</Radio>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item>
                            {getFieldDecorator('bailMoney', {
                              rules: [
                                { required: true, message: '请输入保证金' }
                              ],
                              initialValue: formData.bailMoney
                            })(<Input addonAfter="万元" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="支行">
                      {getFieldDecorator('bankBranch', {
                        rules: [{ required: true, message: '请输入支行' }],
                        initialValue: formData.bankBranch
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className="add-item-ct">
            <Tabs>
              <Tabs.TabPane tab="签约信息" key="4">
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="签约有效期">
                      {getFieldDecorator('expireTime', {
                        rules: [
                          { required: true, message: '请输入签约有效期' }
                        ],
                        initialValue: [
                          formData.contractBeginTime,
                          formData.contractEndTime
                        ]
                      })(
                        <DatePicker.RangePicker
                          format={['YYYY-MM-DD', 'YYYY-MM-DD']}
                        ></DatePicker.RangePicker>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="合同附件" required>
                      <Radio.Group
                        value={attentType}
                        onChange={(_e) => {
                          setAttentType(_e.target.value);
                        }}
                      >
                        <Radio value={1}>图片</Radio>
                        <Radio value={2}>文件</Radio>
                      </Radio.Group>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      style={{ marginLeft: 100 }}
                      required
                    >
                      <Upload
                        {...uploadProps}
                        fileList={formData.contractAttach}
                        listType={attentType === 2 ? 'text' : 'picture-card'}
                      >
                        {attentType === 2 && (
                          <Button type="primary">点击上传文件</Button>
                        )}
                        {attentType === 1 && <Icon type="plus" />}
                      </Upload>
                      {getFieldDecorator('contractAttach', {
                        initialValue:
                          formData.contractAttach.length > 0 ? 'true' : '',
                        rules: [{ required: true, message: '请上传合同附件' }]
                      })(<Input type="hidden" />)}
                    </FormItem>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <Col span={24} style={{ marginTop: 20 }}>
            <Button
              loading={isLoading}
              type="primary"
              onClick={(e) => {
                _formSubmit(e);
              }}
            >
              保存
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              type="default"
              onClick={() => {
                history.push({
                  pathname: '/forwarding-agent-manager'
                });
              }}
            >
              返回
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Form.create()(AddForwardingAgent);
