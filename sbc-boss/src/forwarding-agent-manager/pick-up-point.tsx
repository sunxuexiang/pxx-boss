// 查询所有自提点

import { Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPickupList } from './webapi';
import { BreadCrumb, Headline } from 'qmkit';

export default function WatcherAllPickUpPoint(props) {
  const { record } = props.location.state;

  const [dataSource, setDataSource] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    _loadTableData();
  }, []);

  const _loadTableData = async () => {
    try {
      setIsLoading(true);
      const { res } = (await getPickupList({
        siteOwnerId: record.id,
        siteType: 0
      })) as any;
      setDataSource(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: '自提点名称',
      dataIndex: 'siteName',
      key: 'siteName'
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson'
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone'
    },
    {
      title: '所在市区街道',
      dataIndex: 'provinceName',
      key: 'provinceName',
      render: (text, record) => {
        return `${text}${record.cityName}${record.districtName}${record.street}`;
      }
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address'
    }
  ];

  return (
    <div>
      {/* 面包屑导航 */}
      <BreadCrumb />
      <div className="container">
        {/* 头部标题 */}
        <Headline title="自提点" />
        <Row>
          <Table
            bordered
            loading={isLoading}
            pagination={false}
            dataSource={dataSource}
            columns={columns}
          />
        </Row>
      </div>
    </div>
  );
}
