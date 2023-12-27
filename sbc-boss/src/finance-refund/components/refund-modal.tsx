import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import EditForm from './edit-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import MergeBill from './merge-bill';
const WrapperForm = Form.create()(EditForm as any);

@Relax
export default class RefundModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onCancel: Function;
      onSave: Function;
      mergFlag:boolean;
    };
  };

  static relaxProps = {
    visible: 'visible',
    customerLevel: 'customerLevel',
    onCancel: noop,
    onSave: noop,
    mergFlag:'mergFlag'
  };

  render() {
    const { onCancel, visible,mergFlag } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="添加退款记录"
        visible={visible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        {mergFlag?<MergeBill />:null}
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSave(values);
      }
    });
  };
}
