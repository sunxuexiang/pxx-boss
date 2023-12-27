import React, { FC, useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { getApplyDetail } from '../webapi';
import { Const } from 'qmkit';
const FormItem = Form.Item;
const ApplyDetail: FC<any> = (props) => {
  const { item } = props;
  const [data, setData] = useState({} as any);

  useEffect(() => {
    getApplyDetail(item.relationOrderId).then(({ res }: any) => {
      if (res.code === Const.SUCCESS_CODE) {
        setData(res.context);
      } else {
        message.error(res.message);
      }
    });
  }, [item.relationOrderId]);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <FormItem label="用户账号">{data?.customerAccount}</FormItem>
      <FormItem label="充值人">{data?.operatorName}</FormItem>
      <FormItem label="充值金额">{data?.rechargeBalance}</FormItem>
      <FormItem label="订单号">{data?.orderNo}</FormItem>
      <FormItem label="退单号">{data?.returnOrderNo}</FormItem>
      <FormItem label="备注">{data?.remark}</FormItem>
    </Form>
  );
};

export default ApplyDetail;
