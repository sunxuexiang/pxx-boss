import React, { FC, useState, useRef, useEffect } from 'react';
import { BreadCrumb, Headline, AuthWrapper } from 'qmkit';
// \import { AuthWrapper, history, noop, ExportModal } from 'qmkit';
import { Button, Table, Modal, message } from 'antd';
import QueryBar from './components/QueryBar';
import Creat from './components/creat';
import Detail from './components/detail';
import { clainmsApplyList, fetchAllStore, platoToStore } from './webApi';
import { Const, util } from 'qmkit';
import moment from 'moment';
const RechargeList: FC<any> = () => {
  const [data, setData] = useState([] as any);
  const [creatVisible, setCreatVisible] = useState(false as boolean);
  const [detailsVisible, setDetailsVisible] = useState(false as boolean);
  const [currentData, setCurrentData] = useState({} as any);
  const [page, setPage] = useState({ pageNum: 1, pageSize: 10 } as any);
  const [modalLoading, setModalLoading] = useState(false as boolean);
  const [total, setTotal] = useState(0 as number);
  const [storeList, setList] = useState([]);
  const modalRef = useRef(null);
  const querybarRef = useRef(null);
  const createFormRef = useRef(null);

  const getList = async () => {
    const { res } = await fetchAllStore();
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context || []);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const column = [
    {
      title: '商家编号',
      key: 'storeCode',
      dataIndex: 'storeCode'
    },
    {
      title: '商家账号',
      key: 'storeAccount',
      dataIndex: 'storeAccount'
    },
    {
      title: '商家名称',
      key: 'supplierName',
      dataIndex: 'supplierName'
    },
    {
      title: '店铺名称',
      key: 'storeName',
      dataIndex: 'storeName'
    },
    {
      title: '充值金额',
      key: 'rechargeBalance',
      dataIndex: 'rechargeBalance'
    },
    {
      title: '充值时间',
      key: 'rechargeTime',
      dataIndex: 'rechargeTime',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'operation',
      render: (recod) => {
        return (
          <a
            onClick={() => {
              setCurrentData(recod);
              setDetailsVisible(true);
            }}
          >
            查看明细
          </a>
        );
      }
    }
  ];

  useEffect(() => {
    query();
  }, [page]);

  const query = async () => {
    querybarRef.current.validateFields(async (err, val) => {
      if (!err) {
        const searchParams = { ...val };
        if (val.date && val.date.length) {
          searchParams.startTime =
            val.date && val.date[0] && val.date[0].format('YYYY-MM-DD');
          searchParams.endTime =
            val.date && val.date[1] && val.date[1].format('YYYY-MM-DD');
        }
        delete searchParams.date;
        let { res } = (await clainmsApplyList({
          ...page,
          pageNum: page.pageNum - 1,
          ...searchParams
        })) as any;
        if (res.code === Const.SUCCESS_CODE) {
          setData(res.context.microServicePage?.content || []);
          setTotal(res.context.microServicePage?.total || 0);
        } else {
          message.error(res.message);
        }
      }
    });
  };

  //充值申请提交
  const rechargeSubmit = async () => {
    createFormRef.current.validateFields(async (errs, values) => {
      if (!errs) {
        setModalLoading(true);
        const { res } = await platoToStore(values);
        setModalLoading(false);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('操作成功');
          setCreatVisible(false);
          createFormRef.current.resetFields();
          query();
        } else {
          message.error(res.message || '');
        }
      }
    });
  };

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="充值列表"></Headline>
        <QueryBar setPage={setPage} ref={querybarRef} />
        <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
          <AuthWrapper functionName={'f_recharge_list-creat'}>
            <Button
              type="primary"
              onClick={() => {
                setCreatVisible(true);
              }}
            >
              鲸币充值
            </Button>
          </AuthWrapper>
        </div>
        <AuthWrapper functionName={'f-recharge-list-query'}>
          <Table
            columns={column}
            dataSource={data}
            rowKey="recordNo"
            pagination={{
              current: page.pageNum,
              pageSize: page.pageSize,
              total: total,
              onChange: (page) => {
                setPage({ pageNum: page, pageSize: 10 });
              }
            }}
          />
        </AuthWrapper>
        <Modal
          ref={modalRef}
          title="充值申请"
          visible={creatVisible}
          confirmLoading={modalLoading}
          destroyOnClose
          onOk={() => rechargeSubmit()}
          onCancel={() => {
            setCreatVisible(false);
            createFormRef.current.resetFields();
          }}
        >
          {creatVisible ? (
            <Creat ref={createFormRef} storeList={storeList} />
          ) : null}
        </Modal>
        <Modal
          title="查看详情"
          visible={detailsVisible}
          footer={null}
          onCancel={() => {
            setCurrentData({});
            setDetailsVisible(false);
          }}
        >
          <Detail item={currentData}></Detail>
        </Modal>
      </div>
    </div>
  );
};

export default RechargeList;
