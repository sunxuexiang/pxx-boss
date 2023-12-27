import React from 'react';
// import { Relax } from 'plume2';
import { Table,InputNumber } from 'antd';
// import {  noop } from 'qmkit';
import { IList } from 'typings/globalType';
const {Column}=Table;

// @Relax
export default class MergeBill extends React.Component<any, any> {
  props: {
    orderInfoList:IList
  };

  static relaxProps = {
    orderInfoList:'orderInfoList',
    // onOrderInfoList:noop
  };

  render() {
    // const {orderInfoList,onOrderInfoList}=this.props.relaxProps;
    return (
      <div>
       
        <Table
          rowKey="orderCode"
          // columns={this.columns}
          dataSource={this.props.orderInfoList.toJS()}
          size="small"
          bordered
          pagination={false}
        >
          <Column
              title="店铺名称"
              key="supplierName"
              align="center"
              render={(row) => {
                if(row.tid.includes('O')){
                  return '大白鲸'
                }else if(row.tid.includes('SP')){
                  return '拆箱散批'
                }else if(row.tid.includes('L')){
                  return '零售'
                }else {
                  return '未知'
                }
              }}
          />
          <Column
              title="订单编号"
              dataIndex="tid"
              key="tid"
              align="center"
          />
          <Column
              title="实收金额"
              dataIndex="returnPrice.totalPrice"
              key="totalPrice"
              align="center"
          />
          <Column
              title="退款金额"
              key="actualReturnPrice"
              align="center"
              render={(row) => {
                return row.returnPrice.applyPrice?row.returnPrice.applyPrice:row.returnPrice.totalPrice
              }}
          />
        </Table>
      </div>
    );
  }


}
