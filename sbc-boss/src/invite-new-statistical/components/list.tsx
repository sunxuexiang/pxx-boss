import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, Const } from 'qmkit';
import { Table } from 'antd';
declare type IList = List<any>;
const { Column } = Table;

@withRouter
@Relax
export default class InviteNewRecordList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      searchParams: IMap;
      selected: IList;
      onSelect: Function;
      onDetails:Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    searchParams: 'searchParams',
    selected: 'selected',
    onSelect: noop,
    onDetails:noop,
  };

  componentWillMount() {
    this.setState({
      tooltipVisible: {},
      rejectDomVisible: false
    });
  }

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      searchParams,
      selected,
      onSelect,
      onDetails
    } = this.props.relaxProps;

    const key = searchParams.get('isRewardRecorded');

    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        rowKey="recordId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="邀请用户"
          key="customerAccount"
          dataIndex="customerAccount"
         
        />

        <Column
          title="邀请人数（注册人数）"
          key="inviteCount"
          dataIndex="inviteCount"
         
        />

       

        <Column
          title="用户明细"
          key="firstOrderTime1"
          render={(row) =>{
            return (
              <div>
                <a onClick={() => onDetails(row)}>
                    详情
                </a>
              </div>
            )
          }}
        />

        
      </DataGrid>
    );
  }
  /**
   * 奖励
   */
  _renderReward = (text, rowData) => {
    let show = text;
    if (rowData.rewardFlag == 0) {
      if (rowData.rewardCash) {
        show = '￥' + rowData.rewardCash.toFixed(2);
      } else {
        show = '-';
      }
    } else {
      if (rowData.rewardCoupon && rowData.rewardCoupon.length > 20) {
        show = `${rowData.rewardCoupon.substring(0, 20)}...`;
      } else {
        show = rowData.rewardCoupon;
      }
    }
    return show;
  };

  /**
   * 预计奖励
   */
  _renderSettingReward = (text, rowData) => {
    let show = text;
    if (rowData.rewardFlag == 0) {
      if (rowData.settingAmount) {
        show = '￥' + rowData.settingAmount.toFixed(2);
      } else {
        show = '-';
      }
    } else {
      if (rowData.settingCoupons && rowData.settingCoupons.length > 20) {
        show = `${rowData.settingCoupons.substring(0, 20)}...`;
      } else {
        show = rowData.settingCoupons;
      }
    }
    return show;
  };
  /**
   * 手机号隐藏
   */
  _hideAccount = (account) => {
    return account && account.length > 0
      ? account.substring(0, 3) + '****' + account.substring(7, account.length)
      : '';
  };
}

const styles = {
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
