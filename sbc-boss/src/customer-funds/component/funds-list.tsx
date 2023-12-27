import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Const,AuthWrapper, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
import {Table} from 'antd'
import momnet from 'moment'

declare type IList = List<any>;
const { Column } = Table;

@Relax
export default class FundsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      sortedInfo: IMap;
      setFormField: Function;
      setSortedInfo: Function;
      checkSwapInputGroupCompact: Function;
      onSelect: Function;
      selected: IList;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    init: noop,
    sortedInfo: 'sortedInfo',
    setFormField: noop,
    setSortedInfo: noop,
    checkSwapInputGroupCompact: noop,
    selected: 'selected',
    onSelect: noop,
  };

  render() {
    const { dataList, init, pageSize, pageNum, total, selected, onSelect } = this.props.relaxProps;
    // const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    return (
      <DataGrid
        dataSource={dataList.toJS()}
        rowKey="customerId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
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
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
        />
        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
        />
        <Column
          title="联系人"
          key="contactName"
          dataIndex="contactName"
        />
        <Column
          title="联系方式"
          key="contactPhone"
          dataIndex="contactPhone"
        />
        <Column
          title="最近提现时间"
          key="applyTime"
          dataIndex="applyTime"
          render={(rowInfo) => {
            return rowInfo?momnet(rowInfo).format(Const.TIME_FORMAT):'-'
          }}
        />
        <Column
          title="当前鲸币"
          key="balance"
          dataIndex="balance"
        />
        <Column
          title="操作"
          key="option"
          render={(rowInfo) => {
            return (
              <AuthWrapper functionName="f_customer_funds_detail">
                <Link to={`/customer-funds-detail/${rowInfo.customerId}`}>
                  查看明细
                </Link>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }

  _handleOnChange = (pagination, _filters, sorter) => {
    let currentPage = pagination.current;
    const {
      init,
      setFormField,
      setSortedInfo,
      pageNum,
      checkSwapInputGroupCompact
    } = this.props.relaxProps;
    if (pageNum != currentPage - 1) {
      return;
    }
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    if (
      sorter.columnKey != sortedInfo.columnKey ||
      sorter.order != sortedInfo.order
    ) {
      currentPage = 1;
    }
    setFormField(
      'sortColumn',
      sorter.columnKey ? sorter.columnKey : 'createTime'
    );
    setFormField('sortRole', sorter.order === 'ascend' ? 'asc' : 'desc');
    setSortedInfo(sorter.columnKey, sorter.order);
    this.setState({ pageNum: currentPage - 1 });
    checkSwapInputGroupCompact();
    init();
  };
}
