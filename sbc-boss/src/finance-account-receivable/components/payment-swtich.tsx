import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, message, Switch, Row, Col } from 'antd';
import { Const } from 'qmkit';
import { getAppPaySwitch, updateAppPaySwitch } from '../webapi';

const PaymentSwtich = (props: any) => {
  const [paymentStatusData, setInfo] = useState([] as any);
  const [paymentName] = useState({
    alipay: '支付宝',
    wechatPay: '微信支付',
    friendPay: '好友代付',
    publicPay: '对公支付'
  });
  const { getFieldDecorator } = props.form;
  // 初始化
  useEffect(() => {
    if (props.showSwtich) {
      getAllSwtich();
    }
  }, [props.showSwtich]);
  // 获取开关状态
  const getAllSwtich = () => {
    getAppPaySwitch().then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('查询失败');
        return;
      }
      setInfo(data.res.context);
    });
  };
  // 更改状态
  const changeStatus = (checked, platform, data) => {
    console.warn(checked, platform, data.payType);
    const idx = paymentStatusData.findIndex((item) => {
      return item.payType === data.payType;
    });
    if (idx !== -1) {
      const list = [...paymentStatusData];
      list[idx][platform] = data[platform] === 0 ? 1 : 0;
      setInfo([...list]);
    }
  };
  // 确认变更
  const changeConfirm = () => {
    updateAppPaySwitch(paymentStatusData).then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('修改失败');
        return;
      }
      message.success('修改成功');
      props.hideModal();
      setInfo([]);
    });
  };

  return (
    <Modal
      title="支付开关"
      visible={props.showSwtich}
      onOk={changeConfirm}
      onCancel={() => {
        props.form.resetFields();
        setInfo([]);
        props.hideModal();
      }}
      width={600}
    >
      <Form
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 18
        }}
        autoComplete="off"
      >
        {paymentStatusData.map((item) => {
          return (
            <Form.Item label={paymentName[item.payType]} key={item.payType}>
              <Row>
                <Col span={12}>
                  安卓：
                  <Switch
                    checked={item.androidStatus === 1}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    onChange={(checked) => {
                      changeStatus(checked, 'androidStatus', item);
                    }}
                  />
                </Col>
                <Col span={12}>
                  IOS：
                  <Switch
                    checked={item.iosStatus === 1}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    onChange={(checked) => {
                      changeStatus(checked, 'iosStatus', item);
                    }}
                  />
                </Col>
              </Row>
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};
const PaymentSwtichTemplate = Form.create()(PaymentSwtich);

export default PaymentSwtichTemplate;
