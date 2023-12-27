import React, { useState, useEffect } from 'react';
import { Form, message, Button } from 'antd';
import { RichText, Const } from 'qmkit';
import { fetchText, saveText } from '../webapi';

const Copywriting = (props) => {
  const { form } = props;
  const { getFieldDecorator } = form;
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  // 获取文案数据
  const getText = async () => {
    const { res } = await fetchText();
    if (res && res.code === Const.SUCCESS_CODE) {
      setInfo(res.context?.homeDeliveryVOList[0] || null);
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getText();
  }, []);
  // 保存文案
  const save = () => {
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const parmas = {
          homeDeliveryId:
            info && info.homeDeliveryId ? info.homeDeliveryId : '',
          deliveryToStoreContent: values.content
        };
        setLoading(true);
        const { res } = await saveText(parmas);
        setLoading(false);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('保存成功');
        } else {
          message.error(res?.message || '');
        }
      }
    });
  };
  return (
    <div>
      <Form>
        <Form.Item style={{ marginBottom: 15 }} label="配送到店">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入配送到店内容' }]
          })(
            <RichText
              defaultContent={info ? info.deliveryToStoreContent || '' : ''}
              contentChange={(data) => {
                props.form.setFieldsValue({ content: data });
              }}
            />
          )}
        </Form.Item>
      </Form>
      <div className="dts-footer">
        <Button type="primary" loading={loading} onClick={save}>
          保存
        </Button>
      </div>
    </div>
  );
};

const CopywritingForm = Form.create()(Copywriting);
export default CopywritingForm;
