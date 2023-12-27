import React from 'react';
import { Relax, msg } from 'plume2';
import {
  Const,
  DataGrid,
  noop,
  AuthWrapper,
  QMUpload,
  DialogChooseUnit
} from 'qmkit';
import { List, fromJS } from 'immutable';
import {
  Icon,
  message,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Input,
  Radio,
  Button,
  Select
} from 'antd';
import momnet from 'moment';
import PropTypes from 'prop-types';
const bgImg = require('../img/bg.png');
const modalClose = require('../img/modal-close.png');
const imageUpload = require('../img/image-upload.png');
const imageDelete = require('../img/image-delete.png');
const imageLink = require('../img/image-link.png');
const FILE_MAX_SIZE = 1000 * 1024;
type TList = List<any>;
const { Column } = DataGrid;
const { Option } = Select;
/**
 * 订单收款单列表
 */
@Relax
export default class AddModal extends React.Component<any, any> {
  _store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      popupName: '',
      launchFrequency: '',
      jumpPage: ''
    };
  }
  props: {
    relaxProps?: {
      loading: boolean;
      radioKey: any;
      radioTimes: any;
      images: [];
      onChangeRadio;
      submit;
      onChangeFile;
      onChangeCheckBox;
      onChangeDate;
      onChangeTimes;
      Function;
      changeIsFull;
      onChange;
      warehouseList:any,
      sizeType: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    radioKey: 'radioKey',
    radioTimes: 'radioTimes',
    onChangeRadio: noop,
    onChangeFile: noop,
    submit: noop,
    onChangeCheckBox: noop,
    onChangeDate: noop,
    onChangeTimes: noop,
    onChange:noop,
    // 附件信息
    images: 'images',
    changeIsFull: noop,
    sizeType: 'sizeType',
    warehouseList:'warehouseList'
  };

  render() {
    const {
      radioKey,
      radioTimes,
      onChangeRadio,
      onChangeCheckBox,
      onChangeDate,
      onChangeTimes,
      changeIsFull,
      submit,
      sizeType,
      onChange,
      warehouseList
    } = this.props.relaxProps;

    const { RangePicker } = DatePicker;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px'
    };

    let images = this.props.relaxProps.images as any;

    if (images instanceof Array && images.length > 0) {
      images = fromJS([
        {
          uid: images[0].uid,
          name: images[0].name,
          size: images[0].size,
          status: images[0].status,
          url: images[0].response[0]
        }
      ]);
    } else if (images instanceof Array && images.length == 0) {
      images = fromJS([]);
    }

    images = images.toJS();
    return (
      <div>
        <Row>
          <Col span={8}>
            <div className="left-state">
              <img className="leftBg" src={bgImg} />
              {images.length > 0 &&
                (sizeType === 1 ? (
                  <div className="leftFullModal">
                    <img className="leftFullModalBg" src={images[0].url} />
                  </div>
                ) : (
                  <div className="leftModal">
                    <div>
                      <img className="leftModalBg" src={images[0].url} />
                    </div>
                    <div className="modalClose">
                      <img src={modalClose} />
                    </div>
                  </div>
                ))}
            </div>
          </Col>
          <Col span={8}>
            <div className="right-state">
              <div className="title">弹窗</div>
              <div className="form-state">
                <div className="from-title">应用界面</div>
                <div className="from-usage">
                  <div className="form-position">
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      onChange={(e) => onChangeCheckBox(e)}
                    >
                      <Row>
                        <Col span={6}>
                          <Checkbox value="shoppingIndex">商城首页</Checkbox>
                        </Col>
                        <Col span={6}>
                          <Checkbox value="shoppingCart">购物车</Checkbox>
                        </Col>
                        <Col span={6}>
                          <Checkbox value="personalCenter">个人中心</Checkbox>
                        </Col>
                        <Col span={6}>
                          <Checkbox value="memberCenter">会员中心</Checkbox>
                        </Col>
                        <Col span={6}>
                          <Checkbox value="groupChannel">拼团频道</Checkbox>
                        </Col>
                        <Col span={6}>
                          <Checkbox value="seckillChannel">秒杀频道</Checkbox>
                        </Col>
                        <Col span={6}>
                          <Checkbox value="securitiesCenter">领券中心</Checkbox>
                        </Col>
                        {/*<Col span={6}>*/}
                        {/*  <Checkbox value="integralMall">积分商城</Checkbox>*/}
                        {/*</Col>*/}
                      </Row>
                    </Checkbox.Group>
                  </div>
                </div>
              </div>
              <div className="form-state">
                <div className="from-title">投放时间</div>
                <div className="from-usage">
                  <div className="form-position">
                    <RangePicker showTime onChange={(e) => onChangeDate(e)} />
                  </div>
                </div>
              </div>
              <div className="form-state">
                <div className="from-title">投放仓库</div>
                <div className="from-usage">
                  <div className="form-position">
                  <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={(e)=>onChange('wareId',e)}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {warehouseList.toJS().map((item,i)=><Option key={i} value={item.wareId}>{item.wareName}</Option>)}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="form-state">
                <div className="from-title">弹窗设置</div>
                <div className="from-usage">
                  <div className="form-position ">
                    <Input
                      placeholder="弹窗名称"
                      maxLength={20}
                      onChange={(e) =>
                        this.setState({ popupName: e.target.value })
                      }
                    />
                    <div className="form-position-upload">
                      {images.length > 0 && (
                        <div className="pre-img">
                          <img className="pre-img-bg" src={images[0].url} />
                          <div className="pre-menu-icon">
                            <QMUpload
                              style={styles.box}
                              name="uploadFile"
                              showUploadList={false}
                              action={
                                Const.HOST +
                                '/uploadResource?resourceType=IMAGE'
                              }
                              accept={'.jpg,.jpeg,.png,.gif'}
                              onChange={this._editImages}
                              beforeUpload={this._checkUploadFile}
                            >
                              <div className="icon-upload">
                                <img src={imageUpload} />
                              </div>
                            </QMUpload>
                            <div className="icon-delete">
                              <img
                                onClick={() => this._store.onChangeFile([])}
                                src={imageDelete}
                              />
                            </div>
                            <div className="icon-link">
                              <img
                                src={imageLink}
                                onClick={(e) => {
                                  msg.emit('edit:chooseLink', {
                                    option: {},
                                    otherInfo: {},
                                    changeVal: (chooseInfo) => {
                                      this._changeVal(null, null, chooseInfo);
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <QMUpload
                        style={styles.box}
                        name="uploadFile"
                        showUploadList={false}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        listType="picture-card"
                        accept={'.jpg,.jpeg,.png,.gif'}
                        onChange={this._editImages}
                        beforeUpload={this._checkUploadFile}
                      >
                        {images.length < 1 ? (
                          <Icon type="plus" style={styles.plus} />
                        ) : null}
                      </QMUpload>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-state">
                <div
                  style={
                    images.length == 0 ? styles.imagesNull : styles.imagesUpload
                  }
                >
                  {`图片可以制作为规则的卡片型或不规则的氛围型，建议尺寸为宽度${
                    sizeType === 1 ? '750' : '560'
                  }像素，高度为${
                    sizeType === 1 ? '1334' : '800'
                  }像素，若为氛围型广告，建议使用PNG图片`}
                </div>
              </div>
              <div
                className="form-state"
                style={
                  images.length == 0 ? styles.imagesNulls : styles.imagesUploads
                }
              >
                <div className="from-title">弹出频次</div>
                <div className="from-usage">
                  <div className="">
                    <Radio.Group
                      onChange={(e) => onChangeRadio(e.target.value)}
                      value={radioKey}
                    >
                      <Radio style={radioStyle} value={0}>
                        首次访问页面时出现，之后不再出现
                      </Radio>
                      <Radio style={radioStyle} value={2}>
                        每次访问首页出现。
                      </Radio>
                      <Radio style={radioStyle} value={1}>
                        首次访问页面时出现，之后每
                        <Input
                          style={styles.timeState}
                          type="number"
                          min="1"
                          value={radioTimes}
                          disabled={radioKey == 0}
                          onChange={(e) => onChangeTimes(e.target.value)}
                        />
                        天出现一次
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div
                className="form-state"
                style={
                  images.length == 0 ? styles.imagesNulls : styles.imagesUploads
                }
              >
                <div className="from-title">边框尺寸</div>
                <div className="from-usage">
                  <div className="">
                    <Radio.Group
                      onChange={(e) => changeIsFull(e.target.value)}
                      value={sizeType}
                    >
                      <Radio style={radioStyle} value={0}>
                        非全屏
                      </Radio>
                      <Radio style={radioStyle} value={1}>
                        全屏
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <DialogChooseUnit
                platform="weixin"
                systemCode="d2cStore"
                apiHost={Const.HOST}
              />
              <AuthWrapper functionName={'f_popup_administration'}>
                <div className="bar-button">
                  <Button
                    type="primary"
                    onClick={() =>
                      submit({
                        popupName: this.state.popupName,
                        jumpPage: this.state.jumpPage
                      })
                    }
                  >
                    保存
                  </Button>
                </div>
              </AuthWrapper>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  // 替换props
  _changeVal = (pathArray, newVal, platFormValueMap) => {
    this._store.onChangeJumpPage(platFormValueMap);
    // this.props.onDataChange(pathArray, newVal, platFormValueMap);
  };
  onChange = () => {};
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
        message.error('文件大小不能超过100KB');
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
      return;
    }
    if (file.status == 'done' || fileList.length == 0) {
      this._store.onChangeFile(fileList.slice(-1));
    }
  };
  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList.map((file) => {
      return {
        uid: file.uid,
        status: file.status,
        url: file.response ? file.response[0] : file.url
      };
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
  timeState: {
    width: '60px'
  },
  imagesNull: {
    marginTop: '130px',
    fontSize: '12px'
  },
  imagesNulls: {
    marginTop: '30px'
  },
  imagesUpload: {
    marginTop: '430px',
    fontSize: '12px'
  },
  imagesUploads: {
    marginTop: '30px'
  }
};
