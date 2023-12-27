import React, { useState, useEffect } from 'react';
import {
  Const,
  BreadCrumb,
  Headline,
  AuthWrapper,
  FindArea,
  history
} from 'qmkit';
import { Input, Button, Table, message } from 'antd';
import { getMarketData } from './webapi';

const LogisticsCompanySetting = () => {
  // 表头数据
  const columns = [
    {
      title: '批发市场名称',
      align: 'center' as 'center',
      dataIndex: 'marketName',
      key: 'marketName'
    },
    {
      title: '所在城市',
      align: 'center' as 'center',
      dataIndex: 'city',
      key: 'city',
      render: (text, record) => {
        const { provinceId, cityId } = record;
        const province = FindArea.findProviceName(provinceId);
        const city = FindArea.findCity(cityId);
        return `${province}/${city}`;
      }
    },
    {
      title: '状态',
      align: 'center' as 'center',
      dataIndex: 'openStatus',
      key: 'openStatus',
      render: (openStatus) => {
        return openStatus === 1 ? '启用' : '停用';
      }
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() =>
              history.push({
                pathname: '/logistics-company',
                state: { marketId: record.marketId }
              })
            }
          >
            管理物流公司
          </Button>
        );
      }
    }
  ];
  const [marketName, setMarketName] = useState('');
  // 批发市场表格数据
  const [wholesaleData, setWholesaleData] = useState([]);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 总数
  const [tableTotal, setTableTotal] = useState(0);
  // 表格加载loading
  const [tableLoading, setTableLoading] = useState(false);

  // 初始化列表
  useEffect(() => {
    getWholesaleTableData();
  }, [pageParams]);
  // 获取批发市场数据
  const getWholesaleTableData = () => {
    // 开启loading
    setTableLoading(true);
    getMarketData({ ...pageParams, marketName })
      .then((data) => {
        setTableLoading(false);
        if (data.res && data.res.code === Const.SUCCESS_CODE) {
          setTableTotal(data.res.context.totalElements);
          // 存入数据
          setWholesaleData(data.res.context.content);
        } else {
          message.error(data.res?.message || '');
        }
      })
      .catch((err) => {
        // 获取出错
        setTableLoading(false);
        console.warn(err);
      });
  };
  // 翻页
  const init = (pageNum = pageParams.pageNum) => {
    changePage({ ...pageParams, pageNum });
    console.warn(pageParams);
  };
  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="物流公司设置" />
        <AuthWrapper functionName={'f_logistics_company_setting'}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Input
                addonBefore="批发市场名称"
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                style={{ width: 320 }}
              />
              <Button
                type="primary"
                style={{ marginLeft: '16px' }}
                onClick={() => init(0)}
              >
                搜索
              </Button>
            </div>
            <Table
              loading={tableLoading}
              rowKey={(record: any) => record.marketId}
              columns={columns}
              dataSource={wholesaleData}
              pagination={{
                current: pageParams.pageNum + 1,
                pageSize: pageParams.pageSize,
                total: tableTotal,
                onChange: (pageNum) => {
                  init(pageNum - 1);
                }
              }}
            />
          </div>
        </AuthWrapper>
      </div>
    </div>
  );
};

export default LogisticsCompanySetting;
