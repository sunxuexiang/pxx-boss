import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { Modal, Table } from 'antd';
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
      onChangeStatus: Function;
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
    onChangeStatus: noop,
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
      checkedIds,
      onSelect,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds.toJS(),
          onChange: (checkedRowKeys) => {
            onSelect(checkedRowKeys);
          }
        }}
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
      key: 'bannerName',
      dataIndex: 'bannerName',
      title: '轮播名称'
    },
    {
      key: 'oneCateName',
      dataIndex: 'oneCateName',
      title: '一级分类名称'
    },
    {
      key: 'bannerSort',
      dataIndex: 'bannerSort',
      title: '排序号'
    },

    {
      key: 'isShow',
      dataIndex: 'isShow',
      title: '状态',
      render: (data) => <p>{data == 0 ? '显示' : '隐藏'}</p>
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
        <AuthWrapper functionName={'f_banner_admin'}>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo.id)}>
            编辑
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_banner_admin'}>
          <a style={styles.edit} onClick={() => this._onDelete(rowInfo.id)}>
            删除
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_banner_admin'}>
          {rowInfo.isShow == 0 ? (
            <a style={styles.edit} onClick={() => this._hidden(rowInfo.id)}>
              隐藏
            </a>
          ) : (
            <a style={styles.edit} onClick={() => this._show(rowInfo.id)}>
              显示
            </a>
          )}
        </AuthWrapper>
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

  _hidden = (id) => {
    const { onChangeStatus } = this.props.relaxProps;
    onChangeStatus(id, 1);
  };

  _show = (id) => {
    const { onChangeStatus } = this.props.relaxProps;
    onChangeStatus(id, 0);
  };
}
