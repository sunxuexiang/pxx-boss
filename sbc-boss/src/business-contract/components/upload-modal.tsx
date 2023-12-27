import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Row,
  Select,
  Upload,
  Icon,
  Button,
  message
} from 'antd';
import { Const } from 'qmkit';
import { uploadContractInfo } from '../webapi';
import * as _ from 'lodash';

const { Option } = Select;

const UploadModal = (props) => {
  const { form, visible, closeModal, pageChange, currentRow } = props;
  const { getFieldDecorator, getFieldValue, resetFields, validateFields } =
    form;
  const [fileList, setFileList] = useState([]);

  // 每次打开时 初始化
  useEffect(() => {
    if (visible) {
      setFileList([]);
    }
  }, [visible]);

  const onCancel = () => {
    resetFields();
    closeModal();
  };

  const onOk = async () => {
    if (fileList && fileList.length > 0) {
      validateFields(async (errs, values) => {
        if (!errs) {
          const parmas = {
            userContractId: currentRow.userContractId,
            employeeId: currentRow.employeeId,
            supplierName: values.supplierName
          } as any;
          if (values.fileType === 1) {
            if (fileList[0].status === 'done') {
              parmas.contractUrl = fileList[0].response[0];
            } else {
              message.error('请上传文件');
              return;
            }
          } else {
            const imgUrl = [];
            fileList.forEach((item) => {
              if (item.status === 'done') {
                imgUrl.push(item.response[0]);
              }
            });
            if (imgUrl.length > 0) {
              parmas.imgUrl = imgUrl.join(',');
            } else {
              message.error('请上传文件');
              return;
            }
          }
          const { res } = await uploadContractInfo(parmas);
          if (res && res.code === Const.SUCCESS_CODE) {
            message.success('操作成功');
            pageChange({ type: 'waitList', current: 1 });
            onCancel();
          } else {
            message.error(res.message || '');
          }
        }
      });
    } else {
      message.error('请上传文件');
    }
  };

  const uploadProps = {
    name: 'uploadFile',
    headers: {
      Accept: 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    action: Const.HOST + '/uploadResource?resourceType=IMAGE',
    accept: getFieldValue('fileType') === 1 ? '.pdf, .PDF' : '.jpg,.jpeg,.png',
    onChange: (info) => {
      let fileList = _.cloneDeep(info.fileList);
      console.log(fileList, 'fileList');
      setFileList(fileList);
    }
  };
  return (
    <Modal
      width={600}
      title="上传签约文件"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Form layout="inline">
        <Row style={styles.formRow}>
          <Form.Item label="商家名称">
            {getFieldDecorator('supplierName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入正确的商家名称' }]
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
          <div style={styles.mainColor}>
            填写提醒： 请填写与合同上一致的商家名称
          </div>
        </Row>
        <Row style={styles.formRow}>
          <Form.Item label="文件类型">
            {getFieldDecorator('fileType', {
              initialValue: 2,
              rules: [{ required: true, message: '请选择文件类型' }]
            })(
              <Select style={{ width: 200 }} placeholder="请选择文件类型">
                <Option value={1}>pdf文件</Option>
                <Option value={2}>图片</Option>
              </Select>
            )}
          </Form.Item>
        </Row>
        <Row style={styles.formRow}>
          <Form.Item required label="签约文件">
            <Upload
              {...uploadProps}
              fileList={fileList}
              listType={
                getFieldValue('fileType') === 1 ? 'text' : 'picture-card'
              }
            >
              {getFieldValue('fileType') === 1 && (
                <Button type="primary">点击上传文件</Button>
              )}
              {getFieldValue('fileType') === 2 && <Icon type="plus" />}
            </Upload>
          </Form.Item>
          <div style={styles.mainColor}>
            填写提醒： 支持上传文档和图片（2选1）
          </div>
        </Row>
      </Form>
    </Modal>
  );
};

const UploadModalForm = Form.create<any>()(UploadModal);
export default UploadModalForm;

const styles = {
  formRow: {
    marginBottom: '16px'
  },
  mainColor: {
    color: '#F56C1D'
  }
};
