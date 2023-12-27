import React, { FC, useRef, useState, useEffect } from 'react';
import { Headline, BreadCrumb, Const } from 'qmkit';
import { message, Table, Modal, Row, Col } from 'antd';
import QueryBar from './components/queryBar';
import { logPage, findUpdateRecordByUserNo } from './webapi';

const AppMonitor: FC<any> = () => {
  const [tableData, setTableData] = useState([] as any);
  const [page, setPage] = useState({ pageNum: 1, pageSize: 10 } as any);
  const [total, setTotal] = useState(0 as number);
  const [versionVisible, setVersionVisible] = useState(false as boolean);
  const [record, setRecord] = useState({} as any);
  const querybarRef = useRef(null);
  const phoneType = [
    {
      value: 1,
      name: 'Android'
    },
    {
      value: 2,
      name: 'IOS'
    }
  ];
  const column = [
    {
      title: '用户账号',
      key: 'userNo',
      dataIndex: 'userNo'
    },
    {
      title: '最近登录时间',
      key: 'createTime',
      dataIndex: 'createTime'
    },
    {
      title: '当前版本',
      key: 'appVersion',
      dataIndex: 'appVersion'
    },
    {
      title: '版本更新时间',
      key: 'versionUpdateTime',
      dataIndex: 'versionUpdateTime'
    },
    {
      title: '设备类型',
      key: 'appType',
      dataIndex: 'appType',
      render: (text) => {
        let data = phoneType.find((item) => item.value === text);
        return data && data.name;
      }
    },
    {
      title: '设备型号',
      key: 'devInfo',
      dataIndex: 'devInfo'
    },
    {
      title: '操作',
      key: 'operation',
      render: (record) => {
        return (
          <a
            onClick={() => {
              setVersionVisible(true);
              queryVersion(record);
            }}
          >
            版本记录
          </a>
        );
      }
    }
  ];
  const query = (val) => {
    delete val.date;
    logPage({
      ...val,
      userNoList: val.userNoList ? [val.userNoList] : undefined,
      pageNum: page.pageNum - 1,
      pageSize: page.pageSize
    }).then(({ res }) => {
      if (res.code === Const.SUCCESS_CODE) {
        let data = res.context.customerLogVOList;
        setTableData(data.content);
        setTotal(data.total);
      } else {
        message.error(res.message);
      }
    });
  };

  const queryVersion = async (record) => {
    const { res } = await findUpdateRecordByUserNo({
      userNo: record.userNo,
      appType: record.appType
    });
    if (res.code === Const.SUCCESS_CODE) {
      setRecord({ ...record, list: res.context.customerLogVOList.content });
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    query({});
  }, []);

  useEffect(() => {
    querybarRef.current.validateFields((err, value) => {
      if (!err) {
        let data = {
          ...value,
          createTimeBegin:
            value.date &&
            value.date[0] &&
            value.date[0].format('YYYY-MM-DD') + ' 00:00:00',
          createTimeEnd:
            value.date &&
            value.date[1] &&
            value.date[1].format('YYYY-MM-DD') + ' 23:59:59'
        };
        query(data);
      }
    });
  }, [page]);

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="用户APP版本" />
        <QueryBar ref={querybarRef} query={query} />
        <Table
          columns={column}
          dataSource={tableData}
          pagination={{
            total: total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showSizeChanger: true,
            onShowSizeChange: (pageNum, pageSize) => {
              setPage({ pageNum: pageNum, pageSize: pageSize });
            },
            onChange: (pageNum, pageSize) => {
              setPage({ pageNum: pageNum, pageSize: pageSize });
            }
          }}
        ></Table>
      </div>
      <Modal
        title="版本更新记录"
        visible={versionVisible}
        onCancel={() => {
          setVersionVisible(false);
        }}
        footer={null}
      >
        <Row>
          <Col style={{ height: '30px', lineHeight: '30px' }} span={12}>
            <span style={{ fontWeight: 600 }}> 账号：</span>
            {record.userNo}
          </Col>
          <Col style={{ height: '30px', lineHeight: '30px' }} span={12}>
            <span style={{ fontWeight: 600 }}>设备类型：</span>
            {phoneType.find((item) => record.appType === item.value)?.name}
          </Col>
          <Col
            style={{ height: '30px', lineHeight: '30px', fontWeight: 600 }}
            span={12}
          >
            版本号
          </Col>
          <Col
            style={{ height: '30px', lineHeight: '30px', fontWeight: 600 }}
            span={12}
          >
            更新时间
          </Col>
          {record.list &&
            record.list.map((item) => {
              return [
                <Col style={{ height: '30px', lineHeight: '30px' }} span={12}>
                  {item.appVersion}
                </Col>,
                <Col style={{ height: '30px', lineHeight: '30px' }} span={12}>
                  {item.createTime || '-'}
                </Col>
              ];
            })}
          {!record.list || record.list.length === 0
            ? [
                <Col style={{ height: '30px', lineHeight: '30px' }} span={12}>
                  -
                </Col>,
                <Col style={{ height: '30px', lineHeight: '30px' }} span={12}>
                  -
                </Col>
              ]
            : null}
        </Row>
      </Modal>
    </div>
  );
};

export default AppMonitor;
