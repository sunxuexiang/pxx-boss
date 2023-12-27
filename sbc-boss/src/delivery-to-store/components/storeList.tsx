import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { RichText, Const } from 'qmkit';
import { fetchStore } from '../webapi';

export default function StoreList(props) {
  // 列表数据
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  //获取列表数据
  const getList = async () => {
    setLoading(true);
    const { res } = await fetchStore();
    setLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      const newList = [];
      if (res.context) {
        res.context.forEach((item) => {
          if (item.storeId !== -1) {
            newList.push(item);
          }
        });
      }
      setList(newList);
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getList();
  }, []);

  const columns = [
    {
      title: '商家名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      align: 'center' as 'center'
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      key: 'storeName',
      align: 'center' as 'center'
    }
  ];
  return (
    <Table
      pagination={false}
      rowKey="storeId"
      loading={loading}
      columns={columns}
      dataSource={list}
      bordered
    />
  );
}
