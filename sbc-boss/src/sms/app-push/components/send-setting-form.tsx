import React from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Radio,
  Row,
  Select
} from 'antd';
import { msg } from 'plume2';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
const { TextArea } = Input;
import { Const, QMUpload } from 'qmkit';

const FILE_MAX_SIZE = 2 * 1024 * 1024;

const FormItem = Form.Item;
const { Option } = Select;

const types = [
  { key: 0, value: '全部会员' },
  { key: 1, value: '会员等级' },
  { key: 3, value: '会员人群' },
  { key: 4, value: '自定义选择' }
];

const types1 = [
  { key: 0, value: '全部会员' },
  { key: 1, value: '会员等级' },
  { key: 4, value: '自定义选择' }
];

const normalItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

const timeItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};

export default class SendSettingForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: '消息标题',
      spec: '消息内容',
      img: require('../img/default-img.png')
    };
  }

  componentDidMount() {
    this.props.setData('uPushSendForm', this.props.form);
  }

  render() {
    let {
      form: {
        getFieldDecorator
        // setFieldsValue
      },
      rfmGroupSearch,
      rfmGroupList,
      levelList,
      customerList,
      onFormFieldChange,
      selectedCustomerList,
      rfmGroup,
      customerLevel,
      ifModify,
      pushType,
      setData,
      dataInfo,
      imageUrl,
      crmFlag
    } = this.props;

    imageUrl = imageUrl ? imageUrl.toJS() : [];
    const {
      // 预计发送人数
      // expectedSendCount,
      msgContext,
      msgImg,
      msgName,
      // 消息接受人 0:全部会员 1:按会员等级 2:按标签 3:按人群 4:指定会员
      msgRecipient,
      // 等级、标签、人群ID。逗号分割
      // msgRecipientDetail,
      // msgRouter,
      msgTitle,
      pushTime
    } = this.props.uPushSendForm.toJS();

    return (
      <div className="send-setting-common">
        <div className="left-show">
          <div className="sms">IOS Push预览</div>
          <div className="send-preview">
            <div className="se-header">
              <div className="se-header">
                <img
                  src={require('../img/default-img.png')}
                  alt=""
                  width="16"
                  height="16"
                />
                <span>应用名称</span>
              </div>

              <span>10分钟前</span>
            </div>
            <div className="left-prew-row">
              <div className="mes-prew-box">
                <div className="se-title">
                  {msgTitle ? msgTitle : '消息标题'}
                </div>
                <div className="se-spec">
                  {msgContext ? msgContext : '消息内容'}
                </div>
              </div>
              <img
                src={msgImg ? msgImg : require('../img/default-img.png')}
                alt=""
                width="40"
                height="40"
              />
            </div>
          </div>

          <div className="sms">Android Push预览</div>
          <div className="send-preview send-preview-row">
            <img
              src={msgImg ? msgImg : require('../img/default-img.png')}
              alt=""
              width="40"
              height="40"
            />
            <div className="mes-prew-box">
              <div className="se-title">{msgTitle ? msgTitle : '消息标题'}</div>
              <div className="se-spec">
                {msgContext ? msgContext : '消息内容'}
              </div>
            </div>
          </div>

          <div className="sms">站内信预览</div>
          <div className="send-preview send-preview-row">
            <img
              src={msgImg ? msgImg : require('../img/default-img.png')}
              alt=""
              width="40"
              height="40"
            />
            <div className="mes-prew-box">
              <div className="se-title">{msgTitle ? msgTitle : '消息标题'}</div>
              <div className="se-spec">
                {msgContext ? msgContext : '消息内容'}
              </div>
            </div>
          </div>
        </div>
        <Form className="send-form">
          <Form.Item label={'任务名称'} required {...normalItemLayout}>
            {getFieldDecorator('msgName', {
              initialValue: msgName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写任务名称'
                },
                { min: 1, max: 20, message: '仅限1-20位字符' }
              ]
            })(
              <Input
                disabled={!ifModify}
                placeholder="请填写任务名称"
                onChange={(e) => {
                  onFormFieldChange({
                    field: 'msgName',
                    value: e.target.value
                  });
                  // this.setState({ msgName: e.target.value });
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={'消息标题'} required {...normalItemLayout}>
            {getFieldDecorator('msgTitle', {
              initialValue: msgTitle,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写消息标题'
                },
                { min: 1, max: 40, message: '仅限1-40位字符' }
              ]
            })(
              <Input
                disabled={!ifModify}
                placeholder="请填写消息标题"
                onChange={(e) => {
                  onFormFieldChange({
                    field: 'msgTitle',
                    value: e.target.value
                  });
                  // this.setState({ title: e.target.value });
                }}
              />
            )}
          </Form.Item>

          <Form.Item label={'消息内容'} required {...normalItemLayout}>
            {getFieldDecorator('msgContext', {
              initialValue: msgContext,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写消息内容'
                },
                { min: 1, max: 100, message: '仅限1-100位字符' }
              ]
            })(
              <Input
                disabled={!ifModify}
                placeholder="请填写消息内容"
                onChange={(e) => {
                  onFormFieldChange({
                    field: 'msgContext',
                    value: e.target.value
                  });
                  // this.setState({ spec: e.target.value });
                }}
              />
            )}
          </Form.Item>

          <FormItem label={'封面图'} {...normalItemLayout}>
            {getFieldDecorator('msgImg', {
              initialValue: msgImg
            })(
              <QMUpload
                disabled={!ifModify}
                name="uploadFile"
                fileList={imageUrl}
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                listType="picture-card"
                accept={'.jpg,.jpeg,.png,.gif'}
                onChange={({ file, fileList }) => {
                  this._editImages({ file, fileList });
                }}
                beforeUpload={this._checkUploadFile}
              >
                {imageUrl.length < 1 && <Icon type="plus" />}
              </QMUpload>
            )}
            <div style={{ fontSize: 12, color: '#999', marginTop: -10 }}>
              仅限jpg,jpeg,png,gif，建议尺寸64*64px
            </div>
          </FormItem>

          <Form.Item label={'落地页'} {...normalItemLayout}>
            {getFieldDecorator(
              'dataInfo',
              {}
            )(
              <Button
                disabled={!ifModify}
                type="primary"
                icon="plus"
                ghost
                onClick={() => {
                  const pathArray = this.props.linkHrefPath;
                  msg.emit('edit:chooseLink', {
                    option: {
                      // includeType: ['goodsList'], //只能选择商品列表信息.. 其他的关闭了.
                      // goodsLinkSupportAutoChecked: true //默认选中
                    },
                    otherInfo: {
                      // isDoublePlatformTpl: false, //是否是双平台模板
                      // platForm: 'pc' //pc || weixin
                    },
                    // currentVal: this.props.linkHref,
                    __data_info: dataInfo,
                    changeVal: (chooseInfo) => {
                      this._changeVal(pathArray, null, chooseInfo);
                    }
                  });
                }}
              >
                选择落地页
              </Button>
            )}
            {dataInfo &&
              dataInfo.get('info') &&
              (dataInfo.get('info').get('name') !== undefined ||
                dataInfo.get('info').get('storeName') !== undefined ||
                dataInfo.get('info').get('pathName') !== undefined ||
                dataInfo.get('info').get('title') !== undefined ||
                (dataInfo.get('info').get('goods') &&
                  dataInfo
                    .get('info')
                    .get('goods')
                    .get('goodsName') !== undefined) ||
                (dataInfo.get('info').get('goodsInfo') &&
                  dataInfo
                    .get('info')
                    .get('goodsInfo')
                    .get('goodsInfoName') !== undefined) ||
                dataInfo.get('info').get('marketingName') !== undefined) && (
                <div style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                  已选页面：{this._pageInfo(dataInfo)}
                </div>
              )}
          </Form.Item>

          <Row className="receive">
            <Col span={4} className="label">
              接收人:
            </Col>
            <Col span={20}>
              已选
              <span className="num">{this.props.customerTotal}</span>人
            </Col>
          </Row>
          <Row>
            <Col span={20} push={4}>
              <FormItem>
                {getFieldDecorator('msgRecipient', {
                  initialValue: msgRecipient,
                  rules: [{ required: true, message: '请选择会员类型' }]
                })(
                  <Radio.Group
                    disabled={!ifModify}
                    onChange={(e) => {
                      onFormFieldChange({
                        field: 'msgRecipient',
                        value: e.target.value
                      });
                      this.props.getCustomerTotal();
                    }}
                  >
                    {crmFlag
                      ? types.map((item) => (
                          <Radio key={item.key} value={item.key}>
                            {item.value}
                          </Radio>
                        ))
                      : types1.map((item) => (
                          <Radio key={item.key} value={item.key}>
                            {item.value}
                          </Radio>
                        ))}
                  </Radio.Group>
                  // disabled={item.key==4?true:false}
                  // disabled={item.key==4?true:false}
                )}
              </FormItem>
              {+msgRecipient === 1 && (
                <FormItem>
                  {getFieldDecorator('customerLevel', {
                    initialValue: customerLevel.toJS(),
                    rules: [{ required: true, message: '请选择会员等级' }]
                  })(
                    <Select
                      disabled={!ifModify}
                      mode="multiple"
                      placeholder="请选择会员等级"
                      onChange={(value) => {
                        this.props.getCustomerTotal({ customerLevel: value });
                      }}
                    >
                      {levelList.map((cate) => {
                        return (
                          <Option
                            key={'' + cate.get('customerLevelId')}
                            value={'' + cate.get('customerLevelId')}
                          >
                            {cate.get('customerLevelName')}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              )}
              {+msgRecipient === 3 && (
                <FormItem>
                  {getFieldDecorator('rfmGroup', {
                    initialValue: rfmGroup.toJS(),
                    rules: [{ required: true, message: '请选择会员人群' }]
                  })(
                    <Select
                      disabled={!ifModify}
                      mode="multiple"
                      filterOption={false}
                      onSearch={(value) => {
                        rfmGroupSearch(value);
                        this.setState({});
                      }}
                      placeholder="请选择会员人群"
                      onChange={(value) => {
                        this.props.getCustomerTotal({
                          rfmGroup: value
                        });
                      }}
                      onBlur={() => {
                        rfmGroupSearch('');
                      }}
                    >
                      {rfmGroupList.map((cate) => {
                        return (
                          <Option
                            key={cate.get('groupId')}
                            value={cate.get('groupId')}
                          >
                            {cate.get('groupName')}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              )}
              {+msgRecipient === 4 && (
                <TextArea
                  rows={4}
                  disabled={!ifModify}
                  onChange={(e) => {
                    this._addCustomer(e.target.value);
                    // this._searchCustomer(e.target.value);
                  }}
                />
                // <div className="choose-user">
                //   <div className="input-wrap">
                //     <Search
                //       disabled={!ifModify}
                //       placeholder="输入手机号搜索"
                //       onChange={(e) => {
                //         this._searchCustomer(e.target.value);
                //       }}
                //     />
                //     <ul className="customer-list">
                //       {customerList.toJS().map((item) => {
                //         const {
                //           customerAccount,
                //           customerName,
                //           customerId
                //         } = item;
                //         const flag = this._ifSelected(customerId);
                //         return (
                //           <li className="item" key={customerId}>
                //             <Button
                //               disabled={!ifModify}
                //               type={flag ? 'primary' : 'dashed'}
                //               className="customer-btn"
                //               onClick={() => {
                //                 if (!flag) {
                //                   this._addCustomer(item);
                //                 }
                //               }}
                //             >
                //               {customerAccount} {'  '}
                //               {customerName}
                //             </Button>
                //           </li>
                //         );
                //       })}
                //     </ul>
                //   </div>
                //   <div className="selected-wrap">
                //     <ul>
                //       {selectedCustomerList.toJS().map((item, index) => (
                //         <li className="item" key={item.customerAccount}>
                //           {item.customerAccount}
                //           {'  '}
                //           {item.customerName}
                //           <Icon
                //             type="close"
                //             className="close-icon"
                //             onClick={() => {
                //               this._deleteCustomer(index);
                //             }}
                //           />
                //         </li>
                //       ))}
                //     </ul>
                //   </div>
                // </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <FormItem
                label="发送时间"
                {...timeItemLayout}
                className="choose-sign"
              >
                {getFieldDecorator('pushType', {
                  initialValue: pushType,
                  rules: [{ required: true, message: '请选择发送时间类型' }]
                })(
                  <Radio.Group
                    disabled={!ifModify}
                    onChange={(e) => {
                      if (+e.target.value === 0) {
                        onFormFieldChange({
                          field: 'pushTime',
                          value: null
                        });
                      }
                      setData('pushType', e.target.value);
                    }}
                  >
                    <Radio value={0}>立即</Radio>
                    <Radio value={1}>定时</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              {+pushType === 1 && (
                <FormItem>
                  {getFieldDecorator('pushTime', {
                    initialValue: moment(
                      moment(pushTime || new Date())
                        .format('YYYY-MM-DD HH:mm:ss')
                        .toString()
                    ),
                    rules: [{ required: true, message: '请选择发送时间' }]
                  })(
                    <DatePicker
                      disabled={!ifModify}
                      showTime
                      disabledDate={this._disabledDate}
                      format="YYYY-MM-DD HH:mm:ss"
                      // disabledTime={() => {
                      //   return {
                      //     disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 22, 23]
                      //   };
                      // }}
                    />
                  )}
                </FormItem>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={20} push={4}>
              <p className="rember">
                最晚可设置7天后的任务，如需撤销，请在发送时间前操作
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  // 替换props
  _changeVal = (pathArray, newVal, platFormValueMap) => {
    this.props.onDataChange(pathArray, newVal, platFormValueMap);
  };

  _pageInfo = (dataInfo) => {
    let platFormValueMap = dataInfo.toJS();
    let info = platFormValueMap.info;
    if (platFormValueMap.linkKey === 'goodsList') {
      return info.name && '商品' + ' > ' + info.name;
    } else if (platFormValueMap.linkKey === 'storeList') {
      return info.storeName && '店铺' + ' > ' + info.storeName;
    } else if (platFormValueMap.linkKey === 'categoryList') {
      let name = '';
      let pathName = info.pathName.split(',');
      pathName.map((v) => {
        name += ' > ' + v;
      });
      return info.pathName && '类目' + name;
    } else if (platFormValueMap.linkKey === 'pageList') {
      return info.title && '页面' + ' > ' + info.title;
    } else if (platFormValueMap.linkKey === 'userpageList') {
      return info.title && '常用功能' + ' > ' + info.title;
    } else if (platFormValueMap.linkKey === 'promotionList') {
      let cateKey = platFormValueMap.info.cateKey;
      if (cateKey === 'groupon') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '拼团' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'flash') {
        return (
          info.goods.goodsName &&
          '营销' + ' > ' + '秒杀' + ' > ' + info.goods.goodsName
        );
      } else {
        return (
          info.marketingName &&
          '营销' + ' > ' + '满减/折/赠' + ' > ' + info.marketingName
        );
      }
    }
  };

  _addCustomer = (customerAccount) => {
    // let { customerAccount, customerName, customerId } = item;
    this.props.setState({
      customerAccount
      // selectedCustomerList: [
      //   ...this.props.selectedCustomerList.toJS(),
      //   { customerAccount, customerName, customerId }
      // ],
      // customerTotal: this.props.customerTotal + 1
    });
  };

  // _deleteCustomer = (index) => {
  //   if (!this.props.ifModify) {
  //     return;
  //   }
  //   let arr = this.props.selectedCustomerList.toJS();
  //   arr.splice(index, 1);
  //   this.props.setState({
  //     selectedCustomerList: arr,
  //     customerTotal: this.props.customerTotal - 1
  //   });
  // };

  // _ifSelected = (customerId) => {
  //   return (
  //     this.props.selectedCustomerList &&
  //     this.props.selectedCustomerList.toJS().some((customer) => {
  //       return customerId === customer.customerId;
  //     })
  //   );
  // };

  _searchCustomer = (customerAccount) => {
    this.props.getCustomerList(customerAccount);
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    let {
      form: {},
      onFormFieldChange
    } = this.props;
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    //删除图片
    if (file.status == 'removed') {
      this.props.setState({
        imageUrl: []
      });
      onFormFieldChange({
        field: 'msgImg',
        value: null
      });
      return;
    }
    fileList = JSON.parse(JSON.stringify(fileList));
    this.props.setState({
      imageUrl: [...fileList]
    });
    if (fileList[0].status == 'done') {
      let [
        {
          response: [url],
          name,
          uid,
          size
        }
      ] = fileList;
      this.props.setState({
        imageUrl: [{ url, name, uid, size }]
      });
      onFormFieldChange({
        field: 'msgImg',
        value: url
      });
    }
  };

  /**
   * 检查文件格式以及文件大小
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
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 可选的日期为当天 + 6
   */
  _disabledDate(current) {
    return (
      (current && moment(current.valueOf()).subtract(6, 'days') > moment()) ||
      (current &&
        current.valueOf() < Date.parse(new Date().toLocaleDateString()))
    );
  }
}
