import React from 'react';
import { Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Modal, Alert, Form, Input, Radio } from 'antd';
import { ValidConst } from 'qmkit';
// import { IMap } from 'plume2/es5/typings';
import { fromJS } from 'immutable';
import { Store } from 'plume2';
// import { object } from 'prop-types';
const FormItem = Form.Item;
const { TextArea } = Input;

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

// @Relax
export default class ModalService extends React.Component<any, any> {
  _store: Store;
  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }
  // props: {
  //   form?:any,
  //   relaxProps?: {
  //     isServiceVisible: boolean;
  //     pageRow: any;
  //     serviceVisibleBut: Function;
  //     onActorFiledChange:Function;
  //     forms:IMap;
  //   };
  // };

  // static relaxProps = {
  //   isServiceVisible: 'isServiceVisible',
  //   pageRow: 'pageRow',
  //   forms:'forms',
  //   serviceVisibleBut: noop,
  //   onActorFiledChange:noop,
  // };

  render() {
    const { _state } = this._store as any;
    const forms = _state.get('forms');
    const pageRow = _state.get('pageRow');

    console.log(forms.toJS(), 'forms');
    const { getFieldDecorator } = this.props.form;
    return (
      // <Modal
      //   title="客服审核"
      //   visible={isServiceVisible}
      //   onOk={this.confirm}
      //   onCancel={this.hideModal}
      //   okText="确认"
      //   cancelText="取消"
      // >
      //   <Alert
      //       message=""
      //       description={
      //       <div>
      //           <p>
      //               请先确认用户提现金额和用户收款账户。
      //           </p>
      //           <p>
      //               点击保存后，流程将流转至财务确认金额打款至客户账户。
      //           </p>
      //           <p>
      //               如果不通过审核或者有特殊原因请进行备注。
      //           </p>
      //       </div>
      //       }
      //       type="info"
      //   />
      //   <div style={{marginBottom:'20px'}}></div>
      <Form>
        <FormItem {...formItemLayout} label="客服审核：">
          {getFieldDecorator('type', {
            initialValue: forms.get('type'),
            onChange: (e) => this.onChangeForm('type', e.target.value)
          })(
            <Radio.Group>
              <Radio value={1}>通过</Radio>
              <Radio value={2}>不通过</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="用户信息：">
          {pageRow.get('accountType') === 1 && (
            <React.Fragment>
              联系人：{pageRow.get('customerName')}{' '}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 联系电话：
              {pageRow.get('customerPhone')}
            </React.Fragment>
          )}
          {pageRow.get('accountType') === 0 && (
            <React.Fragment>
              用户账号：{pageRow.getIn(['customerWallet', 'customerName'])}{' '}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 联系电话：
              {pageRow.getIn(['customerWallet', 'contactPhone'])}
            </React.Fragment>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="提现金额：">
          {pageRow.get('applyPrice')}
        </FormItem>
        <FormItem {...formItemLayout} label="账号名称：">
          {getFieldDecorator('bankBranch', {
            rules: this.rulesBut('请输入账号名称'),
            initialValue: forms.get('bankBranch'),
            onChange: (e) => this.onChangeForm('bankBranch', e.target.value)
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="银行卡号：">
          {getFieldDecorator('bankCode', {
            rules: this.rulesBut('请输入银行卡号', [
              {
                pattern: ValidConst.bankNumber,
                message: '请输入正确的银行卡号'
              }
            ]),
            initialValue: forms.get('bankCode'),
            onChange: (e) => this.onChangeForm('bankCode', e.target.value)
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="开户行：">
          {getFieldDecorator('bankName', {
            rules: this.rulesBut('请输入开户行'),
            initialValue: forms.get('bankName'),
            onChange: (e) => this.onChangeForm('bankName', e.target.value)
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注：">
          {getFieldDecorator('backRemark', {
            initialValue: forms.get('backRemark'),
            onChange: (e) => this.onChangeForm('backRemark', e.target.value)
          })(<TextArea rows={4} maxLength={100} placeholder="最多100字" />)}
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

  // confirm = (eve) => {
  //   const {onActorFiledChange,serviceVisibleBut}=this.props.relaxProps;
  //   this.props.form.validateFieldsAndScroll(null,(err, values) => {
  //     if (!err) {
  //       serviceVisibleBut()
  //     }
  //   });
  // };

  // hideModal = (eve) => {
  //   this.props.relaxProps.onActorFiledChange('isServiceVisible',false);
  // };
}
