import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Tooltip, message, Switch, Radio } from 'antd';

import PropTypes from 'prop-types';
import { Const, Tips, QMUpload, AuthWrapper, isSystem } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
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

  _store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      allSubjectColorPicker: false,
      tagButtonColorPicker: false
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const settingForm = _state.get('settings');

    let pcWebsite = {
      initialValue: settingForm.get('pcWebsite')
    };
    let mobileWebsite = {
      initialValue: settingForm.get('mobileWebsite')
    };
    let supplierWebsite = {
      initialValue: settingForm.get('supplierWebsite')
    };

    const pcIco = settingForm.get('pcIco');
    const pcIcoImage = pcIco ? JSON.parse(pcIco) : [];
    const pcLogo = settingForm.get('pcLogo');
    const pcLogoImage = pcLogo ? JSON.parse(pcLogo) : [];
    const pcBanner = settingForm.get('pcBanner');
    const pcBannerImage = pcBanner ? JSON.parse(pcBanner) : [];
    const allSubjectColor = settingForm.get('allSubjectColor');
    const iconFlag = settingForm.get('iconFlag');
    const tagButtonColor = settingForm.get('tagButtonColor');
    const styles = reactCSS({
      default: {
        allSubjectColor: {
          background: allSubjectColor
        },
        tagButtonColor: {
          background: tagButtonColor
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          left: '15px',
          top: '-320px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });
    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={isSystem(this._handleSubmit)}
      >
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="PC端商城网址"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('pcWebsite', {
                ...pcWebsite,
                rules: [
                  { required: true, message: '请填写PC端商城网址' },
                  { validator: this.checkWebsite }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={styles.toolBox}>
              <Tooltip placement="right" title="客户的PC端订货入口">
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="移动端商城网址"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('mobileWebsite', {
                ...mobileWebsite,
                rules: [
                  { required: true, message: '请填写移动端商城网址' },
                  { validator: this.checkWebsite }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={styles.toolBox}>
              <Tooltip placement="right" title="客户的移动端订货入口">
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        {/*zhanghao update 新增商家后台登录网址*/}
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="商家后台登录网址"
              hasFeedback
              required={false}
            >
              {getFieldDecorator('supplierWebsite', {
                ...supplierWebsite,
                rules: [
                  { required: false, message: '请填写商家后台登录网址' },
                  { validator: this.checkWebsite }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={styles.toolBox}>
              <Tooltip placement="right" title="商家后台登录地址">
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={18}>

            {/* <FormItem {...formItemLayout} label="App图标开关">
              {getFieldDecorator('iconFlag', {
                initialValue: settingForm.get('iconFlag')
              })(
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={settingForm.get('iconFlag')}
                  onChange={(e) => {
                    console.log(e);
                    
                    this._store.settingFormChange('iconFlag', e);
                    this.props.form.resetFields();
                  }}
                />
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} label="App图标开关">
              {getFieldDecorator('iconFlag', {
                initialValue: settingForm.get('iconFlag')
              })(
                // <Switch
                //   checkedChildren="开"
                //   unCheckedChildren="关"
                //   checked={settingForm.get('iconFlag')}
                //   onChange={(e) => {
                //     console.log(e,'2222222222111');

                //     this._store.settingFormChange('iconFlag', e);
                //     this.props.form.resetFields();
                //   }}
                // />

                <Radio.Group onChange={(e) => {
                  // console.log(e.target.value,'2222222222222222')
                  this._store.settingFormChange('iconFlag', e.target.value);
                  this.props.form.resetFields();
                }} value={settingForm.get('iconFlag')}>
                  <Radio value={0}>默认图标</Radio>
                  <Radio value={1}>囤货节图标</Radio>
                  <Radio value={2}>年货节图标</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={false}
              {...formItemLayout}
              label="商城网页图标"
              hasFeedback
            >
              <div className="clearfix logoImg">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editIco}
                  fileList={pcIcoImage}
                  accept={'.ico'}
                  beforeUpload={this._checkIcoFile.bind(this, 10)}
                >
                  {pcIcoImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('pcIco', {
                  initialValue: pcIco
                })(<Input type="hidden" />)}
              </div>
              <Tips title="您的PC商城网页标题图标，最多可添加1张，请使用ico转换器处理您的图片，建议尺寸32*32、16*16 px，大小不超过10kb" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={false}
              {...formItemLayout}
              label="商城logo"
              hasFeedback
            >
              <div className="clearfix logoImg">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editPcLogo}
                  fileList={pcLogoImage}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile.bind(this, 1)}
                >
                  {pcLogoImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('pcLogo', {
                  initialValue: pcLogo
                })(<Input type="hidden" />)}
              </div>
              <Tips title="商城、后台logo，最多可添加1张，仅限jpg、jpeg、png、gif，建议尺寸136*80px，大小不超过1M" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              required={false}
              label="PC商城登录页banner"
              hasFeedback
            >
              <Row>
                <Col span={24}>
                  <div className="clearfix bannerImg">
                    <QMUpload
                      style={styles.box}
                      action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                      listType="picture-card"
                      name="uploadFile"
                      onChange={this._editPcBanners}
                      fileList={pcBannerImage}
                      accept={'.jpg,.jpeg,.png,.gif'}
                      beforeUpload={this._checkUploadFile.bind(this, 2)}
                    >
                      {pcBannerImage.length >= 5 ? null : (
                        <div>
                          <Icon type="plus" style={styles.plus} />
                        </div>
                      )}
                    </QMUpload>
                    {getFieldDecorator('pcBanner', {
                      initialValue: pcBanner
                    })(<Input type="hidden" />)}
                  </div>
                </Col>
              </Row>
              <Tips title="PC商城登录页广告图，最多可添加5张图片，格式仅限jpg、jpeg、png、gif，建议尺寸1920*550px，大小不超过2M" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              required={false}
              label="主题色"
              hasFeedback
            >
              <Row>
                <Col span={24}>
                  <div className="clearfix item-bg-edit">
                    <span
                      className="bj-color"
                      style={styles.allSubjectColor}
                      onClick={() => this.handleBjClick('allSubjectColor')}
                    />
                    <span
                      className="colorSetting"
                      onClick={() =>
                        this._store.editSettings('allSubjectColor', '#f7f7f7')
                      }
                    >
                      重置
                    </span>
                    {this.state.allSubjectColorPicker && (
                      <div style={styles.popover}>
                        <div
                          style={styles.cover}
                          onClick={() => this.handleBjClose('allSubjectColor')}
                        />
                        <SketchPicker
                          color={allSubjectColor}
                          onChange={(c) =>
                            this.handleBjChange(c, 'allSubjectColor')
                          }
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              required={false}
              label="tag按钮背景色"
              hasFeedback
            >
              <Row>
                <Col span={24}>
                  <div className="clearfix item-bg-edit">
                    <span
                      className="bj-color"
                      style={styles.tagButtonColor}
                      onClick={() => this.handleBjClick('tagButtonColor')}
                    />
                    <span
                      className="colorSetting"
                      onClick={() =>
                        this._store.editSettings('tagButtonColor', '#f7f7f7')
                      }
                    >
                      重置
                    </span>
                    {this.state.tagButtonColorPicker && (
                      <div style={styles.popover}>
                        <div
                          style={styles.cover}
                          onClick={() => this.handleBjClose('tagButtonColor')}
                        />
                        <SketchPicker
                          color={tagButtonColor}
                          onChange={(c) =>
                            this.handleBjChange(c, 'tagButtonColor')
                          }
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <AuthWrapper functionName="f_basicSetting_1">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editSetting(values);
      }
    });
  };

  /**
   * 编辑editIco
   * @param file
   * @param fileList
   * @private
   */
  _editIco = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('pcIco', '');
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('pcIco', JSON.stringify(fileList));
  };

  /**
   * 编辑pcLogo
   * @param file
   * @param fileList
   * @private
   */
  _editPcLogo = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('pcLogo', '');
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('pcLogo', JSON.stringify(fileList));
  };

  /**
   * 编辑pcBanners
   * @param file
   * @param fileList
   * @private
   */
  _editPcBanners = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('pcBanner', '');
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('pcBanner', JSON.stringify(fileList));
  };

  /**
   * 校验网址
   * @param rule
   * @param value
   * @param callback
   */
  checkWebsite = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    const pcWebsiteReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!pcWebsiteReg.test(value)) {
      callback(new Error('请输入正确的网址'));
      return;
    }

    callback();
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  _checkIcoFile = (size: number, file) => {
    let fileName = file.name;
    fileName = fileName.toLowerCase();
    // 支持的图片格式：.ico
    if (fileName.endsWith('.ico')) {
      if (file.size <= 1024 * size) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'kb');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
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
  // 打开颜色卡
  handleBjClick = (type) => {
    if (type == 'allSubjectColor') {
      this.setState({
        allSubjectColorPicker: !this.state.allSubjectColorPicker
      });
    } else {
      this.setState({ tagButtonColorPicker: !this.state.tagButtonColorPicker });
    }
  };
  // 关闭颜色卡
  handleBjClose = (type) => {
    if (type == 'allSubjectColor') {
      this.setState({ allSubjectColorPicker: false });
    } else {
      this.setState({ tagButtonColorPicker: false });
    }
  };
  // 选中颜色
  handleBjChange = (color, type) => {
    const rgb = color.rgb;
    const colorRGBA =
      'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
    this._store.editSettings(type, colorRGBA);
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
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
