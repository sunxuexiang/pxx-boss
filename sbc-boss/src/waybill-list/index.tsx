import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Table, message, Button } from 'antd';
import { AuthWrapper, Headline, BreadCrumb, history } from 'qmkit';
import { exportFile, getPage, getPageDetail } from './webapi';

import SearchHead from './component/search-head';

const { TabPane } = Tabs;

const WaybillList = (props) => {
  const formRef = useRef(null);
  const [activeKey, setKey] = useState('1');
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pagination, setPage] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // Tab变化
  const tabChange = (key) => {
    setKey(key);
    pageChange(1, key);
  };
  // 页码change
  const pageChange = async (page = 1, key?) => {
    const status = key || activeKey;
    const values = formRef.current.form.getFieldsValue();
    const parmas = {
      ...values,
      pageNum: page,
      pageSize: pagination.pageSize
    };
    if (status !== '1') {
      parmas.status = Number(status);
    }
    const { res } = await getPage(parmas);
    console.log(res);
    if (res && res.code === 200) {
      setList(res.data?.records || []);
      setPage({
        current: page,
        pageSize: 10,
        total: res.data?.total || 0
      });
    } else {
      message.error(res.msg);
    }
  };

  const handlerExportFile = async () => {
    try {
      const resp = await exportFile();
      const respBlob = await resp.blob();
      const blob = new Blob([respBlob], {
        type: 'application/vnd.ms-excel'
      });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = '运单列表.xls';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {}
  };

  useEffect(() => {
    const page = props?.location?.state?.page || 1;
    pageChange(page);
  }, []);

  const showDetail = async (record) => {
    try {
      setLoading(true);
      const { res } = await getPageDetail(record.id);
      setLoading(false);
      if (res.code == 200) {
        const data = res.data;
        history.push({
          pathname: '/waybill-detail',
          state: {
            data: data,
            page: pagination.current
          }
        });
      } else {
        message.error(res.msg || '获取运单详情失败');
      }
    } catch (error) {
      message.error('获取信息失败');
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: '运单号',
      dataIndex: 'id'
    },
    {
      title: '承运商名称',
      dataIndex: 'senderName'
    },
    {
      title: '销售单号',
      dataIndex: 'tradeOrderId'
    },
    {
      title: '所属商家',
      dataIndex: 'storeName'
    },
    {
      title: '发件人名称',
      dataIndex: 'senderName'
    },
    {
      title: '运费(元)',
      dataIndex: 'amount'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    },
    {
      title: '发货时间',
      dataIndex: 'tradeTime'
    },
    {
      title: '接货点',
      dataIndex: 'shipmentSiteName'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <AuthWrapper functionName={'f_waybill_detail'}>
          <Button type="link" onClick={() => showDetail(record)}>
            详情
          </Button>
        </AuthWrapper>
      )
    }
  ];
  return (
    <AuthWrapper functionName={'f_waybill_list'}>
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />

        <div className="container">
          {/* 头部标题 */}
          <Headline title="运单列表" />

          <SearchHead
            wrappedComponentRef={formRef}
            pageChange={pageChange}
            handlerExprotFile={handlerExportFile}
          />

          <Tabs activeKey={activeKey} onChange={tabChange}>
            <TabPane tab="全部" key="1" />
            <TabPane tab="待商家送货" key="20" />
            <TabPane tab="待揽收" key="30" />
            <TabPane tab="已揽件" key="31" />
            <TabPane tab="待签收" key="40" />
            <TabPane tab="已完成" key="50" />
            <TabPane tab="已作废" key="60" />
          </Tabs>

          <Table
            loading={isLoading}
            dataSource={list}
            columns={columns}
            pagination={{
              ...pagination,
              onChange: (page) => pageChange(page)
            }}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default WaybillList;
