import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Switch } from 'antd';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import PropTypes from 'prop-types';
import { Const, Tips, QMUpload, AuthWrapper, isSystem } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';
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
      allSubjectColorPicker: false
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const settingForm = _state.get('settings');

    const topImg = settingForm.get('topImg');
    const homeImage = topImg ? JSON.parse(topImg) : [];
    const topImgStatus = settingForm.get('topImgStatus');
    const sloganImg = settingForm.get('sloganImg');
    const homeSloganImg = sloganImg ? JSON.parse(sloganImg) : [];
    const sloganImgStatus = settingForm.get('sloganImgStatus');
    const componentStatus = settingForm.get('componentStatus');
    const searchBackColor = settingForm.get('searchBackColor');
    const searchBackStatus = settingForm.get('searchBackStatus');
    const styles = reactCSS({
      default: {
        allSubjectColor: {
          background: searchBackColor
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
              required={false}
              {...formItemLayout}
              label="顶部背景图"
              hasFeedback
            >
              <div className="clearfix logoImg" style={{ paddingTop: 5 }}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={topImgStatus}
                  onChange={(val) =>
                    this._store.settingFormChange('topImgStatus', val ? 1 : 0)
                  }
                  style={{ marginBottom: 10 }}
                />
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editIco}
                  fileList={homeImage}
                  accept={'.png,.gif'}
                  beforeUpload={this._checkIcoFile.bind(this, 15)}
                >
                  {homeImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('homeImage', {
                  initialValue: topImg
                })(<Input type="hidden" />)}
              </div>
              <Tips title="图片支持png、gif格式，大小不超过15kb" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={false}
              {...formItemLayout}
              label="slogsn背景图"
              hasFeedback
            >
              <div className="clearfix logoImg" style={{ paddingTop: 5 }}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={sloganImgStatus}
                  onChange={(val) =>
                    this._store.settingFormChange(
                      'sloganImgStatus',
                      val ? 1 : 0
                    )
                  }
                  style={{ marginBottom: 10 }}
                />
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editSlogan}
                  fileList={homeSloganImg}
                  accept={'.png,.gif'}
                  beforeUpload={this._checkIcoFile.bind(this, 15)}
                >
                  {homeSloganImg.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('sloganImg', {
                  initialValue: sloganImg
                })(<Input type="hidden" />)}
              </div>
              <Tips title="图片支持png、gif格式，大小不超过15kb" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={false}
              {...formItemLayout}
              label="组件显示"
              hasFeedback
            >
              <div className="clearfix logoImg" style={{ paddingTop: 5 }}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={componentStatus}
                  onChange={(val) =>
                    this._store.settingFormChange(
                      'componentStatus',
                      val ? 1 : 0
                    )
                  }
                  style={{ marginBottom: 10 }}
                />
              </div>
              <Tips title="显示天气/日期/温度" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={false}
              {...formItemLayout}
              label="搜索框背景色"
              hasFeedback
            >
              <div className="clearfix logoImg" style={{ paddingTop: 5 }}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={searchBackStatus}
                  onChange={(val) =>
                    this._store.settingFormChange(
                      'searchBackStatus',
                      val ? 1 : 0
                    )
                  }
                  style={{ marginBottom: 10 }}
                />
              </div>
              <div className="clearfix item-bg-edit">
                <span
                  className="bj-color"
                  style={styles.allSubjectColor}
                  onClick={() => this.handleBjClick()}
                />
                <span
                  className="colorSetting"
                  onClick={() =>
                    this._store.settingFormChange('searchBackColor', '#f7f7f7')
                  }
                >
                  重置
                </span>
                {this.state.allSubjectColorPicker && (
                  <div style={styles.popover}>
                    <div
                      style={styles.cover}
                      onClick={() => this.handleBjClose()}
                    />
                    <SketchPicker
                      color={searchBackColor}
                      onChange={(c) =>
                        this.handleBjChange(c, 'searchBackColor')
                      }
                    />
                  </div>
                )}
              </div>
              {/* <Input
                size="large"
                placeholder="请输入色值"
                value={searchBackColor}
                onChange={(e) =>
                  this._store.settingFormChange(
                    'searchBackColor',
                    e.target.value
                  )
                }
              /> */}
            </FormItem>
          </Col>
        </Row>

        <AuthWrapper functionName="f_homepage_edit">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  // 打开颜色卡
  handleBjClick = () => {
    this.setState({
      allSubjectColorPicker: !this.state.allSubjectColorPicker
    });
  };

  // 关闭颜色卡
  handleBjClose = () => {
    this.setState({ allSubjectColorPicker: false });
  };
  // 选中颜色
  handleBjChange = (color, type) => {
    const rgb = color.rgb;
    const colorRGBA =
      'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
    this._store.settingFormChange(type, colorRGBA);
  };

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
      this._store.settingFormChange('topImg', '');
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('topImg', JSON.stringify(fileList));
  };

  _editSlogan = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('sloganImg', '');
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('sloganImg', JSON.stringify(fileList));
  };

  _checkIcoFile = (size: number, file) => {
    let fileName = file.name;
    fileName = fileName.toLowerCase();
    if (fileName.endsWith('.png') || fileName.endsWith('.gif')) {
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
