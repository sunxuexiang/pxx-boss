import { Button, Row, Table, message } from 'antd';
import { BreadCrumb, Headline, history } from 'qmkit';
import React, { useEffect, useState } from 'react';
import { editCarrierStatus, getCarrierList } from './webapi';

export default function ForwardingAgentManager() {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: '承运商编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '商家账号',
      dataIndex: 'carrierAccount',
      key: 'carrierAccount'
    },
    {
      title: '承运商名称',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 120
    },
    {
      title: '所在地区',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => {
        return `${record.provinceName}${record.cityName}${record.districtName}${record.street}${text}`;
      },
      width: 170
    },
    {
      title: '签约时间',
      dataIndex: 'contractBeginTime',
      key: 'contractBeginTime'
    },
    {
      title: '到期时间',
      dataIndex: 'contractEndTime',
      key: 'contractEndTime'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, _record) => {
        return text == 1 ? '启用' : '停用';
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_text, record) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                _opera(0, record);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => {
                _opera(1, record);
              }}
            >
              运费模版
            </Button>
            <Button
              type="link"
              onClick={() => {
                _opera(2, record);
              }}
            >
              自提点
            </Button>
            <Button
              type="link"
              onClick={() => {
                _opera(3, record);
              }}
            >
              {record.status == 0 ? '启用' : '停用'}
            </Button>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    _loadCarrierList();
  }, []);

  const param = {
    pageNum: 1,
    pageSize: 10
  };
  const [total, setTotal] = useState(0);

  const _onChangeLoadData = (pageNum, pageSize) => {
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    _loadCarrierList();
  };

  const _loadCarrierList = async () => {
    try {
      const { res } = (await getCarrierList(param)) as any;
      const {
        data: { records, total }
      } = res;
      setTotal(total);
      setDataSource(
        records.map((item) => {
          item.key = item.id;
          return item;
        })
      );
    } catch (error) {}
  };

  /**
   * 操作
   * @param index 索引
   */
  const _opera = (index, record) => {
    const opFuncs = [
      async () => {
        history.push({
          pathname: '/forwarding-agent-manager-add',
          state: {
            record
          }
        });
      },
      async () => {
        history.push({
          pathname: '/forwarding-agent-manager-freight-template',
          state: {
            record
          }
        });
      },
      async () => {
        history.push({
          pathname: '/forwarding-agent-manager-point',
          state: {
            record
          }
        });
      },
      async () => {
        try {
          const { res } = await editCarrierStatus({
            id: record.id,
            status: record.status == 1 ? 0 : 1
          });
          if ((res.code as any) == 200) {
            message.success('操作成功');
            _loadCarrierList();
          } else {
            // @ts-ignore
            message.error(res.message || res.msg || '操作失败');
          }
        } catch (error) {
          message.error('操作失败');
        }
      }
    ];
    opFuncs[index]();
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <BreadCrumb />
      <div className="container">
        {/* 头部标题 */}
        <Headline title="承运商列表" />
        <Row>
          <Button
            type="primary"
            onClick={() => {
              history.push('/forwarding-agent-manager-add');
            }}
          >
            新增承运商
          </Button>
          <Table
            dataSource={dataSource}
            pagination={{
              pageSize: param.pageSize,
              total: total,
              onChange: _onChangeLoadData
            }}
            columns={columns}
          />
        </Row>
      </div>
    </div>
  );
}
