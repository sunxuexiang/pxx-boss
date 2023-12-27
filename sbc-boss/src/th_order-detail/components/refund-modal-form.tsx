import React from 'react';
import { IMap, Relax } from 'plume2';
import { Modal,Alert,Form  } from 'antd';
import { noop } from 'qmkit';
import refundFormItem from './form-item';
const RefundForm =  Form.create()(refundFormItem);

@Relax
export default class refundModalForm extends React.Component<any, any> {
  _form;
  props: {
    relaxProps?: {
      onRefundAuditConfirm: Function;
      refundVisible: boolean;
      refundAuditForm:IMap;
      setReturnVisible:Function;
    };
  };

  static relaxProps = {
    onRefundAuditConfirm: noop,
    refundVisible: 'refundVisible',
    refundAuditForm:'refundAuditForm',
    setReturnVisible:noop,
  };

  render() {
    const {refundVisible,refundAuditForm,onRefundAuditConfirm,setReturnVisible}=this.props.relaxProps;
    // const refundForm= Form.create()(<refundFormItem  />as any)
    // const refundForm = this.refundForme;
   
    return (
      <div>
          <Modal title="退款" visible={refundVisible} onOk={()=>onRefundAuditConfirm()}
          onCancel={()=>setReturnVisible({})}
        >
          <Alert style={{marginBottom: 10}}  message='退款金额不能大于该笔订单的剩余可退金额，订单剩余可退金额=订单实付总金额-已退金额（含退单中的需退款金额）'  type="info"  />
          <RefundForm ref={(form) => (this._form = form)} />
        </Modal>  
      </div>
    );
  }


}



