import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, AuthWrapper } from 'qmkit';
import { Popconfirm, Table } from 'antd';
import Moment from 'moment';
import { Link } from 'react-router-dom';
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
      cateList: IList;
      sourceCateList: IList;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
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
        rowKey="biddingId"
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
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      render: (_text, _rowData: any, index) => {
        return index + 1;
      },
      width: 80
    },
    {
      key: 'keywords',
      title: '关键词',
      render: (_text, _rowData: any) => {
        const keywords = _rowData.keywords;
        if (_rowData.biddingType) {
          const { sourceCateList } = this.props.relaxProps;
          const selectCateList = keywords.split(',');
          const cates = sourceCateList.filter(
            (c) => selectCateList.filter((s) => s == c.get('cateId')).length > 0
          );
          const showKeywords = cates.toJS().map((c) => {
            return c.cateName;
          });
          return <span style={Styles.text}>{showKeywords.toString()}</span>;
        } else {
          return <span style={Styles.text}>{keywords}</span>;
        }
      }
    },
    {
      key: 'time',
      title: '活动时间',
      render: (_text, _rowData: any) => {
        const startTime = _rowData.startTime;
        const endTime = _rowData.endTime;
        const start = startTime
          ? Moment(startTime)
              .format(Const.DAY_FORMAT)
              .toString()
          : '-';
        const end = endTime
          ? Moment(endTime)
              .format(Const.DAY_FORMAT)
              .toString()
          : '-';
        return start + '~' + end;
      }
    },
    {
      key: 'biddingStatus',
      dataIndex: 'biddingStatus',
      title: '状态',
      render: (biddingStatus) => {
        return biddingStatus
          ? biddingStatus == 1
            ? '进行中'
            : '已失效'
          : '未开始';
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    const { onDelete } = this.props.relaxProps;
    return (
      <div>
        <AuthWrapper functionName={'f_bidding_delete'}>
          {rowInfo.biddingStatus == 0 && (
            <Popconfirm
              title="确定删除该活动？"
              onConfirm={() => onDelete(rowInfo.biddingId)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">删除</a>
            </Popconfirm>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </AuthWrapper>
        <AuthWrapper functionName={'f_bidding_edit'}>
          {!rowInfo.biddingStatus && (
            <Link
              to={{
                pathname: `/bidding-add/${rowInfo.biddingId}`,
                state: { biddingType: rowInfo.biddingType }
              }}
            >
              编辑
            </Link>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </AuthWrapper>
        <AuthWrapper functionName={'f_bidding_find'}>
          <Link
            to={{
              pathname: `/bidding-detail/${rowInfo.biddingId}`,
              state: { biddingType: rowInfo.biddingType }
            }}
          >
            查看
          </Link>
        </AuthWrapper>
      </div>
    );
  };
}

const Styles = {
  text: {
    width: 300,
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
