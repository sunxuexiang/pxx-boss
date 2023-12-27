import React, { Component } from 'react';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { Relax } from 'plume2';

const { Column } = DataGrid;

@Relax
export default class list extends React.Component<any, any> {
  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    startList: 'startList',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop,
    onchangeStart: noop,
  };
  render() {
    const { pageSize, pageNum, startList, init, total } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.advertisingId}
        dataSource={startList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title='单号'
          dataIndex="orderId"
          key='orderId'
        />
        <Column
          title='客户名称'
          dataIndex="orderId"
          key='orderId'
        />
        <Column
          title='客户账户'
          dataIndex="orderId"
          key='orderId'
        />
        <Column
          title='时间'
          dataIndex="orderId"
          key='orderId'
        />
        <Column
          title='调账金额'
          dataIndex="orderId"
          key='orderId'
        />
        <Column
          title='操作人'
          dataIndex="orderId"
          key='orderId'
        />
        <Column
          title='备注'
          dataIndex="orderId"
          key='orderId'
        />

      </DataGrid>
    )
  }
}
