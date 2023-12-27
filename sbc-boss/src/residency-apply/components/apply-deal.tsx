import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { editApply } from '../webapi';
import PropTypes from 'prop-types';
const { TextArea } = Input;

const ApplyDeal = (props) => {
  const [confirmLoading, setLoading] = useState(false);
  useEffect(() => {
    console.warn(props.dealInfo);
  }, []);
  // 确认处理
  const confirmDeal = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const { applicationId } = props.dealInfo;
        const params = { ...value, applicationId };
        setLoading(true);
        editApply(params)
          .then((res) => {
            setLoading(false);
            message.success('处理成功');
            props.hideDeal();
          })
          .catch((err) => {
            setLoading(false);
            message.error('处理失败');
          });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      title="处理申请"
      width={500}
      visible={props.show}
      onOk={confirmDeal}
      confirmLoading={confirmLoading}
      onCancel={() => {
        props.hideDeal();
      }}
    >
      <Form
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 20
        }}
        autoComplete="off"
      >
        <Form.Item label="备注">
          {getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入备注' }],
            initialValue: ''
          })(<TextArea rows={4} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
ApplyDeal.defaultProps = {
  dealInfo: {},
  show: false,
  hideDeal: () => {}
};
ApplyDeal.propTypes = {
  dealInfo: PropTypes.object,
  show: PropTypes.bool,
  hideDeal: PropTypes.func
};
const ApplyDealTemplate = Form.create()(ApplyDeal);

export default ApplyDealTemplate;
