import React from 'react';
import { Form, Input, Select, Icon, DatePicker, message } from 'antd';
import * as webapi from '../webapi';

import { QMUpload, Const, Tips } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

const FILE_MAX_SIZE = 5 * 1024 * 1024;

// @Relax
export default class ReceiveAdd extends React.Component<any, any> {
  _form: Object;

  render() {
    const ReceiveFormDetail = Form.create()(ReceiveForm);

    return (
      <div style={styles.container}>
        <div style={styles.text}>
          <Icon type="info-circle" />
          <h4>请确认客户已线下付款</h4>
        </div>

        <label style={styles.record}>收款记录</label>
        <ReceiveFormDetail ref={(_form) => (this['_form'] = _form)} />
      </div>
    );
  }
}

class ReceiveForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      account: [],
      images: []
    };
  }

  props: {
    form: any;
  };

  componentDidMount() {
    webapi.fetchOffLineAccout().then(({ res }) => {
      this.setState({
        account: res
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

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

    return (
      <Form>
        <FormItem {...formItemLayout} label="收款账户" hasFeedback>
          {getFieldDecorator('accountId', {
            rules: [
              {
                required: true,
                message: '请选择收款账号'
              }
            ]
          })(
            <Select>
              {this.state.account.map((v) => (
                <Option key={v.bankNo} value={v.accountId + ''}>
                  {`${v.bankName}-${v.bankNo}`}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="收款日期" hasFeedback>
          {getFieldDecorator('createTime', {
            rules: [
              {
                required: true,
                message: '请选择收款日期'
              }
            ]
          })(<DatePicker disabledDate={this.disabledDate} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="附件信息">
          {getFieldDecorator('encloses', {
            rules: [
              {
                required: true,
                message: '请选择附件'
              }
            ]
          })(<Input type="hidden" />)}
          <QMUpload
            name="uploadFile"
            style={styles.box}
            onChange={this._editImages}
            action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
            fileList={this.state.images}
            listType={'picture-card'}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={this._checkUploadFile}
          >
            {this.state.images.length < 1 ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <Tips title="上传订单付款凭证，如汇款单等；仅支持jpg、jpeg、png、gif格式，最多上传1张，大小不超过5M 。" />
        </FormItem>

        <FormItem {...formItemLayout} label="备注" hasFeedback>
          {getFieldDecorator('comment', {
            rules: [{ validator: this.checkComment }]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('备注请填写小于100字符'));
      return;
    }
    callback();
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    // 规避有时没有生成缩略图导致页面图片展示不了的问题
    this.setState({ images: fileList });
    if (fileList[0]) {
      if (fileList[0].status == 'done') {
        this.props.form.setFieldsValue({ encloses: fileList[0].response[0] });
      }
    } else {
      this.setState({ images: [] });
      this.props.form.setFieldsValue({ encloses: null });
    }
  };

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
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14
  },
  record: {
    color: '#333',
    fontSize: 14,
    paddingLeft: 30,
    paddingTop: 5,
    paddingBottom: 5
  } as any
} as any;
