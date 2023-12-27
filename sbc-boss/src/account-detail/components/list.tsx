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
    dataList: 'dataList',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop,
    onchangeStart: noop,
    isVisibleBut: noop
  };
  render() {
    const { pageSize, pageNum, dataList, init, total,isVisibleBut } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.advertisingId}
        dataSource={dataList.toJS()}
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
          title='流水号'
          dataIndex="recordNo"
          key='recordNo'
        />
        <Column
          title='交易时间'
          dataIndex="dealTime"
          key='dealTime'
        />
        <Column
          title='客户名称'
          dataIndex="customerName"
          key='customerName'
        />
        <Column
          title='客户账户'
          dataIndex="customerAccount"
          key='customerAccount'
        />
        <Column
          title='关联订单编号'
          dataIndex="relationOrderId"
          key='relationOrderId'
        />
        <Column
          title='交易类型'
          dataIndex="tradeTypevalue"
          key='tradeTypevalue'
          
          // render={(value) => {
          //   if(value.tradeType == 0) {
          //     return '充值'
          //   }else if(value.tradeType == 1) {
          //     return '提现'
          //   }else if(value.tradeType == 2) {
          //     return '余额支付'
          //   }else if(value.tradeType == 3) {
          //     return '购物返现'
          //   }else if(value.tradeType == 4) {
          //     return '调账'
          //   }else if(value.tradeType == 5) {
          //     return '退款'
          //   }else if(value.tradeType == 6) {
          //     return '撤销申请'
          //   }else if(value.tradeType == 7) {
          //     return '驳回'
          //   }else if(value.tradeType == 8) {
          //     return '失败'
          //   }
          // }}
        />
        <Column
          title='收支类型'
          render={(value) => {
            return value.budgetType == 0 ? '收入' : '支出'
          }}
        />
        <Column
          title='交易金额'
          dataIndex="dealPrice"
          key='dealPrice'
        />
        <Column
          title='剩余余额'
          dataIndex="balance"
          key='balance'
        />
        <Column
          title='操作'
          render={(record) => {
            return (
              <div className="operation-box">
                <a
                  href="javascript:void(0);"
                  onClick={() => isVisibleBut(true, record)}
                >
                  查看
                </a></div >
            )
          }}
        />

      </DataGrid>
    )
  }
}
