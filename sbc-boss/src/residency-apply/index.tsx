import React, { useState, useEffect } from 'react';
import './residency-apply.less';
import { Form, Input, Button, Table, Select, DatePicker } from 'antd';
import { SelectGroup } from 'qmkit';
import moment from 'moment';
import ApplyDeal from './components/apply-deal';
import { getApplyList } from './webapi';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ResidencyApply = (props) => {
  // 表头
  const applyColumns = [
    {
      title: '商家名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'merchantName',
      key: 'merchantName'
    },
    {
      title: '公司名称',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'companyName',
      key: 'companyName'
    },
    {
      title: '商家电话',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'merchantPhone',
      key: 'merchantPhone'
    },
    {
      title: '商家地址',
      width: 300,
      align: 'center' as 'center',
      dataIndex: 'merchantAddress',
      key: 'merchantAddress'
    },
    {
      title: '状态',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'handleFlag',
      key: 'handleFlag',
      render: (handleFlag) => {
        return handleFlag === 0 ? '未处理' : '已处理';
      }
    },
    {
      title: '申请时间',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) => {
        return moment(createTime).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '处理人',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'contactPerson',
      key: 'contactPerson'
    },
    {
      title: '处理时间',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (updateTime) => {
        return updateTime
          ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      }
    },
    {
      title: '备注',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '操作',
      width: 100,
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        if (record.handleFlag === 0) {
          return (
            <Button
              type="link"
              onClick={() => {
                showApplyModal(record);
              }}
            >
              去处理
            </Button>
          );
        } else {
          return '-';
        }
      }
    }
  ];
  // 入驻申请表格数据
  const [applyData, setApplyData] = useState([]);
  // 分页参数
  const [pageParams, changePage] = useState({
    pageNum: 0,
    pageSize: 10
  });
  // 分页参数
  const [tableTotal, setTotal] = useState(0);
  // 推荐商家loading
  const [tableLoading, setTableLoading] = useState(false);
  // 处理弹窗显示
  const [showDeal, setDealShow] = useState(false);
  const [currentData, setData] = useState({});
  const { getFieldDecorator } = props.form;
  // 初始化
  useEffect(() => {
    getApplyData();
  }, [pageParams]);
  // 获取申请列表
  const getApplyData = (params = {}) => {
    setTableLoading(true);
    getApplyList({ ...pageParams, ...params })
      .then((data) => {
        console.warn(data);
        setTableLoading(false);
        setApplyData(data.res.context.content);
        setTotal(data.res.context.totalElements);
      })
      .catch((err) => {
        console.warn(err);
        setTableLoading(false);
      });
  };
  // 翻页
  const changeTablePage = (pageNum) => {
    changePage({ ...pageParams, pageNum });
  };
  // 搜索
  const searchApply = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      console.warn(value);
      const { handleFlag, merchantName, merchantPhone } = value;
      const params = { handleFlag, merchantName, merchantPhone };
      if (value.applyDate) {
        params['createTimeBegin'] =
          moment(value.applyDate[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
        params['createTimeEnd'] =
          moment(value.applyDate[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
      }
      getApplyData(params);
    });
  };
  // 处理申请弹窗显示
  const showApplyModal = (data) => {
    setDealShow(true);
    setData(data);
  };
  return (
    <div className="residency-apply-container">
      <p className="residency-apply-header">入驻申请</p>
      {/* 搜索区域 */}
      <div className="residency-apply-operate">
        <Form autoComplete="off" layout="inline">
          <Form.Item>
            {getFieldDecorator('merchantName', {
              initialValue: ''
            })(<Input addonBefore="商家名称" placeholder="请输入商家名称" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('merchantPhone', {
              initialValue: ''
            })(<Input addonBefore="商家电话" placeholder="请输入商家电话" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('handleFlag')(
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="状态"
                placeholder="请选择状态"
              >
                <Select.Option value={0}>未处理</Select.Option>
                <Select.Option value={1}>已处理</Select.Option>
              </SelectGroup>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('applyDate', {
              initialValue: ''
            })(<RangePicker placeholder={['申请开始时间', '申请结束时间']} />)}
          </Form.Item>
          <Button type="primary" onClick={searchApply}>
            搜索
          </Button>
        </Form>
      </div>
      {/* 商家列表 */}
      <div className="residency-apply-table">
        <Table
          rowKey={(record: any) => record.applicationId}
          loading={tableLoading}
          columns={applyColumns}
          dataSource={applyData}
          pagination={{
            current: pageParams.pageNum + 1,
            pageSize: pageParams.pageSize,
            total: tableTotal,
            onChange: (pageNum) => {
              changeTablePage(pageNum - 1);
            }
          }}
        />
      </div>
      {/* 添加商家弹窗 */}
      <ApplyDeal
        show={showDeal}
        hideDeal={() => {
          setDealShow(false);
          getApplyData();
        }}
        dealInfo={currentData}
      />
    </div>
  );
};
const ResidencyApplyTemplate = Form.create()(ResidencyApply);

export default ResidencyApplyTemplate;
