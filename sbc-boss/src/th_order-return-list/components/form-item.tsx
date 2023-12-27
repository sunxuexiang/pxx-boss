import React from 'react';
import { IMap, Relax } from 'plume2';
import { Modal,Alert,Form,Input,DatePicker  } from 'antd';
import { noop } from 'qmkit';
const { TextArea } = Input;
const FormItem=Form.Item;
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

@Relax
export default class refundFormItem extends React.Component<any, any> {
    props: {
        form?:any;
        relaxProps?: {
            refundAuditForm:IMap;
            onRefundActorChange:Function;
            onRefundActorAuditChange:Function;
        };  
    };

  static relaxProps = {
    refundAuditForm:'refundAuditForm',
    onRefundActorAuditChange:noop,
    onRefundActorChange:noop,
  };

  render() {
    const {refundAuditForm,onRefundActorAuditChange}=this.props.relaxProps;
    const {getFieldDecorator}=this.props.form;
    return (
        <Form>
            <FormItem  {...formItemLayout} label="退款金额：">
              {refundAuditForm.get('actualReturnPrice')}
            </FormItem>
            <FormItem {...formItemLayout} label="退款鲸币：">
                {refundAuditForm.get('balancePrice')}
            </FormItem>
            <FormItem {...formItemLayout}  label="日期：">
                {getFieldDecorator('createTime', {
                    initialValue: refundAuditForm.get('createTime'),
                    onChange:(e,t)=>{onRefundActorAuditChange('createTime',t)},
                    })(
                    <DatePicker format={'YYYY-MM-DD HH:mm'} showTime={{ format: 'HH:mm' }} placeholder="选择日期"  />
                )}
            </FormItem>
            <FormItem {...formItemLayout}  label="备注：">
                {getFieldDecorator('refundComment', {
                    initialValue: refundAuditForm.get('refundComment'),
                    onChange:(e)=>{onRefundActorAuditChange('refundComment',e.target.value)},
                    })(
                      <TextArea rows={4} />
                )}
            </FormItem>
      </Form>
    );
  }

}



