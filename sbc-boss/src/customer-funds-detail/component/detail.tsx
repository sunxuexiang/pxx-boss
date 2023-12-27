import React, { FC, useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { getRecordDetail } from '../webapi';
import { Const } from 'qmkit';
const FormItem = Form.Item;
const Detail: FC<any> = (props) => {
  const { item } = props;
  const [data, setData] = useState({} as any);

  useEffect(() => {
    getRecordDetail(item.relationOrderId).then(({ res }: any) => {
      if (res.code === Const.SUCCESS_CODE) {
        setData(res.context);
      } else {
        message.error(res.message);
      }
    });
  }, []);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <FormItem label="用户账号">{data?.customerAccount}</FormItem>
      <FormItem label="赠送金额">{data?.coinNum}</FormItem>
      <FormItem label={data.recordType === 1 ? '订单号' : '退单号'}>
        {data?.orderNo}
      </FormItem>
      <FormItem label="推送金蝶单号">{data?.sendNo}</FormItem>
    </Form>
  );
};

export default Detail;
