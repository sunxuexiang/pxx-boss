import React, { useState, useEffect } from 'react';
import './recommended-merchant.less';
import {
  Button,
  Table,
  Modal,
  Input,
  Popconfirm,
  message,
  Form,
  Select
} from 'antd';
import {
  getRecommendMerchant,
  getMerchantList,
  addMerchant,
  delMerchant,
  sortMarketData,
  fetchAllStore,
  getMarketData
} from './webapi';
import { Const, DragTable, SelectGroup } from 'qmkit';
import SortModal from './component/sort-modal';

const FormItem = Form.Item;
export default function RecommendedMerchant(props) {
  // 表头数据
  const merchantColumns = [
    // {
    //   title: '序号',
    //   width: 100,
    //   align: 'center' as 'center',
    //   dataIndex: 'sort',
    //   key: 'sort',
    //   render: (text, record, index) => (
    //     <Button
    //       type="link"
    //       onClick={() => {
    //         setSortType(1);
    //         settMerchantInfo(record);
    //         setShowSortModal(true);
    //       }}
    //     >
    //       {text}
    //     </Button>
    //   )
    // },
    {
      title: '指定排序',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'assignSort',
      key: 'assignSort',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setSortType(2);
            settMerchantInfo(record);
            setShowSortModal(true);
          }}
        >
          {text || '--'}
        </Button>
      )
    },
    {
      title: '商家编号',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'companyInfoId',
      key: 'companyInfoId'
    },
    {
      title: '商家名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'companyInfoName',
      key: 'companyInfoName'
    },
    {
      title: '店铺名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        return (
          <div className="mall-table-btn">
            <Popconfirm
              placement="topRight"
              title={'确认删除该条数据？'}
              onConfirm={() => {
                delConfim(record);
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  // 弹窗表头
  const seachMerchantCol = [
    {
      title: '商家编号',
      width: 130,
      align: 'center' as 'center',
      dataIndex: 'companyCode',
      key: 'companyCode'
    },
    {
      title: '商家名称',
      align: 'center' as 'center',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '店铺名称',
      width: 180,
      align: 'center' as 'center',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: '所属批发市场',
      width: 180,
      align: 'center' as 'center',
      dataIndex: 'marketName',
      key: 'marketName'
    }
  ];
  // 推荐商家表格数据
  const [merchantData, setMerchantData] = useState([]);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 分页参数
  const [tableTotal, setTotal] = useState(0);
  // 是否指定排序
  const [isAssignSort, setIsAssignSort] = useState(-1);
  // 推荐商家loading
  const [tableLoading, setTableLoading] = useState(false);
  // 新增弹窗显示
  const [showMerchantAdd, setMerchantAddShow] = useState(false);
  // 新增按钮loading
  const [confirmLoading, setLoading] = useState(false);
  // 弹窗-搜索商家名称
  const [searchMerchantName, setMerchantName] = useState('');
  //  弹窗-选择的批发市场
  const [modalMarketId, setModalMarketId] = useState('');
  // 弹窗商家列表分页参数
  const [merchantPageParams, changemerchantPage] = useState({
    pageNum: 0,
    pageSize: 10,
    auditState: '1'
  });
  // 商家表格数据
  const [allMerchantData, setAllMerchantData] = useState([]);
  // 商家表格数据
  const [allMerchantTotal, setAllMerchantTotal] = useState(0);
  // 推荐商家loading
  const [merchantLoading, setMerchantLoading] = useState(false);
  // 已选择商家
  const [checkMerchant, setCheckMerchant] = useState([]);
  // 已选择商家key
  const [selectedRowKeys, changeSelectedRowKeys] = useState([]);
  // 排序类型 1 序号排序 2 手动排序
  const [sortType, setSortType] = useState(1);
  // 排序弹窗显示
  const [showSortModal, setShowSortModal] = useState(false);
  // 当前编辑商家信息
  const [currentMerchantInfo, settMerchantInfo] = useState({} as any);
  // 所有店铺数据
  const [storeList, setStoreList] = useState([]);
  // 选择的店铺
  const [storeIds, setStoreIds] = useState([]);
  // 所有批发市场数据
  const [marketList, setMarketList] = useState([]);
  // 选择的批发市场
  const [marketId, setMarketId] = useState('');
  // 获取所有批发市场
  const getMarketList = async () => {
    const { res } = await getMarketData({ pageNum: 0, pageSize: 10000 });
    if (res && res.code === Const.SUCCESS_CODE) {
      const list = res.context?.content || [];
      setMarketList(list);
      if (list.length > 0) {
        let defalutId = list[0].marketId;
        list.forEach((item) => {
          if (item.marketName === '长沙批发市场') {
            defalutId = item.marketId;
            return;
          }
        });
        setMarketId(defalutId);
        init(defalutId);
      }
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getMarketList();
  }, []);
  useEffect(() => {
    if (marketList.length > 0) {
      init();
    }
  }, [pageParams]);
  useEffect(() => {
    getAllStore();
  }, []);
  // 搜索
  const init = (id?) => {
    setTableLoading(true);
    getRecommendMerchant({
      ...pageParams,
      storeIds,
      assignSort: isAssignSort,
      marketId: id || marketId
    })
      .then((data) => {
        console.warn(data);
        setTableLoading(false);
        setTotal(data.res.context.totalElements);
        setMerchantData(data.res.context.content);
      })
      .catch((err) => {
        console.warn(err);
        setTableLoading(false);
      });
  };
  // 获取所有店铺
  const getAllStore = async () => {
    const { res } = await fetchAllStore();
    if (res && res.code === Const.SUCCESS_CODE) {
      setStoreList(res.context || []);
    } else {
      message.error(res.message || '');
    }
  };
  // 翻页
  const changeTablePage = (pageNum = 0) => {
    changePage({ ...pageParams, pageNum });
  };
  // 弹窗初始化
  useEffect(() => {
    searchAllMerchant();
  }, [merchantPageParams]);
  // 弹窗显示
  const showAdd = () => {
    setMerchantAddShow(true);
    searchAllMerchant();
  };
  // 查询所有商家
  const searchAllMerchant = () => {
    setMerchantLoading(true);
    getMerchantList(merchantPageParams)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('添加失败');
          return;
        }
        console.warn(data);
        setMerchantLoading(false);
        setAllMerchantData(data.res.context.content);
        setAllMerchantTotal(data.res.context.totalElements);
      })
      .catch((err) => {
        console.warn(err);
        setMerchantLoading(false);
      });
  };
  const merchantChangePage = (pageNum) => {
    changemerchantPage({ ...merchantPageParams, pageNum });
  };
  // 弹窗搜索商家
  const searchMerchant = () => {
    const pageParams = {
      pageNum: 0,
      pageSize: 10,
      auditState: '1',
      marketId: modalMarketId
    };
    if (searchMerchantName) {
      pageParams['storeName'] = searchMerchantName;
    }
    changemerchantPage({ ...pageParams });
  };
  // 添加商家
  const merchantAdd = () => {
    const companyInfoIds = checkMerchant.map((item) => {
      return item.companyInfoId;
    });
    addMerchant({ companyInfoIds: companyInfoIds })
      .then((res) => {
        console.warn(res);
        message.success('添加成功');
        setMerchantAddShow(false);
        setCheckMerchant([]);
        changeSelectedRowKeys([]);
        init();
      })
      .catch((err) => {
        console.warn(err);
        message.error('添加失败');
        setMerchantAddShow(false);
        setCheckMerchant([]);
        changeSelectedRowKeys([]);
      });
  };
  // 删除商家
  const delConfim = (data) => {
    const { companyInfoId, id, companyInfoName } = data;
    const params = { companyInfoId, id, companyInfoName, delFlag: 1 };
    delMerchant(params)
      .then((res) => {
        console.warn(res);
        message.success('删除成功');
        init();
      })
      .catch((err) => {
        console.warn(err);
        message.error('删除失败');
      });
  };
  // 选择
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      changeSelectedRowKeys(selectedRowKeys);
      setCheckMerchant(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.recommendFlag
    })
  };
  // 修改排序
  // const changeTableSort = (dragIndex, targetIndex) => {
  //   console.warn(dragIndex, targetIndex);
  //   const tableData = [...merchantData];
  //   // 拖动位置
  //   const dragData = tableData[dragIndex];
  //   // 目标位置
  //   const targetData = tableData[targetIndex];
  //   // 交换操作
  //   tableData[dragIndex] = { ...targetData };
  //   tableData[targetIndex] = { ...dragData };
  //   const sortIds = tableData.map((item, index) => {
  //     return { sortId: item.id, sort: index + 1 };
  //   });
  //   sortMarketData({ sorts: sortIds, type: 3 })
  //     .then((res) => {
  //       console.warn(res);
  //       if (res.res.code !== Const.SUCCESS_CODE) {
  //         message.error('操作失败');
  //         return;
  //       }
  //       message.success('操作成功');
  //       init();
  //     })
  //     .catch((err) => {
  //       message.error('操作失败');
  //     });
  // };
  return (
    <div className="recommended-merchant-container">
      <p className="recommended-merchant-header">推荐商家</p>
      <Form layout="inline">
        <FormItem style={{ marginBottom: '12px' }}>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="店铺名称"
            style={{ width: 240 }}
            value={storeIds}
            onChange={(value: any) => {
              setStoreIds(value);
            }}
            showSearch
            maxTagCount={1}
            maxTagTextLength={100}
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
            mode="multiple"
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
        <FormItem style={{ marginBottom: '12px' }}>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="是否指定排序"
            style={{ width: 100 }}
            value={isAssignSort}
            onChange={(value: any) => {
              setIsAssignSort(value);
            }}
          >
            <Select.Option key="-1" value={-1}>
              全部
            </Select.Option>
            <Select.Option key="1" value={1}>
              是
            </Select.Option>
            <Select.Option key="0" value={0}>
              否
            </Select.Option>
          </SelectGroup>
        </FormItem>
        <FormItem style={{ marginBottom: '12px' }}>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="批发市场"
            style={{ width: 240 }}
            value={marketId}
            onChange={(value: any) => {
              setMarketId(value);
            }}
            showSearch
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
          >
            {marketList.map((item: any) => {
              return (
                <Select.Option key={item.marketId} value={item.marketId}>
                  {item.marketName}
                </Select.Option>
              );
            })}
          </SelectGroup>
        </FormItem>
        <Button type="primary" onClick={() => changeTablePage(0)}>
          搜索
        </Button>
      </Form>
      <div className="recommended-merchant-operate">
        <Button type="primary" onClick={showAdd}>
          添加商家
        </Button>
      </div>
      {/* 商家列表 */}
      <div className="market-table">
        {/* <DragTable
          rowKeyName={'id'}
          loading={tableLoading}
          dragColumns={merchantColumns}
          dragData={merchantData}
          pagination={pageParams}
          total={tableTotal}
          changeData={(pageNum) => {
            changeTablePage(pageNum - 1);
          }}
          changeSort={(dragIndex, targetIndex) => {
            changeTableSort(dragIndex, targetIndex);
          }}
        /> */}
        <Table
          loading={tableLoading}
          columns={merchantColumns}
          dataSource={merchantData}
          pagination={{
            showQuickJumper: false,
            current: pageParams.pageNum + 1,
            pageSize: pageParams.pageSize,
            total: tableTotal,
            onChange: (pageNum) => {
              changeTablePage(pageNum - 1);
            }
          }}
          rowKey="id"
        />
      </div>
      {/* 添加商家弹窗 */}
      <Modal
        title="选择商家"
        width={900}
        visible={showMerchantAdd}
        onOk={merchantAdd}
        confirmLoading={confirmLoading}
        onCancel={() => {
          changeSelectedRowKeys([]);
          setMerchantAddShow(false);
        }}
        okButtonProps={{ disabled: !checkMerchant.length }}
      >
        <p className="merchant-modal-top">
          店铺名称：
          <Input
            className="merchant-input"
            onChange={(e) => {
              setMerchantName(e.target.value);
            }}
            onPressEnter={searchMerchant}
            placeholder="请输入店铺名称"
          />
          批发市场：
          <Select
            getPopupContainer={() => document.getElementById('page-content')}
            style={{ width: 160, marginRight: '15px' }}
            value={modalMarketId}
            onChange={(value: any) => {
              setModalMarketId(value);
            }}
            showSearch
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
          >
            <Select.Option key="all" value="">
              全部
            </Select.Option>
            {marketList.map((item: any) => {
              return (
                <Select.Option key={item.marketId} value={item.marketId}>
                  {item.marketName}
                </Select.Option>
              );
            })}
          </Select>
          <Button
            type="primary"
            onClick={() => {
              searchMerchant();
            }}
          >
            搜索
          </Button>
        </p>
        <Table
          bordered
          loading={merchantLoading}
          rowSelection={rowSelection}
          columns={seachMerchantCol}
          dataSource={allMerchantData}
          pagination={{
            showQuickJumper: false,
            current: merchantPageParams.pageNum + 1,
            pageSize: merchantPageParams.pageSize,
            total: allMerchantTotal,
            onChange: (pageNum) => {
              merchantChangePage(pageNum - 1);
            }
          }}
          rowKey={(record: any) => record.companyInfoId}
        />
      </Modal>
      {/* 排序弹窗 */}
      <SortModal
        showSort={showSortModal}
        sortType={sortType}
        currentData={currentMerchantInfo}
        marketId={marketId}
        hideSort={(isRefresh) => {
          if (isRefresh) {
            init();
          }
          setShowSortModal(false);
        }}
      />
    </div>
  );
}
