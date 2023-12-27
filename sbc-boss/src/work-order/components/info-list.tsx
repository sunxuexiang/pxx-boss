import React from 'react';
import { Relax } from 'plume2';
import { noop, AuthWrapper } from 'qmkit';
import { Modal, Table } from 'antd';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    // paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="workOrderId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        // rowSelection={{
        //   type: 'checkbox',
        //   selectedRowKeys: checkedIds.toJS(),
        //   onChange: (checkedRowKeys) => {
        //     onSelect(checkedRowKeys);
        //   }
        // }}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'customerName',
      dataIndex: 'customer.customerDetail.customerName',
      title: '客户名称'
    },
    {
      key: 'customerAccount',
      dataIndex: 'customer.customerAccount',
      title: '账号'
    },
    {
      key: 'workOrderNo',
      dataIndex: 'workOrderNo',
      title: '工单号'
    },
    {
      key: 'socialCreditCode',
      dataIndex: 'socialCreditCode',
      title: '企业信用代码'
    },
    {
      key: 'approvalCustomerId',
      dataIndex: 'customer.customerDetail.contactPhone',
      title: '联系方式'
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '工单状态',
      render: (type) => {
        if (type == 0) {
          return <span style={{ color: '#ea1a24' }}>待处理</span>;
        } else if (type == 1) {
          return <span style={{ color: '#3ee209' }}>已处理</span>;
        } else {
          return <span style={{ color: '#ea1a24' }}>-</span>;
        }
      }
    },
    {
      key: 'accountMergeStatus',
      dataIndex: 'accountMergeStatus',
      title: '账号合并',
      render: (type) => {
        if (type == 0) {
          return <span style={{ color: '#ea1a24' }}>待合并</span>;
        } else if (type == 1) {
          return <span style={{ color: '#3ee209' }}>已合并</span>;
        } else {
          return <span style={{ color: '#ea1a24' }}>-</span>;
        }
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (_text, _rowData: any, index) => {
        const statusFlag = _rowData.status;
        const merge = _rowData.accountMergeStatus;
        return statusFlag === 0 ? (
          <div>
            <Link
              to={{
                pathname: `/work-details/${_rowData.workOrderId}`,
                state: { checkFlag: false }
              }}
            >
              处理工单
            </Link>
          </div>
        ) : (
          <div>
            {merge === 1 ? (
              <div>
                <AuthWrapper functionName="f_work_order_d">
                  <Link
                    to={{
                      pathname: `/work-details/${_rowData.workOrderId}`,
                      state: { checkFlag: true }
                    }}
                  >
                    查看
                  </Link>
                </AuthWrapper>
              </div>
            ) : (
              <div>
                <AuthWrapper functionName="f_work_order_d">
                  <Link
                    to={{
                      pathname: `/work-details/${_rowData.workOrderId}`,
                      state: { checkFlag: true }
                    }}
                  >
                    查看
                  </Link>
                </AuthWrapper>
                &nbsp;&nbsp;
                <a
                  style={styles.edit}
                  onClick={() => this._onEdit(_rowData.workOrderId)}
                >
                  合并账号
                </a>
              </div>
            )}
          </div>
        );
      }
    }
    // {
    //   key: 'option',
    //   title: '操作',
    //   render: (rowInfo) => this._getOption(rowInfo)
    // }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <a
          style={styles.edit}
          onClick={() => this._onEdit(rowInfo.workOrderId)}
        >
          编辑
        </a>
        <a onClick={() => this._onDelete(rowInfo.workOrderId)}>删除</a>
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
}
