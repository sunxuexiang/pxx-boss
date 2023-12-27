import React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { Table } from 'antd';
import { IList } from 'typings/globalType';

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
      key: 'receivingSite',
      dataIndex: 'receivingSite',
      title: '收货站点'
    }
  ];
}
