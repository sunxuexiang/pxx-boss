import * as React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';
import { Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Detail from '../../recharge-list/components/detail';
import JingbiDetail from './detail';
import { timeStamp } from 'console';
declare type IList = List<any>;
const { Column } = Table;

const FUNDS_TYPE = {
  1: '分销佣金',
  2: '佣金提现',
  3: '邀新奖励',
  4: '佣金提成',
  5: '余额支付',
  6: '余额支付退款'
};

@Relax
export default class FundsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      setField: Function;
      onSelect: Function;
      selected: IList;
      orList: IList;
      list: IList;
      detailsVisible: boolean;
      onShowDetailsVisible: Function;
      currentData: any;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    orList: 'orList',
    list: 'list',
    init: noop,
    setField: noop,
    selected: 'selected',
    onSelect: noop,
    detailsVisible: 'detailsVisible',
    onShowDetailsVisible: noop,
    currentData: 'currentData'
  };

  state = {
    visible: false,
    currentRow: {}
  };

  render() {
    const {
      dataList,
      init,
      pageSize,
      pageNum,
      total,
      selected,
      onSelect,
      orList,
      list,
      detailsVisible,
      onShowDetailsVisible,
      currentData
    } = this.props.relaxProps;
    const { visible, currentRow } = this.state;
    return (
      <div>
        <DataGrid
          dataSource={dataList.toJS()}
          rowKey="customerFundsDetailId"
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selected.toJS(),
            onChange: (selectedRowKeys) => {
              onSelect(selectedRowKeys);
            }
          }}
          pagination={{
            pageSize,
            total,
            current: pageNum + 1,
            onChange: (currentPage, pageSize) => {
              init({ pageNum: currentPage - 1, pageSize: pageSize });
            }
          }}
        >
          <Column
            title="鲸币类型"
            dataIndex="budgetType"
            key="budgetType"
            render={(rowInfo) => {
              return <div>{rowInfo == 1 ? '扣除' : '获得'}</div>;
            }}
          />
          <Column
            title="鲸币明细"
            dataIndex="remark"
            key="remark"
            render={(rowInfo, row: any) => {
              if (orList.toJS().includes(rowInfo)) {
                let returnList = ['订单退款', '订单退款扣除'];
                if (returnList.includes(rowInfo)) {
                  return (
                    <Link
                      to={
                        row.activityType == 3
                          ? `/th_order-return-detail/${row.relationOrderId}`
                          : `/order-return-detail/${row.relationOrderId}`
                      }
                    >
                      {rowInfo}
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      to={
                        row.activityType == 3
                          ? `/th_order-detail/${row.relationOrderId}`
                          : `/order-detail/${row.relationOrderId}`
                      }
                    >
                      {rowInfo}
                    </Link>
                  );
                }
              } else if (['手动充值', '手动扣除'].includes(rowInfo)) {
                return (
                  <a onClick={() => onShowDetailsVisible(true, row)}>
                    {rowInfo}
                  </a>
                );
              } else if (
                ['指定商品返鲸币', '指定商品返鲸币退回'].includes(rowInfo)
              ) {
                return <a onClick={() => this.showDetails(row)}>{rowInfo}</a>;
              } else {
                return rowInfo;
              }
            }}
          />
          <Column
            title="相关单号"
            dataIndex="relationOrderId"
            key="relationOrderId"
            render={(rowInfo, row: any) => {
              let returnList = ['O', 'SP', 'L', 'NP', 'RP', 'RPK', 'R'];
              return returnList.some((item) =>
                row.relationOrderId.includes(item)
              )
                ? row.relationOrderId
                : '/';
            }}
          />
          <Column
            title="数量"
            dataIndex="dealPrice"
            key="dealPrice"
            render={(rowInfo, row) => {
              let data = row.budgetType == 1 ? '-' : '+';
              return data + rowInfo;
            }}
          />

          <Column
            title="时间"
            dataIndex="dealTime"
            key="dealTime"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          />
        </DataGrid>
        <Modal
          title="查看详情"
          visible={detailsVisible}
          footer={null}
          onCancel={() => {
            // setCurrentData({});
            // setDetailsVisible(false);
            onShowDetailsVisible(false, {});
          }}
        >
          <Detail item={currentData}></Detail>
        </Modal>
        <Modal
          title="查看详情"
          visible={visible}
          footer={null}
          destroyOnClose
          onCancel={() => {
            this.setState({
              visible: false,
              currentRow: {}
            });
          }}
        >
          <JingbiDetail item={currentRow}></JingbiDetail>
        </Modal>
      </div>
    );
  }

  showDetails = (val) => {
    this.setState({
      currentRow: val,
      visible: true
    });
  };

  // _handReceiptPaymentAmount = (fundsType, receiptPaymentAmount) => {
  //   let sign = '+';
  //   if (fundsType == 2 || fundsType == 5) {
  //     sign = '-';
  //   }
  //   return sign + '￥' + receiptPaymentAmount.toFixed(2);
  // };
}
