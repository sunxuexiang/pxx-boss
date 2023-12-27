import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Radio,
  Popconfirm,
  message
} from 'antd';
import './wholesale-market.less';
import { AreaSelect } from 'qmkit';
import {
  getMarketData,
  addMarketData,
  editMarketData,
  saveSiteList
} from './webapi';
import moment from 'moment';
import { FindArea, Const } from 'qmkit';
import SortModal from './component/sort-modal';
import MerchantListModal from './component/merchant-list';
import CargoInfoModal from './component/cargo-info';

const CargoInfoForm = Form.create({})(CargoInfoModal);

function WholesaleMarket(props) {
  const cargoRef = useRef();

  // 表头数据
  const columns = [
    {
      title: '编号',
      align: 'center' as 'center',
      dataIndex: 'marketId',
      key: 'marketId',
      render: (text, record, index) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setMarketInfo(record);
              setShowSortModal(true);
            }}
          >
            {pageParams.pageNum * pageParams.pageSize + index + 1}
          </Button>
        );
      }
    },
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
      title: '创建人',
      align: 'center' as 'center',
      dataIndex: 'operator',
      key: 'operator'
    },
    {
      title: '创建时间',
      align: 'center' as 'center',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) => {
        return moment(createTime).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        return (
          <div className="market-table-btn">
            <Button
              type="link"
              onClick={() => {
                marketOperation(
                  record,
                  record.openStatus === 1 ? 'start' : 'stop'
                );
              }}
            >
              {record.openStatus === 1 ? '停用' : '启用'}
            </Button>
            <Button
              type="link"
              onClick={() => {
                setMarketInfo(record);
                setShowMerchantList(true);
              }}
            >
              查看商家
            </Button>
            <Button
              type="link"
              onClick={() => {
                setShowCargoModal(true);
                setMarketInfo(record);
              }}
            >
              接货点
            </Button>
            <Button
              type="link"
              onClick={() => {
                openModal(true, record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              placement="topRight"
              title={'确认删除该条数据？'}
              onConfirm={() => {
                marketOperation(record, 'del');
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
  // 批发市场表格数据
  const [wholesaleData, setWholesaleData] = useState([]);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 总数
  const [tableTotal, setTableTotal] = useState(0);
  // 新增弹窗显示
  const [showModal, setShowModal] = useState(false);
  // 新增弹窗按钮loading
  const [confirmLoading, setModalLoading] = useState(false);
  // 表格加载loading
  const [tableLoading, setTableLoading] = useState(false);
  // 是否编辑
  const [isEdit, setEdit] = useState(false);
  // 当前编辑市场信息
  const [currentMarketInfo, setMarketInfo] = useState({} as any);
  // 排序弹窗显示
  const [showSortModal, setShowSortModal] = useState(false);
  // 添加商家显示
  const [showMerchantList, setShowMerchantList] = useState(false);
  // 批发市场弹窗
  const [showCargoModal, setShowCargoModal] = useState(false);
  // 搜索条件 批发市场名称
  const [marketName, setMarketName] = useState('');

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
        setTableTotal(data.res.context.totalElements);
        // 存入数据
        setWholesaleData(data.res.context.content);
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
  // 打开新增弹窗
  const openModal = (edit = false, data = {}) => {
    props.form.resetFields();
    // 设置弹窗类型
    if (edit) {
      setEdit(true);
      // 显示弹窗
      setShowModal(true);
      setMarketInfo(data);
    } else {
      setEdit(false);
      // 显示弹窗
      setShowModal(true);
    }
  };
  // 确认
  const confirmAdd = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const provinceName = FindArea.findProviceName(value.city[0]);
        const cityName = FindArea.findCity(value.city[1]);
        const params = {
          provinceName,
          cityName,
          cityId: value.city[1],
          provinceId: value.city[0],
          marketName: value.marketName,
          openStatus: value.openStatus
        };
        setModalLoading(true);
        if (isEdit) {
          // 修改
          params['marketId'] = currentMarketInfo.marketId;
          editMarket(params);
        } else {
          // 新增
          addNewMarket(params);
        }
      }
    });
  };

  /**
   * 保存集货点信息
   */
  const saveCargoInfo = async () => {
    const _save = async (pData) => {
      try {
        await saveSiteList(pData);
        message.success('保存成功');
      } catch (error) {
        message.error('保存失败');
      } finally {
        setShowCargoModal(false);
      }
    };

    // @ts-ignore
    cargoRef.current.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const _transformValue = (value) => {
          const paramData = [];
          Object.keys(value).forEach((key) => {
            const tmpKey = value[key];
            const val = typeof tmpKey === 'string' ? tmpKey.trim() : tmpKey;
            const keyArr = key.split('-');
            const preData = paramData[+keyArr[1]] || {};
            paramData[+keyArr[1]] = {
              ...preData,
              [keyArr[0]]: val
            };
          });
          return paramData.filter(Boolean);
        };

        const paramData = _transformValue(value)
          .filter(Boolean)
          .map((item) => {
            const streetCode = item.streetCode[1];
            const streetItem = FindArea.findStreetItem(streetCode);
            const districtName = FindArea.findArea(item.streetCode[0]);
            const districtCode = item.streetCode[0];
            return {
              ...item,
              provinceName: currentMarketInfo.provinceName,
              cityName: currentMarketInfo.cityName,
              provinceCode: currentMarketInfo.provinceId,
              cityCode: currentMarketInfo.cityId,
              street: streetItem.name,
              streetCode: streetCode,
              districtCode: districtCode,
              districtName: districtName
            };
          });

        _save({
          siteOwnerId: currentMarketInfo.marketId,
          siteType: '1',
          sites: paramData
        });
      }
    });
  };

  // 新增市场数据
  const addNewMarket = (params) => {
    setModalLoading(true);
    addMarketData(params)
      .then((data) => {
        console.warn(data, '新增');
        // @ts-ignore
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('新增失败');
          return;
        }
        message.success('新增成功');
        setModalLoading(false);
        setShowModal(false);
        getWholesaleTableData();
      })
      .catch((err) => {
        console.warn(err);
        message.error('新增失败');
        setModalLoading(false);
      });
  };
  // 修改编辑
  const editMarket = (params) => {
    setModalLoading(true);
    editMarketData(params)
      .then((data) => {
        // @ts-ignore
        if (data.res.code !== Const.SUCCESS_CODE) {
          setModalLoading(false);
          message.error('操作失败');
          return;
        }
        console.warn(data, '修改');
        message.success('操作成功');
        setModalLoading(false);
        setShowModal(false);
        setMarketInfo({});
        setEdit(false);
        getWholesaleTableData();
      })
      .catch((err) => {
        console.warn(err);
        message.error('操作失败');
        setModalLoading(false);
        setShowModal(false);
        setMarketInfo({});
        setEdit(false);
      });
  };
  // 表格操作
  const marketOperation = (currentInfo, operateType) => {
    const { marketId } = currentInfo;
    // 启用
    if (operateType === 'start') {
      const params = { openStatus: 0, marketId };
      editMarket(params);
    }
    // 停用
    if (operateType === 'stop') {
      const params = { openStatus: 1, marketId };
      editMarket(params);
    }
    // 删除
    if (operateType === 'del') {
      const params = { delFlag: 1, marketId };
      editMarket(params);
    }
  };
  const { getFieldDecorator } = props.form;
  return (
    <div className="wholesale-market-container">
      <p className="wholesale-market-header">批发市场</p>
      <div className="wholesale-market-operate">
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
        <Button
          type="primary"
          onClick={() => {
            openModal();
          }}
          style={{ marginLeft: '16px' }}
        >
          新增
        </Button>
      </div>
      {/* 批发市场列表 */}
      <div className="market-table">
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
      {/* 新增/编辑弹窗 */}
      <Modal
        title={`${isEdit ? '编辑批发市场' : '新增市场信息'}`}
        width={500}
        visible={showModal}
        onOk={confirmAdd}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setShowModal(false);
          setMarketInfo({});
        }}
      >
        <Form
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 18
          }}
          autoComplete="off"
        >
          <Form.Item style={{ marginBottom: 15 }} label="批发市场名称">
            {getFieldDecorator('marketName', {
              rules: [{ required: true, message: '请输入批发市场名称' }],
              initialValue: isEdit ? currentMarketInfo.marketName : ''
            })(<Input placeholder="请输入批发市场名称" />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="所在城市">
            {getFieldDecorator('city', {
              rules: [{ required: true, message: '请选择城市' }],
              initialValue: isEdit
                ? [
                    `${currentMarketInfo.provinceId}`,
                    `${currentMarketInfo.cityId}`
                  ]
                : []
            })(
              <AreaSelect
                hasNoArea={true}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(value) => {
                  console.warn(value);
                }}
              />
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="状态">
            {getFieldDecorator('openStatus', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: isEdit ? currentMarketInfo.openStatus : 1
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
      {/* 接货点弹窗 */}
      <Modal
        title={`${currentMarketInfo.marketName}接货点`}
        width={1000}
        visible={showCargoModal}
        onOk={saveCargoInfo}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setShowCargoModal(false);
          setMarketInfo({});
        }}
      >
        {/* @ts-ignore */}
        <CargoInfoForm ref={cargoRef} currentMarketInfo={currentMarketInfo} />
      </Modal>
      {/* 排序弹窗 */}
      <SortModal
        /* @ts-ignore */
        showSort={showSortModal}
        currentData={currentMarketInfo}
        hideSort={() => {
          setShowSortModal(false);
          setMarketInfo({});
          getWholesaleTableData();
        }}
      />
      {/* 商家列表 */}
      <MerchantListModal
        showAdd={showMerchantList}
        currentMarketData={currentMarketInfo}
        hideModal={() => {
          setShowMerchantList(false);
        }}
      />
    </div>
  );
}
const marketTemplate = Form.create()(WholesaleMarket);

export default marketTemplate;
