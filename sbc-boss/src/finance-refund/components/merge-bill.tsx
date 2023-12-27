import React from 'react';
import { Relax } from 'plume2';
import { Table, InputNumber } from 'antd';
import { noop } from 'qmkit';
import { IList } from 'typings/globalType';
const { Column } = Table;

@Relax
export default class MergeBill extends React.Component<any, any> {
  props: {
    form?: any;
    type?: any;
    relaxProps?: {
      orderInfoList: IList;
      onOrderInfoList: Function;
    };
  };

  static relaxProps = {
    orderInfoList: 'orderInfoList',
    onOrderInfoList: noop
  };

  render() {
    const { orderInfoList, onOrderInfoList } = this.props.relaxProps;
    return (
      <div>
        <div style={{ color: '#000', padding: '3px 0' }}>
          合并支付订单明细：
        </div>
        <Table
          rowKey="orderCode"
          // columns={this.columns}
          dataSource={orderInfoList.toJS()}
          size="small"
          bordered
          pagination={false}
        >
          <Column
            title="店铺名称"
            key="supplierName"
            align="center"
            render={(row, t, index) => {
              if (row.tids[index].includes('O')) {
                return '大白鲸';
              } else if (row.tids[index].includes('SP')) {
                return '拆箱散批';
              } else if (row.tids[index].includes('L')) {
                return '零售';
              } else {
                return '未知';
              }
            }}
          />
          <Column
            title="订单编号"
            dataIndex="tids"
            key="tids"
            align="center"
            render={(row, val, index) => {
              return row[index];
            }}
          />
          <Column
            title="应收金额"
            dataIndex="returnPrice"
            key="returnPrice"
            align="center"
          />
        </Table>
        <div style={{ color: '#000' }}>
          应收总金额：{' '}
          <span style={{ color: '#F56C1D' }}>
            ¥{' '}
            {orderInfoList
              .toJS()
              .map((item) => item.returnPrice)
              .reduce((total, num) => total + num)
              .toFixed(2)}
          </span>
        </div>
      </div>
    );
  }
}
