import React, { useState, useEffect } from 'react';
import { message, Modal, Table, Form, Select, Button } from 'antd';
import { fetchStoreList, fetchAllStore } from '../webapi';
import { Const, SelectGroup } from 'qmkit';
import * as _ from 'lodash';
const FormItem = Form.Item;

function StoreModal(props) {
  const { storeVisible, closeStoreModal, selectStoreRows, storeSelectBackFun } =
    props;
  // 商家广告位列表数据
  const [list, setList] = useState([]);
  // 分页数据
  const [pagination, setPage] = useState({ current: 1, pageSize: 10 });
  // 总数
  const [tableTotal, setTotal] = useState(0);
  // 店铺ID
  const [storeId, setStoreId] = useState('');
  // 店铺列表
  const [storeList, setStoreList] = useState([]);
  // 选中的数据
  const [selectedRowKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // 获取列表数据
  const getList = async () => {
    const { res } = await fetchStoreList({
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      storeId
    });
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context?.advertisingPage?.content || []);
      setTotal(res.context?.advertisingPage?.total || 0);
    } else {
      message.error(res.message || '');
    }
  };
  // 搜索
  const onSearch = () => {
    setPage({ current: 1, pageSize: pagination.pageSize });
  };
  useEffect(() => {
    getList();
  }, [pagination]);

  //获取店铺列表数据
  const getStoreId = async () => {
    const { res } = await fetchAllStore();
    if (res && res.code === Const.SUCCESS_CODE) {
      setStoreList(res.context || []);
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getStoreId();
  }, []);

  useEffect(() => {
    // 每次打开弹窗 设置已选择的数据 并回到第一页
    if (storeVisible) {
      setSelectedRows(selectStoreRows);
      let keys = [];
      selectStoreRows.forEach((item) => {
        keys.push(item.advertisingId);
      });
      setSelectedKeys(keys);
      setPage({ current: 1, pageSize: 10 });
    }
  }, [storeVisible]);

  // 页码改变
  const pageChange = (page, pageSize) => {
    setPage({ current: page, pageSize });
  };

  // 选择项改变
  const selectChange = (keys, rows) => {
    console.log(keys, rows);
    setSelectedKeys(keys);
    const newList = selectedRows.filter((item) =>
      keys.includes(item.advertisingId)
    );
    setSelectedRows(_.uniqBy([...newList, ...rows], 'advertisingId'));
  };

  // 保存选择数据
  const handleOk = () => {
    storeSelectBackFun(selectedRows);
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'img',
      key: 'img',
      align: 'left',
      width: 450,
      render: (text, record) => {
        return record.advertisingConfigList.map((item, index) => {
          return item.advertisingImage ? (
            <img
              src={item.advertisingImage}
              key={index}
              style={styles.imgItem}
            />
          ) : (
            ''
          );
        });
      }
    },
    {
      title: '名称',
      dataIndex: 'advertisingName',
      key: 'advertisingName',
      align: 'left'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'left',
      render: (text, record) => {
        if (record.advertisingType == 0) {
          return '通栏推荐位';
        } else if (record.advertisingType == 1) {
          return '分栏推荐位';
        } else {
          return '轮播推荐位';
        }
      }
    },
    {
      title: '点铺名称',
      dataIndex: 'storeName',
      key: 'storeName',
      align: 'left'
    }
  ];
  return (
    <Modal
      title="商家广告位"
      visible={storeVisible}
      maskClosable={false}
      centered
      width={1200}
      onOk={handleOk}
      onCancel={closeStoreModal}
    >
      <Form className="filter-content" layout="inline">
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="店铺名称"
            style={{ width: 120 }}
            onChange={(value: any) => {
              setStoreId(value);
            }}
            showSearch
            value={storeId}
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
          >
            <Select.Option key="qaunbu" value="">
              全部
            </Select.Option>
            {storeList.map((item: any) => {
              return (
                <Select.Option key={item.storeId} value={item.storeId}>
                  {item.storeName}
                </Select.Option>
              );
            })}
          </SelectGroup>
        </FormItem>
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
      </Form>
      <Table
        dataSource={list}
        columns={columns}
        rowKey="advertisingId"
        pagination={{
          showQuickJumper: false,
          total: tableTotal,
          ...pagination,
          onChange: pageChange
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: selectChange
        }}
        scroll={{ y: 550 }}
      />
    </Modal>
  );
}

export default StoreModal;

const styles = {
  imgItem: {
    width: '60px',
    height: '60px',
    padding: ' 5px',
    border: '1px solid #ddd',
    float: 'left',
    marginRight: '10px',
    background: '#fff',
    borderRadius: '3px'
  }
};
