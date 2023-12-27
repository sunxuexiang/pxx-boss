import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, AuthWrapper } from 'qmkit';
import { Popconfirm, Table, Modal } from 'antd';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
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
      cateList: IList;
      sourceCateList: IList;
      onVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop,
    onVisible: noop,
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
        rowKey="biddingId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
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
      title: '主播姓名',
      key: 'hostName',
      dataIndex: 'hostName',

    },
    {
      title: '联系方式',
      key: 'contactPhone',
      dataIndex: 'contactPhone',
    },
    {
      title: '主播类型',
      key: 'hostType',
      dataIndex: 'hostType',
      render: (hostType) => {
        return hostType == 1
            ? '入驻'
            : '官方'
      }
    },
    {
      title: '主播账号(APP)',
      key: 'customerAccount',
      dataIndex: 'customerAccount',
    },
    {
      title: '运营人员',
      key: 'accountName',
      dataIndex: 'accountName',
    },
    {
      key: 'workingState',
      dataIndex: 'workingState',
      title: '在职状态',
      render: (workingState) => {
        return workingState == 1
            ? '在职'
            : '离职'
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_host_management_edit'}>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo)}>
            编辑
        </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_host_management_open'}>
          {rowInfo.workingState == 0 ? (
        <a style={styles.edit} onClick={() => this._onVisible(rowInfo.hostId)}>重新启用</a>):''}
        </AuthWrapper>

        <AuthWrapper functionName={'f_host_management_delete'}>
          {
            rowInfo.workingState == 0 ?<a onClick={() => this._onDelete(rowInfo.hostId)}>删除</a>:null
          }
          
        </AuthWrapper>
      </div>
    );
  };
  /**
   * 编辑信息
   */
  _onEdit = (rowInfo) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(rowInfo);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确定要删除选中主播吗?',
      onOk() {
        onDelete(id);
      },
      onCancel() { }
    });
  };
  /**
   * 启用/禁用
   */
  _onVisible = (id) => {
    const { onVisible } = this.props.relaxProps;
    onVisible(id);
  };
}


