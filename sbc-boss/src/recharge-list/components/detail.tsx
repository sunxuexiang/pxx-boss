import React, { FC, useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { getApplyDetail } from '../webApi';
import { Const } from 'qmkit';
import moment from 'moment';
const FormItem = Form.Item;
const Detail: FC<any> = (props) => {
  const { item } = props;
  const [data, setData] = useState({} as any);

  useEffect(() => {
    if (item.recordNo) {
      getApplyDetail({ orderNo: item.recordNo }).then(({ res }: any) => {
        if (res.code === Const.SUCCESS_CODE) {
          setData(res.context.customerWalletStoreIdVO);
        } else {
          message.error(res.message);
        }
      });
    }
  }, [item.recordNo]);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <FormItem label="商家编号">{data?.supplierCode}</FormItem>
      <FormItem label="商家账号">{data?.supplierAccount}</FormItem>
      <FormItem label="商家名称">{data?.supplierName}</FormItem>
      <FormItem label="店铺名称">{data?.storeName}</FormItem>
      <FormItem label="充值金额">{data?.rechargeBalance}</FormItem>
      <FormItem label="充值时间">
        {data?.applyTime
          ? moment(data?.applyTime).format('YYYY-MM-DD HH:mm:ss')
          : ''}
      </FormItem>
      <FormItem label="付款方式">{data?.payType}</FormItem>
      <FormItem label="支付单号">{data?.payOrderNo}</FormItem>
      <FormItem label="收款流水号">{data?.collectionNumber}</FormItem>
    </Form>
  );
};

export default Detail;
