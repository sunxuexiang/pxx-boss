import * as React from 'react';
import { IMap, Relax } from 'plume2';
// import { fromJS } from 'immutable';
import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';
import { DataGrid, noop, AuthWrapper } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = DataGrid;

@withRouter
@Relax
export default class EvaluateList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      sortedInfo: IMap;
      setSortedInfo: Function;
      showStoreEvaluateModal: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    sortedInfo: 'sortedInfo',
    setSortedInfo: noop,
    showStoreEvaluateModal: noop
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
      showStoreEvaluateModal
    } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();

    return (
      <DataGrid
        loading={loading}
        rowKey="sumId"
        pagination={{
          current: currentPage,
          pageSize,
          total
        }}
        dataSource={dataList.toJS()}
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
      >
        <Column
          title="店铺名称"
          key="storeName"
          dataIndex="storeName"
          render={(storeName) => (storeName ? storeName : '-')}
        />
        <Column
          title="综合评分"
          key="sumCompositeScore"
          dataIndex="sumCompositeScore"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'sumCompositeScore' && sortedInfo.order
          }
          render={(score) => parseFloat(score).toFixed(2)}
        />
        <Column
          title="商品评分"
          key="sumGoodsScore"
          dataIndex="sumGoodsScore"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'sumGoodsScore' && sortedInfo.order
          }
          render={(score) => parseFloat(score).toFixed(2)}
        />
        <Column
          title="服务评分"
          key="sumServerScore"
          dataIndex="sumServerScore"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'sumServerScore' && sortedInfo.order
          }
          render={(score) => parseFloat(score).toFixed(2)}
        />
        <Column
          title="物流评分"
          key="sumLogisticsScoreScore"
          dataIndex="sumLogisticsScoreScore"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'sumLogisticsScoreScore' &&
            sortedInfo.order
          }
          render={(score) => parseFloat(score).toFixed(2)}
        />
        <Column title="订单数" key="orderNum" dataIndex="orderNum" />

        <DataGrid.Column
          title="操作"
          key="storeId"
          dataIndex="storeId"
          render={(storeId) => {
            return (
              <div>
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <span
                    style={styles.see}
                    onClick={() => showStoreEvaluateModal(storeId)}
                  >
                    查看
                  </span>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }

  _handleOnChange = (pagination, _filters, sorter) => {
    const { init, setSortedInfo } = this.props.relaxProps;
    let pageCurrent = pagination.current;

    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    if (sortedInfo) {
      if (
        sorter.columnKey != sortedInfo.columnKey ||
        sorter.order != sortedInfo.order
      ) {
        pageCurrent = 0;
      } else {
        pageCurrent = pageCurrent - 1;
      }
    } else {
      pageCurrent = pageCurrent - 1;
    }
    setSortedInfo(sorter.columnKey, sorter.order);
    init({ pageNum: pageCurrent, pageSize: pagination.pageSize });
  };
}

const styles = {
  see: {
    color: '#F56C1D',
    cursor: 'pointer'
  }
} as any;
