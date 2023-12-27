import React, { useState, useEffect } from 'react';
import { Modal, Table, message, Input, Button } from 'antd';
import { Const, DragTable } from 'qmkit';
import { getMarketMerchant } from '../webapi';

const MerchantListModal = (props) => {
  // 弹窗表头
  const merchantCol = [
    {
      title: '编号',
      width: 70,
      align: 'center' as 'center',
      dataIndex: 'companyCode',
      key: 'companyCode',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '商家名称',
      align: 'center' as 'center',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '店铺名称',
      width: 220,
      align: 'center' as 'center',
      dataIndex: 'storeName',
      key: 'storeName'
    }
  ];
  // 新增弹窗显示
  const [showMerchantAdd, setMerchantAddShow] = useState(false);
  // 新增按钮loading
  // const [confirmLoading, setLoading] = useState(false);
  const [merchantData, setMerchantData] = useState([]);
  const [loading, setLoading] = useState(false);
  // 弹窗初始化
  useEffect(() => {
    if (props.showAdd) {
      setMerchantAddShow(true);
      getBusinessData();
    } else {
      setMerchantAddShow(false);
    }
  }, [props.showAdd]);
  // 获取商家数据
  const getBusinessData = () => {
    setLoading(true);
    const params = {
      marketId: props.currentMarketData.marketId
    };
    getMarketMerchant(params).then((data) => {
      console.warn(data, '商家数据');
      setLoading(false);
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('查询商家失败');
        return;
      }
      setMerchantData(data.res.context);
    });
  };
  return (
    <Modal
      title="批发市场商家"
      width={700}
      visible={showMerchantAdd}
      onCancel={() => {
        props.hideModal();
      }}
      footer={false}
    >
      <Table
        loading={loading}
        rowKey={(record: any) => record.storeId}
        columns={merchantCol}
        dataSource={merchantData}
        pagination={false}
        scroll={{ y: 600 }}
      />
    </Modal>
  );
};
export default MerchantListModal;
