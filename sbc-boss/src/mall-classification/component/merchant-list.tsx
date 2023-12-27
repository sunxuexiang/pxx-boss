import React, { useState, useEffect } from 'react';
import { Modal, Table, message, Input, Button } from 'antd';
import { Const, DragTable } from 'qmkit';
import SortModal from './sort-modal';
import '../mall-classification.less';
import { getBusinessByMall, sortMerchantData } from '../webapi';

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
      title: '指定排序',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'assignSort',
      key: 'assignSort',
      render: (text, record, index) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setSortData(record);
              setShowSortModal(true);
            }}
          >
            {text || '--'}
          </Button>
        );
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
  // 当前编辑商家信息
  const [sortData, setSortData] = useState('');
  // 排序弹窗显示
  const [showSort, setShowSortModal] = useState(false);
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
      tabId: props.currentMallData.id
    };
    getBusinessByMall(params).then((data) => {
      console.warn(data, '商家数据');
      setLoading(false);
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('查询商家失败');
        return;
      }
      setMerchantData(data.res.context);
    });
  };
  // 修改排序
  const changeTableSort = (dragIndex, targetIndex) => {
    let tableData = [...merchantData];
    // 被拖动数据
    const dragData = tableData[dragIndex];
    // 插入操作
    tableData[dragIndex] = null;
    tableData.splice(
      targetIndex + (dragIndex < targetIndex ? 1 : 0),
      0,
      dragData
    );
    tableData = tableData.filter((item) => !!item);
    const sortData = tableData.map((item, index) => {
      return { id: item.id, sort: index + 1 };
    });
    sortMerchantData({ contactRelationList: sortData })
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('操作失败');
          return;
        }
        message.success('操作成功');
        getBusinessData();
      })
      .catch((err) => {
        message.error('操作失败');
      });
  };

  const hideSort = (isRefresh) => {
    if (isRefresh) {
      getBusinessData();
    }
    setSortData('');
    setShowSortModal(false);
  };
  return (
    <Modal
      title="商城商家"
      width={900}
      visible={showMerchantAdd}
      // onOk={merchantAdd}
      // confirmLoading={confirmLoading}
      onCancel={() => {
        props.hideModal();
      }}
    >
      <DragTable
        rowKeyName={'storeId'}
        loading={loading}
        dragColumns={merchantCol}
        dragData={merchantData}
        // pagination={false}
        bordered
        changeSort={(dragIndex, targetIndex) => {
          changeTableSort(dragIndex, targetIndex);
        }}
        scroll={{ y: 600 }}
      />
      <SortModal showSort={showSort} sortData={sortData} hideSort={hideSort} />
    </Modal>
  );
};
export default MerchantListModal;
