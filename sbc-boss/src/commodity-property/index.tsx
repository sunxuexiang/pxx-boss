import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm, Modal, Form, Input, message } from 'antd';
import './commodity-property.less';
import {
  getPropertyData,
  addGoodsAttribute,
  editGoodsAttribute,
  delGoodsAttribute
} from './webapi';
import moment from 'moment';

const CommodityProperty = (props) => {
  // 属性表头
  const columns = [
    {
      title: '属性类型',
      align: 'center' as 'center',
      dataIndex: 'attribute',
      key: 'attribute'
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
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        return (
          <div className="market-table-btn">
            <Button
              type="link"
              onClick={() => {
                openModal(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              placement="topRight"
              title={'确认删除该条数据？'}
              onConfirm={() => {
                delProperty(record);
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
  // 表格加载loading
  const [tableLoading, setTableLoading] = useState(false);
  // 商品属性表格数据
  const [propertyData, setPropertyData] = useState([]);
  // 总数
  const [tableTotal, setTableTotal] = useState(0);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 弹窗显示
  const [showModal, setShowModal] = useState(false);
  // 是否编辑
  const [isEdit, setEdit] = useState(false);
  // 弹窗按钮loading
  const [confirmLoading, setModalLoading] = useState(false);
  // 当前编辑数据
  const [currentData, setCurrentData] = useState({} as any);
  // 初始化
  useEffect(() => {
    initTable();
  }, [pageParams]);
  // 获取商品属性数据
  const initTable = () => {
    setTableLoading(true);
    getPropertyData(pageParams).then((data) => {
      console.warn(data);
      setPropertyData(data.res.context.attributeVos.content);
      setTableTotal(data.res.context.attributeVos.total);
      setTableLoading(false);
    });
  };
  // 翻页
  const changePageParams = (pageNum) => {
    changePage({ ...pageParams, pageNum });
  };
  // 打开弹窗
  const openModal = (data = null) => {
    if (data) {
      setEdit(true);
      setCurrentData(data);
    } else {
      setEdit(false);
    }
    setShowModal(true);
  };
  // 弹窗操作
  const confirmOperate = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        console.log('Received values of form: ', value);
        setModalLoading(true);
        const { attribute } = value;
        if (isEdit) {
          // 修改
          const params = { attribute, attributeId: currentData.attributeId };
          editProperty(params);
        } else {
          // 新增
          addNewProperty(value);
        }
      }
    });
  };
  // 新增属性
  const addNewProperty = (params) => {
    setModalLoading(true);
    addGoodsAttribute(params)
      .then((res) => {
        console.warn(res);
        message.success('新增成功');
        props.form.resetFields();
        setModalLoading(false);
        setShowModal(false);
        setCurrentData({});
        initTable();
      })
      .catch((err) => {
        console.warn(err);
        message.error('新增失败');
        setModalLoading(false);
        setShowModal(false);
        setCurrentData({});
      });
  };
  // 修改属性
  const editProperty = (params) => {
    setModalLoading(true);
    editGoodsAttribute(params)
      .then((res) => {
        console.warn(res);
        message.success('编辑成功');
        props.form.resetFields();
        setModalLoading(false);
        setShowModal(false);
        initTable();
      })
      .catch((err) => {
        console.warn(err);
        message.error('编辑失败');
        setModalLoading(false);
        setShowModal(false);
      });
  };
  // 删除
  const delProperty = (data) => {
    const { attributeId, attribute } = data;
    delGoodsAttribute({ attributeId, attribute })
      .then((res) => {
        console.warn(res);
        message.success('删除成功');
        initTable();
      })
      .catch((err) => {
        console.warn(err);
        message.success('删除失败');
      });
  };
  const { getFieldDecorator } = props.form;
  return (
    <div className="commodity-property-container">
      <p className="commodity-property-header">商品属性</p>
      <div className="commodity-property-operate">
        <Button
          type="primary"
          onClick={() => {
            openModal();
          }}
        >
          新增
        </Button>
      </div>
      {/* 商品属性列表 */}
      <div className="commodity-property-table">
        <Table
          loading={tableLoading}
          columns={columns}
          dataSource={propertyData}
          pagination={{
            current: pageParams.pageNum + 1,
            pageSize: pageParams.pageSize,
            total: tableTotal,
            onChange: (pageNum) => {
              changePageParams(pageNum - 1);
            }
          }}
          rowKey={(record: any) => record.attributeId}
        />
      </div>
      {/* 新增、编辑弹窗 */}
      <Modal
        title={`${isEdit ? '新增属性类型' : '编辑属性类型'}`}
        width={500}
        visible={showModal}
        onOk={confirmOperate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setShowModal(false);
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
          <Form.Item style={{ marginBottom: 15 }} label="属性类型">
            {getFieldDecorator('attribute', {
              rules: [{ required: true, message: '请输入属性类型' }],
              initialValue: isEdit ? currentData.attribute : ''
            })(<Input placeholder="请输入属性类型" />)}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const CommodityPropertyTemplate = Form.create()(CommodityProperty);

export default CommodityPropertyTemplate;
