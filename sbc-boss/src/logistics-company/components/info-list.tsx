import React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
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
    onDelete: noop,
    onEdit: noop,
    queryPage: noop
  };

  render() {
    const { loading, total, pageSize, dataList, current, queryPage } =
      this.props.relaxProps;
    return (
      <Table
        rowKey="id"
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
      key: 'logisticsName',
      dataIndex: 'logisticsName',
      title: '物流公司名称'
    },
    {
      key: 'logisticsPhone',
      dataIndex: 'logisticsPhone',
      title: '物流公司电话'
    },
    {
      key: 'logisticsAddress',
      dataIndex: 'logisticsAddress',
      title: '物流公司地址'
    },
    /*{
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间',
      render: (time) => time ? Moment(time).format(Const.TIME_FORMAT).toString() : '-',
    },
    {
      key: 'deleteTime',
      dataIndex: 'deleteTime',
      title: '删除时间',
      render: (time) => time ? Moment(time).format(Const.TIME_FORMAT).toString() : '-',
    },*/
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
        {/*<AuthWrapper functionName={'f_xxx'}>*/}
        <a style={styles.edit} onClick={() => this._onEdit(rowInfo.id)}>
          编辑
        </a>
        {/*</AuthWrapper>*/}
        {/*<AuthWrapper functionName={'f_xxx'}>*/}
        <a onClick={() => this._onDelete(rowInfo.id)}>删除</a>
        {/*</AuthWrapper>*/}
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
