import { BreadCrumb, Const, Headline } from 'qmkit';
import React, { useEffect, useState } from 'react';
import '../index.less';
import { Button, Modal, Row, Table, message } from 'antd';
import { FormSearchHeader } from './components/search-header';
import {
  ChooseSupplierModal,
  ChooseType
} from './components/choose-supplier-modal';
import { produce } from 'immer';
import {
  addSupplierRelevance,
  deleteCustomerServiceRelation,
  getCustomerServiceRelationList
} from '../webapi';

export default function ImRelevance() {
  // 表格数据
  const [tableDataSource, setTableDataSource] = useState([]);

  // 基本查询参数
  const [queryParams, setQueryParams] = useState({
    pageSize: 10,
    pageNum: 0,
    total: 0
  });

  // 其他查询参数
  const [otherQuery, setOtherQuery] = useState({});

  // 子组件Modal选中的数据
  const [modalSelectRows, setModalSelectRows] = useState([]);

  // 点击的数据
  const [itemRecord, setItemRecord] = useState<{ [prop: string]: any }>({});

  // 基本的Model数据
  const [modalData, setModalData] = useState({
    visible: false,
    modalType: ChooseType.parentSingle,
    isLoading: false
  });

  const types = ['平台自营', '第三方商家', '统仓统配', '零售超市', '新散批'];

  const columns = [
    {
      title: '商家编号',
      dataIndex: 'companyCode',
      key: 'companyCode'
    },
    {
      title: '商家名称',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: '商家账号',
      dataIndex: 'contactMobile',
      key: 'contactMobile'
    },
    {
      title: '商家类型',
      dataIndex: 'companyType',
      key: 'companyType',
      render: (text, _record) => {
        return types[text] || '-';
      }
    },
    {
      title: '是否自营商家',
      dataIndex: 'companyType',
      key: 'isOwned',
      render: (text, _record) => {
        return text == 0 ? '是' : '否';
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, _record) => {
        return (
          <div>
            <a onClick={() => handlerShowModal(ChooseType.childAdd, _record)}>
              关联商家
            </a>
            <a
              style={{ marginLeft: '6px' }}
              onClick={() => handlerShowModal(ChooseType.childRemove, _record)}
            >
              移除商家
            </a>
            <a
              style={{ marginLeft: '6px' }}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '是否确认删除',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => _handleDelete(_record)
                });
              }}
            >
              删除
            </a>
          </div>
        );
      }
    }
  ];

  const loadTableDatas = async () => {
    try {
      const { res } = await getCustomerServiceRelationList({
        ...queryParams,
        ...otherQuery
      });
      if (res.code == Const.SUCCESS_CODE) {
        setTableDataSource(res.context.content);
      } else {
        setTableDataSource([]);
      }
    } catch (error) {
      setTableDataSource([]);
    }
  };

  useEffect(() => {
    loadTableDatas();
  }, [queryParams, otherQuery]);

  const onSearch = async (data) => {
    setOtherQuery(data);
  };

  const handlerShowModal = (modalType: string, record = {}) => {
    if (
      modalType == ChooseType.parentSingle ||
      modalType == ChooseType.childRemove
    ) {
      setModalSelectRows([]);
    } else {
      // @ts-ignore
      const children = record.childList;
      setModalSelectRows([...children]);
    }
    setItemRecord({ ...record });

    setModalData(
      produce(modalData, (draft) => {
        draft.modalType = modalType;
        draft.visible = true;
      })
    );
  };

  const handlerDelteSingleItem = async (delItem) => {
    try {
      const savedList = itemRecord.childList.filter((item) => {
        return item.storeId != delItem.storeId;
      });
      const params = {
        storeId: itemRecord.storeId,
        companyInfoId: itemRecord.companyInfoId,
        childList: savedList.map((item) => {
          return {
            storeId: item.storeId,
            companyInfoId: item.companyInfoId
          };
        })
      };
      const { res } = await addSupplierRelevance(params, true);
      if (res.code == Const.SUCCESS_CODE) {
        message.success('移除成功');
        setItemRecord({ ...itemRecord, childList: savedList });
        loadTableDatas();
        return 1;
      } else {
        message.error(res.message || '移除失败');
        return 0;
      }
    } catch (error) {
      message.error(error.message);
      return 0;
    }
  };

  const clickModalConfirm = async () => {
    if (modalSelectRows.length == 0) {
      if (modalData.modalType == ChooseType.parentSingle) {
        message.info('请选择一个商家');
      } else {
        message.info('请至少选择一个商家');
      }
      return;
    }
    let params;
    if (modalData.modalType == ChooseType.parentSingle) {
      params = {
        storeId: modalSelectRows[0].storeId,
        companyInfoId: modalSelectRows[0].companyInfoId
      };
    } else if (modalData.modalType == ChooseType.childAdd) {
      params = {
        storeId: itemRecord.storeId,
        companyInfoId: itemRecord.companyInfoId,
        childList: modalSelectRows.map((item) => {
          return {
            storeId: item.storeId,
            companyInfoId: item.companyInfoId
          };
        })
      };
    } else {
      // 移除
      params = {
        storeId: itemRecord.storeId,
        companyInfoId: itemRecord.companyInfoId,
        childList: itemRecord.childList
          .filter((item) => {
            for (const row of modalSelectRows) {
              if (row.storeId == item.storeId) {
                return false;
              }
            }
            return true;
          })
          .map((item) => {
            return {
              storeId: item.storeId,
              companyInfoId: item.companyInfoId
            };
          })
      };
    }
    try {
      const modalType = modalData.modalType;
      setModalData(
        produce(modalData, (draft) => {
          draft.isLoading = true;
        })
      );
      const { res } = await addSupplierRelevance(
        params,
        modalType != ChooseType.parentSingle
      );
      if (res.code == Const.SUCCESS_CODE) {
        let title = {
          [ChooseType.parentSingle]: '添加',
          [ChooseType.childAdd]: '关联',
          [ChooseType.childRemove]: '移除'
        };
        message.success(`${title[modalType]}成功`);
        setQueryParams(
          produce(queryParams, (draft) => {
            draft.pageNum = 0;
          })
        );
        loadTableDatas();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setModalData(
        produce(modalData, (draft) => {
          draft.isLoading = false;
          draft.visible = false;
        })
      );
    }
  };

  const _handleDelete = async (record) => {
    try {
      const { res } = await deleteCustomerServiceRelation(record.storeId);
      if (res.code == Const.SUCCESS_CODE) {
        message.success('删除成功');
        loadTableDatas();
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const clickModalCancel = () => {
    setModalData(
      produce(modalData, (draft) => {
        draft.visible = false;
      })
    );
  };

  return (
    <div>
      {/*导航面包屑*/}
      <BreadCrumb />
      <div className="container">
        <Headline title="客服关联设置" />
        <Row>
          <FormSearchHeader onSearch={onSearch} queryParams={queryParams} />
        </Row>
        <Row>
          <Button
            type="primary"
            onClick={() => handlerShowModal(ChooseType.parentSingle)}
          >
            新增商家
          </Button>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Table
            rowKey="storeId"
            pagination={{
              pageSize: queryParams.pageSize,
              current: queryParams.pageNum,
              total: queryParams.total,
              onChange(page, pageSize) {
                setQueryParams(
                  produce(queryParams, (draft) => {
                    draft.pageNum = page;
                    draft.pageSize = pageSize;
                  })
                );
              }
            }}
            dataSource={tableDataSource}
            columns={columns}
          />
        </Row>
        <Modal
          confirmLoading={modalData.isLoading}
          width={'1000px'}
          title={`${
            modalData.modalType !== ChooseType.childRemove ? '选择' : '移除'
          }商家`}
          visible={modalData.visible}
          onOk={clickModalConfirm}
          onCancel={clickModalCancel}
        >
          <ChooseSupplierModal
            modalData={modalData}
            itemRecord={itemRecord}
            modalSelectRows={modalSelectRows}
            setModalSelectRows={setModalSelectRows}
            handlerDelteSingleItem={handlerDelteSingleItem}
          />
        </Modal>
      </div>
    </div>
  );
}
