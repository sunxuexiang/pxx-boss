import React from 'react';
import { Relax } from 'plume2';
import {
  message,
  Icon,
  Form,
  Input,
  Radio,
  DatePicker,
  Select,
  InputNumber
} from 'antd';
import FormImg from './formImg';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
// import { noop } from 'qmkit';
// import { IList } from 'typings/globalType';
// import { IMap } from 'plume2/es5/typings';
import { fromJS } from 'immutable';
// import { QMUpload, Const } from 'qmkit';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
    lg: { span: 5 },
    xl: { span: 5 },
    xxl: { span: 5 }
  },
  wrapperCol: {
    sm: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 }
  }
};
const FILE_MAX_SIZE = 2 * 1024 * 1024;
// @Relax
export default class ModalFinancial extends React.Component<any, any> {
  _store: Store;
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    // const { isFinancialVisible, pageRow,receivableList,forms } = this.props.relaxProps;
    const { _state } = this._store as any;
    const forms = _state.get('forms');
    const pageRow = _state.get('pageRow');
    const receivableList = _state.get('receivableList');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="财务审核：">
          {getFieldDecorator('type', {
            initialValue: forms.get('type'),
            onChange: (e) => this.onChangeForm('type', e.target.value)
          })(
            <Radio.Group>
              <Radio value={1}>通过</Radio>
              <Radio value={2}>不通过</Radio>
              <Radio value={3}>打款失败</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="用户账号：">
          {pageRow.get('customerWallet')?.get('customerAccount')} &nbsp; &nbsp;
        </FormItem>
        <FormItem {...formItemLayout} label="收款账户：">
          {pageRow.get('bankBranch')} &nbsp; &nbsp;
          {pageRow.get('bankName')} &nbsp; &nbsp; {pageRow.get('bankCode')}
        </FormItem>
        {/* {objForm.arrivalPrice}objForm.arrivalPrice */}
        <FormItem {...formItemLayout} label="提现金额：">
          {getFieldDecorator('arrivalPrice', {
            initialValue: forms.get('arrivalPrice'),
            onChange: (e) => this.onChangeForm('arrivalPrice', e.target.value)
          })(
            <div>
              {pageRow.get('applyPrice')} &nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 到账金额：
              <InputNumber
                value={forms.get('arrivalPrice')}
                disabled={true}
                min={0}
                max={Number(pageRow.get('applyPrice'))}
                style={{ width: '130px' }}
              />
            </div>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="转账账户">
          {getFieldDecorator('accountId', {
            //  rules: this.rulesBut('请选择转账账户'),
            initialValue: forms.get('accountId'),
            onChange: (value) => this.onChangeForm('accountId', value)
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择转账的对公账号"
              allowClear
            >
              {receivableList.toJS().map((item, i) => {
                return (
                  <Option key={i} value={String(item.accountId)}>
                    {item.accountName}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="打款凭证">
          {getFieldDecorator('images', {
            initialValue: forms.get('images')?.toJS() || [],
          })(
            <FormImg onChange={(value) => {
              this.onChangeForm('images', value);
            }} />
            // <QMUpload
            //   style={styles.box}
            //   name="uploadFile"
            //   fileList={forms.get('images')?.toJS() || []}
            //   action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
            //   listType="picture-card"
            //   accept={'.jpg,.jpeg,.png,.gif'}
            //   onChange={this._editImages}
            //   beforeUpload={this._checkUploadFile}
            // >
            //   {(forms.get('images')?.toJS() || []).length < 3 ? (
            //     <Icon type="plus" style={styles.plus} />
            //   ) : null}
            // </QMUpload>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="转账日期">
          {getFieldDecorator('transferDate', {
            initialValue: forms.get('transferDate'),
            onChange: (date, dateString) => {
              console.log(dateString);
              this.onChangeForm('transferDate', dateString);
            }
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择提现日期，不选则显示审核时间"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            initialValue: forms.get('remark'),
            onChange: (e) => this.onChangeForm('remark', e.target.value)
          })(<TextArea rows={4} maxLength={255} placeholder="最多155字" />)}
        </FormItem>
      </Form>
      // </Modal>
    );
  }

  rulesBut = (value: string, list = []) => {
    let forms = (this._store as any)._state.get('forms');
    if (forms.get('type') == 1) {
      return [{ required: true, whitespace: true, message: value }, ...list];
    } else {
      return [];
    }
  };

  onChangeForm = (key: string, value: any) => {
    let { onActorFiledChange, _state } = this._store as any;
    let obj = {};
    obj[key] = value;
    onActorFiledChange(
      'forms',
      fromJS({ ..._state.get('forms').toJS(), ...obj })
    );
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    // const store = this.props.relaxProps as any;
    // //删除图片
    // if (file.status == 'removed') {
    //   // store.editFormData(Map({ warePlayerImg: '' }));
    // this.onChangeForm('images',fileList);
    //   return;
    // }
    // fileList = fileList.filter((item) => item != null);
    // if (fileList[0].status == 'done') {
    //   // store.editFormData(Map({ warePlayerImg: fileList[0].response[0] }));
    // }
    this.onChangeForm('images', fileList);
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
  }
};
