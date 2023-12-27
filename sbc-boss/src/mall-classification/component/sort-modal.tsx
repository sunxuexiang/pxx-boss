import React from 'react';
import { Modal, Form, message, InputNumber } from 'antd';
import { Const } from 'qmkit';
import { editAssignSort } from '../webapi';

const SortModal = (props) => {
  const { sortData, hideSort, form, showSort } = props;
  // 确认排序
  const confirmSort = () => {
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const params = {
          storeId: sortData.storeId,
          assignSort: value.sort
        } as any;
        editAssignSort(params).then((data) => {
          if (data.res.code !== Const.SUCCESS_CODE) {
            message.error(data.res.message || '修改失败');
            return;
          }
          message.success('修改成功');
          hideSort(true);
        });
      }
    });
  };
  const { getFieldDecorator } = form;
  return (
    <Modal
      title="修改指定排序"
      width={400}
      visible={showSort}
      onOk={confirmSort}
      //   confirmLoading={confirmLoading}
      onCancel={() => {
        hideSort();
      }}
      destroyOnClose
    >
      <Form
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
        autoComplete="off"
      >
        <Form.Item style={{ marginBottom: 15 }} label="指定排序">
          {getFieldDecorator('sort', {
            rules: [{ required: true, message: '请输入排序序号' }],
            initialValue: sortData.assignSort || ''
          })(
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入排序序号"
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SortModalTemplate = Form.create<any>()(SortModal);
export default SortModalTemplate;
