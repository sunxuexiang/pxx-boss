import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { withRouter } from 'react-router';
import { noop } from 'qmkit';
import { IMap } from 'typings/globalType';
import { orList, oldOrList, modalList } from './optionsList';
import ApplyDetail from './applyDetail';
import JingbiDetail from './detail';

@withRouter
@Relax
export default class AccountList extends React.Component<any, any> {
  props: {
    type?: string;
    relaxProps?: {
      dataList: IMap;
      current: number;
      pageSize: number;
      total: number;
      loading: boolean;
      getList: Function;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    current: 'current',
    pageSize: 'pageSize',
    total: 'total',
    loading: 'loading',
    getList: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentRow: '',
      applyVisible: false,
      applyItem: ''
    };
  }

  render() {
    const { visible, currentRow, applyVisible, applyItem } = this.state;
    const { type } = this.props;
    const { dataList, current, pageSize, total, loading } =
      this.props.relaxProps;
    const list = dataList ? dataList.toJS() : [];
    let companyCol = [];
    if (type === 'company') {
      companyCol.push({
        title: '用户账号',
        dataIndex: 'customerAccount',
        key: 'customerAccount'
      });
    }
    const columns = [
      {
        title: '金额类型',
        dataIndex: 'budgetType',
        key: 'budgetType',
        render: (text) => {
          if (text === 0) {
            return '获得';
          }
          if (text === 1) {
            return '扣除';
          }
          return '-';
        }
      },
      {
        title: '明细类型',
        dataIndex: 'remark',
        key: 'remark',
        render: (text, row) => {
          if ([...orList, ...oldOrList].includes(text)) {
            if (
              [
                '订单退款',
                '订单退款扣除',
                '鲸币抵扣退还',
                '订单返运费退还'
              ].includes(text)
            ) {
              if (
                text === '订单退款' &&
                row.relationOrderId.substr(0, 2) === 'LP'
              ) {
                return text;
              }
              return (
                <Link
                  to={
                    row.activityType == 3
                      ? `/th_order-return-detail/${row.relationOrderId}`
                      : `/order-return-detail/${row.relationOrderId}`
                  }
                >
                  {text}
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
                  {text}
                </Link>
              );
            }
          } else if (
            ['指定商品返鲸币', '指定商品返鲸币退回', ...modalList].includes(
              text
            )
          ) {
            return <a onClick={() => this.showDetails(row)}>{text}</a>;
          } else if (['手动充值', '手动扣除'].includes(text)) {
            return <a onClick={() => this.showApplyDetails(row)}>{text}</a>;
          } else {
            return text;
          }
        }
      },
      ...companyCol,
      {
        title: '鲸币数量',
        dataIndex: 'dealPrice',
        key: 'dealPrice'
      },
      {
        title: '明细时间',
        dataIndex: 'dealTime',
        key: 'dealTime',
        render: (text) =>
          text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        title: '备注',
        dataIndex: 'remarkDetail',
        key: 'remarkDetail'
      },
      {
        title: '相关单号',
        dataIndex: 'relationOrderId',
        key: 'relationOrderId'
      }
    ];
    return (
      <div>
        <Table
          dataSource={list}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize,
            current,
            total
          }}
          onChange={this.pageChange}
          loading={loading}
        />
        <Modal
          title="查看详情"
          visible={applyVisible}
          footer={null}
          onCancel={() => {
            this.setState({ applyVisible: false, applyItem: '' });
          }}
        >
          <ApplyDetail item={applyItem} />
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

  //分页变化
  pageChange = ({ pageSize, current }) => {
    const { getList } = this.props.relaxProps;
    getList({ pageSize, pageNum: current - 1 });
  };

  showDetails = (row) => {
    this.setState({ visible: true, currentRow: row });
  };

  showApplyDetails = (item) => {
    this.setState({ applyVisible: true, applyItem: item });
  };
}
