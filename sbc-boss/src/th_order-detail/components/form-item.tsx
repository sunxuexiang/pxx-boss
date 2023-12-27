import React from 'react';
import { IMap, Relax } from 'plume2';
import { Modal,Alert,Form,Input,InputNumber  } from 'antd';
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
            {getFieldDecorator('refundPrice', {
                    initialValue: refundAuditForm.get('refundPrice'),
                    onChange:(e)=>{onRefundActorAuditChange('refundPrice',e)},
                    rules: [{required: true, message: '请输入退款金额'}]
                    })(
                    <InputNumber min={0}  style={{width:'140px'}} />
                )}
            </FormItem>
            {/* <FormItem  {...formItemLayout} label="退款鲸币：">
              {getFieldDecorator('gold', {
                    initialValue: refundAuditForm.get('gold'),
                    onChange:(e)=>{onRefundActorAuditChange('gold',e)},
                    rules: [{required: true, message: '请输入退款鲸币'}]
                    })(
                    <InputNumber min={0}  style={{width:'140px'}} />
                )}
            </FormItem> */}
        
            <FormItem {...formItemLayout}  label="退款原因：">
                {getFieldDecorator('refuseReason', {
                    initialValue: refundAuditForm.get('refuseReason'),
                    onChange:(e)=>{onRefundActorAuditChange('refuseReason',e.target.value)},
                    })(
                      <TextArea rows={4} />
                )}
            </FormItem>
      </Form>
    );
  }

}



