import { Button, Col, Input, Modal, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getSupplierList,
  queryCustomerRelevanceAllList,
  queryCustomerRelevanceBindList
} from '../../webapi';
import { Const } from 'qmkit';
import { produce } from 'immer';

export const ChooseType = {
  // 添加商家
  parentSingle: 'parent-single',
  // 选择关联子商家
  childAdd: 'child-add',
  // 选择移除关联子商家
  childRemove: 'child-remove'
};

export function ChooseSupplierModal(props) {
  const {
    modalData,
    modalSelectRows,
    setModalSelectRows,
    itemRecord,
    handlerDelteSingleItem
  } = props;
  const [loading, setLoading] = useState(false);
  const { modalType } = modalData;
  const [query, setQuery] = useState({
    storeName: '',
    pageNum: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);
  const [chooseDataSource, setChooseDataSource] = useState<any[]>([]);

  useEffect(() => {
    loadDatasource();
  }, [modalType, itemRecord, query]);

  const columns = [
    {
      title: '商家名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      align: 'left'
    },
    {
      title: '商家编号',
      dataIndex: 'companyCode',
      key: 'companyCode',
      align: 'left'
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      key: 'storeName',
      align: 'left',
      render: (text, _record) => {
        return text;
      }
    }
  ];

  const _deleteItems = async (item) => {
    Modal.confirm({
      title: '提示',
      content: '是否确认移除商家',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        const flag = await handlerDelteSingleItem(item);
        if (flag == 1) {
          loadDatasource();
        } else {
          setLoading(false);
        }
      }
    });
  };

  if (modalType == ChooseType.childRemove) {
    columns.push({
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'left',
      render: (_text, _record) => {
        return (
          <a
            onClick={() => {
              _deleteItems(_record);
            }}
          >
            移除
          </a>
        );
      }
    });
  }

  const clickSearch = () => {
    setQuery(
      produce(query, (draft) => {
        draft.pageNum = 1;
      })
    );
    loadDatasource();
  };

  const loadDatasource = async () => {
    try {
      setLoading(true);
      setChooseDataSource([]);
      let result = null;
      if (modalType === ChooseType.parentSingle) {
        const { res } = await getSupplierList({
          ...query,
          pageNum: query.pageNum - 1
        });
        result = res;
      }
      if (modalType === ChooseType.childAdd) {
        const { res } = await queryCustomerRelevanceAllList({
          ...query,
          pageNum: query.pageNum - 1,
          storeId: itemRecord.storeId
        });
        result = res;
      }
      if (modalType === ChooseType.childRemove) {
        const { res } = await queryCustomerRelevanceBindList({
          ...query,
          pageNum: query.pageNum - 1,
          storeId: itemRecord.storeId
        });
        result = res;
      }
      if (result && result.code == Const.SUCCESS_CODE) {
        const content = result.context.content;
        const total = result.context.total;
        setChooseDataSource(content);
        setTotal(total);
      } else {
        setChooseDataSource([]);
        setTotal(0);
      }
    } catch (error) {
      console.warn('===错误==>', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={10}>
          <Input
            addonBefore="店铺名称："
            onChange={(e) =>
              setQuery(
                produce(query, (draft) => {
                  draft.storeName = e.target.value;
                })
              )
            }
          />
        </Col>
        <Col span={5}>
          <Button type="primary" onClick={clickSearch}>
            搜索
          </Button>
        </Col>
        <Col span={3}>
          <span>{`已选：${modalSelectRows.length}家`}</span>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Table
          loading={loading}
          rowKey="storeId"
          dataSource={chooseDataSource}
          pagination={{
            total: total,
            pageSize: query.pageSize,
            current: query.pageNum,
            onChange(page, pageSize) {
              setQuery(
                produce(query, (draft) => {
                  draft.pageNum = page;
                  draft.pageSize = pageSize;
                })
              );
            }
          }}
          rowSelection={{
            selectedRowKeys: modalSelectRows.map((item) => item.storeId),
            type: modalType === ChooseType.parentSingle ? 'radio' : 'checkbox',
            onChange: (_selectedRowKeys, selectedRows) => {
              setModalSelectRows(selectedRows);
            }
          }}
          // @ts-ignore
          columns={columns}
        />
      </Row>
    </div>
  );
}
