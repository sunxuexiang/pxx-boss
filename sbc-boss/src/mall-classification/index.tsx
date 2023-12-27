import React, { useState, useEffect, forwardRef } from 'react';
import { produce } from 'immer';

import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Popconfirm,
  message,
  Checkbox,
  Row,
  Col
} from 'antd';
import './mall-classification.less';
import moment from 'moment';
import {
  getMallData,
  addMallData,
  editMallData,
  sortMarketData
} from './webapi';
import { DragTable, Const } from 'qmkit';
import MerchantListModal from './component/merchant-list';

const DeliveryInput = (props, ref) => {
  const {
    value: { checkedList, radio1, radio2 }
  } = props;

  const handlerBoxChanged = (e) => {
    triggerChange({ box: e });
  };

  const checkedChanged = (e, index) => {
    triggerChange({ [index]: e.target.value });
  };

  const triggerChange = (changedValue) => {
    const { onChange, value } = props;
    if (onChange) {
      onChange(
        produce(value, (draft) => {
          Object.keys(changedValue).forEach((key) => {
            // if (key == 'box1') {
            //   draft.radio1 = changedValue[key];
            // } else if (key == 'box3') {
            //   draft.radio2 = changedValue[key];
            // } else if (key == 'box') {
            //   draft.checkedList = changedValue[key];
            // }
            draft.checkedList = changedValue[key];
          });
        })
      );
    }
  };

  return (
    <Checkbox.Group
      ref={ref}
      style={{ width: '100%', marginTop: 8 }}
      value={checkedList}
      onChange={handlerBoxChanged}
    >
      {/* <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'box1'}>托运部或指定物流</Checkbox>
        </Col>
        <Col span={11}>
          <Radio.Group
            onChange={(e) => checkedChanged(e, 'box1')}
            disabled={checkedList.filter((item) => item == 'box1').length == 0}
            value={radio1}
          >
            <Radio value={'2'}>托运部</Radio>
            <Radio value={'8'}>指定物流</Radio>
          </Radio.Group>
        </Col>
      </Row> */}
      <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'2'}>托运部</Checkbox>
        </Col>
      </Row>
      <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'8'}>指定专线</Checkbox>
        </Col>
      </Row>
      <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'5'}>配送到店</Checkbox>
        </Col>
      </Row>
      {/* <Row gutter={[0, 20]}>
        <Col span={13}>
          <Checkbox value={'box3'}>快递到家(自费)或同城配送(自费)</Checkbox>
        </Col>
        <Col span={11}>
          <Radio.Group
            onChange={(e) => checkedChanged(e, 'box3')}
            disabled={checkedList.filter((item) => item == 'box3').length == 0}
            value={radio2}
          >
            <Radio value={'4'}>快递到家</Radio>
            <Radio value={'9'}>同城配送</Radio>
          </Radio.Group>
        </Col>
      </Row> */}
      <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'4'}>快递到家(自费)</Checkbox>
        </Col>
      </Row>
      <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'9'}>同城配送(自费)</Checkbox>
        </Col>
      </Row>
      <Row gutter={[0, 20]}>
        <Col span={12}>
          <Checkbox value={'3'}>自提</Checkbox>
        </Col>
      </Row>
    </Checkbox.Group>
  );
};

const DeliveryInputRef = forwardRef(DeliveryInput);

