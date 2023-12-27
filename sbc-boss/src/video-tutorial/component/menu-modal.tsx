import React from 'react';
import { Modal, Form, Input } from 'antd';

const MenuModal = (props) => {
  const { form, visible, close, addVideoMenu, type } = props;
  const { getFieldDecorator } = form;
  const handleOk = () => {
    form.validateFields((errs, values) => {
      if (!errs) {
        addVideoMenu(values);
      }
    });
  };
  return (
    <Modal
      visible={visible}
      centered
      destroyOnClose
      onCancel={close}
      onOk={handleOk}
      title={type === 0 ? '新增一级分类' : '新增子分类'}
    >
      <Form layout="inline">
        <Form.Item label="新分类名称">
          {getFieldDecorator('cateName', {
            rules: [{ required: true, message: '请填写新分类名称' }]
          })(<Input style={{ width: 350 }} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const MenuModalForm = Form.create<any>()(MenuModal);

export default MenuModalForm;