const MallClassification = (props) => {
  // 表头数据
  const mallColumns = [
    {
      title: '编号',
      align: 'center' as 'center',
      dataIndex: 'id',
      key: 'id',
      render: (_text, _record, index) => {
        return pageParams.pageNum * pageParams.pageSize + index + 1;
      }
    },
    {
      title: '商城名称',
      align: 'center' as 'center',
      dataIndex: 'tabName',
      key: 'tabName'
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
      render: (_text, record) => {
        return (
          <div className="mall-table-btn">
            <Button
              type="link"
              onClick={() => {
                mallOperation(
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
                setCurrentMall(record);
                setShowMerchantList(true);
              }}
            >
              查看商家
            </Button>
            <Button
              type="link"
              onClick={() => {
                openMallModal(true, record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              placement="topRight"
              title={'确认删除该条数据？'}
              onConfirm={() => {
                mallOperation(record, 'del');
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
  // 商城分类数据
  const [MallData, setMallData] = useState([]);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 9999
  });
  // 总数
  const [MallDataCount, setMallDataCount] = useState(0);
  // 表格加载
  const [tableLoading, setTableLoading] = useState(false);
  // 新增弹窗显示
  const [showModal, setModalVisiable] = useState(false);
  // 新增按钮loading
  const [confirmLoading, setLoading] = useState(false);
  // 是否编辑
  const [isEdit, setEditStatus] = useState(false);
  // 当前编辑数据
  const [currentMall, setCurrentMall] = useState({} as any);
  // 添加商家显示
  const [showMerchantList, setShowMerchantList] = useState(false);

  // 配送方式
  const [deliveryChecked, setDeliveryChecked] = useState({
    // 选中的check值列表
    checkedList: [],
    // 托运部和指定物流选中值（二选一）
    radio1: '0',
    // 快递到家和同城配送选中值（二选一）
    radio2: '0'
  });

  // 初始化
  useEffect(() => {
    init();
  }, [pageParams]);

  // 搜索查询
  const init = async () => {
    try {
      setTableLoading(true);
      const data = await getMallData(pageParams);
      setMallData(data.res.context.content);
      setMallDataCount(data.res.context.totalElements);
      setDeliveryChecked(
        produce(deliveryChecked, (draft) => {
          draft.checkedList = [];
          draft.radio1 = '0';
          draft.radio2 = '0';
        })
      );
    } catch (error) {
      console.warn(error);
    } finally {
      setTableLoading(false);
    }
  };

  // 翻页
  const changeDataPage = (pageNum) => {
    changePage({ ...pageParams, pageNum });
  };

  // 打开新增弹窗
  const openMallModal = async (isEdit = false, data = {}) => {
    if (isEdit) {
      setEditStatus(true);
      setCurrentMall(data);
      setDeliveryChecked(
        produce(deliveryChecked, (draft) => {
          // @ts-ignore
          const list = data.deliveryTypeList;
          if (list && list.length > 0) {
            const checkedList = [];
            list.forEach((item) => {
              // if (item == 2 || item == 8) {
              //   // 托运部和指定物流
              //   draft.radio1 = `${item}`;
              //   checkedList.push('box1');
              // } else if (item == 4 || item == 9) {
              //   // 快递到家和同城配送
              //   draft.radio2 = `${item}`;
              //   checkedList.push('box3');
              // } else {
              //   checkedList.push(`${item}`);
              // }
              checkedList.push(`${item}`);
              draft.checkedList = checkedList;
            });
          } else {
            draft.checkedList = [];
            draft.radio1 = '0';
            draft.radio2 = '0';
          }
        })
      );
    } else {
      setEditStatus(false);
      setDeliveryChecked({ checkedList: [], radio1: '0', radio2: '0' });
      setCurrentMall(data);
    }
    setModalVisiable(true);
  };

  // 弹窗确认
  const confirmOperate = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const {
          tabName,
          deliveryType: { checkedList, radio1, radio2 },
          openStatus
        } = value;
        const params = {} as any;
        params.tabName = tabName;
        params.openStatus = openStatus;
        params.deliveryTypeList = (() => {
          const list = [];
          checkedList.forEach((item) => {
            // if (item == 'box1') {
            //   list.push(`${radio1}`);
            // } else if (item == 'box3') {
            //   list.push(`${radio2}`);
            // } else {
            //   list.push(`${item}`);
            // }
            list.push(`${item}`);
          });
          return Array.from(new Set(list));
        })();
        setLoading(true);
        if (isEdit) {
          // 修改
          params['id'] = currentMall.id;
          editMall(params);
        } else {
          // 新增
          addNewMall(params);
        }
      }
    });
  };
  // 新增
  const addNewMall = (params) => {
    addMallData(params)
      .then((res) => {
        console.warn(res);
        setLoading(false);
        setModalVisiable(false);
        message.success('新增成功');
        init();
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
        message.error('新增失败');
      });
  };
  // 编辑
  const editMall = (params) => {
    editMallData(params)
      .then((res) => {
        console.warn(res);
        setLoading(false);
        setModalVisiable(false);
        message.success('修改成功');
        init();
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
        message.error('编辑失败');
      });
  };
  // 表格操作
  const mallOperation = (currentInfo, operateType) => {
    const { id } = currentInfo;
    // 启用
    if (operateType === 'start') {
      const params = { openStatus: 0, id };
      editMall(params);
    }
    // 停用
    if (operateType === 'stop') {
      const params = { openStatus: 1, id };
      editMall(params);
    }
    // 删除
    if (operateType === 'del') {
      const params = { delFlag: 1, id };
      editMall(params);
    }
  };
  // 修改排序
  const changeTableSort = (dragIndex, targetIndex) => {
    console.warn(dragIndex, targetIndex);
    let tableData = [...MallData];
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
    const sortIds = tableData.map((item, index) => {
      return { sortId: item.id, sort: index + 1 };
    });

    sortMarketData({ sorts: sortIds, type: 2 })
      .then((res) => {
        console.warn(res);
        // @ts-ignore
        if (res.res.code !== Const.SUCCESS_CODE) {
          message.error('操作失败');
          return;
        }
        message.success('操作成功');
        init();
      })
      .catch((err) => {
        message.error('操作失败', err);
      });
  };

  const { getFieldDecorator } = props.form;

  return (
    <div className="mall-classification-container">
      <p className="mall-classification-header">商城分类</p>
      <div className="mall-classification-operate">
        <Button
          type="primary"
          onClick={() => {
            openMallModal();
          }}
        >
          新增分类
        </Button>
      </div>
      {/* 商城分类列表 */}
      <div className="market-table">
        <DragTable
          rowKeyName={'id'}
          loading={tableLoading}
          dragColumns={mallColumns}
          dragData={MallData}
          pagination={pageParams}
          total={MallDataCount}
          changeData={(pageNum) => {
            changeDataPage(pageNum - 1);
          }}
          changeSort={(dragIndex, targetIndex) => {
            changeTableSort(dragIndex, targetIndex);
          }}
        />
      </div>
      {/* 新增/编辑弹窗 */}
      <Modal
        title={`${isEdit ? '编辑' : '新增'}商城分类`}
        width={600}
        visible={showModal}
        onOk={confirmOperate}
        confirmLoading={confirmLoading}
        destroyOnClose={true}
        onCancel={() => {
          setModalVisiable(false);
          setCurrentMall({});
        }}
      >
        <Form
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 20
          }}
          autoComplete="off"
        >
          <Form.Item style={{ marginBottom: 15 }} label="商城名称">
            {getFieldDecorator('tabName', {
              rules: [{ required: true, message: '请输入商城名称' }],
              initialValue: isEdit ? currentMall.tabName : ''
            })(<Input placeholder="请输入商城名称" />)}
          </Form.Item>
          <Form.Item label="配送方式">
            {getFieldDecorator('deliveryType', {
              initialValue: deliveryChecked,
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    const { checkedList, radio1, radio2 } = value;
                    if (checkedList.length == 0) {
                      return callback('请选择配送方式');
                    }
                    // if (checkedList.includes('box1') && radio1 == 0) {
                    //   return callback('请选择托运部或指定物流');
                    // }
                    // if (checkedList.includes('box3') && radio2 == 0) {
                    //   return callback('请选择快递到家或同城配送');
                    // }
                    return callback();
                  }
                }
              ]
            })(<DeliveryInputRef />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="状态">
            {getFieldDecorator('openStatus', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: isEdit ? currentMall.openStatus : ''
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
      {/* 商家列表 */}
      <MerchantListModal
        showAdd={showMerchantList}
        currentMallData={currentMall}
        hideModal={(isRefresh) => {
          if (isRefresh) {
            init();
          }
          setShowMerchantList(false);
        }}
      />
    </div>
  );
};

const mallClassificationTemplate = Form.create()(MallClassification);
export default mallClassificationTemplate;
