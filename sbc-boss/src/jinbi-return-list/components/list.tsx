import * as React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { IList } from 'typings/globalType';

const { Column } = Table;

const PAUSEFLAG_STATUS = {
  1: '未开始',
  2: '进行中',
  3: '已结束',
  4: '已终止'
};

@withRouter
@Relax
export default class MarketingList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      checkedIds: IList;
      onSelect: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    checkedIds: 'checkedIds',
    onSelect: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      checkedIds,
      onSelect
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="activityId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '40', '60', '80', '100'],
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          },
          onShowSizeChange: (_, pageSize) => {
            init({ pageNum: 0, pageSize });
          }
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds.toJS(),
          onChange: (checkedRowKeys) => {
            onSelect(checkedRowKeys);
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="活动名称"
          width="20%"
          key="activityName"
          dataIndex="activityName"
          render={(activityName) => {
            return activityName ? (
              <div className="line-two">{activityName}</div>
            ) : (
              <span>-</span>
            );
          }}
        />

        <Column
          title="活动类型"
          key="subType"
          width="15%"
          dataIndex="subType"
          render={() => {
            return '指定商品返鲸币';
          }}
        />

        <Column
          title={<p>开始/结束时间</p>}
          width="15%"
          render={(rowData) => {
            return (
              <div>
                {moment(rowData['startTime'])
                  .format(Const.TIME_FORMAT)
                  .toString()}
                <br />
                {moment(rowData['endTime'])
                  .format(Const.TIME_FORMAT)
                  .toString()}
              </div>
            );
          }}
        />

        <Column
          title="店铺名称"
          dataIndex="storeName"
          key="storeName"
          width="25%"
        />

        <Column
          title="活动状态"
          width="15%"
          key="pauseFlag"
          render={(rowInfo) => {
            return <span>{PAUSEFLAG_STATUS[rowInfo['pauseFlag']]}</span>;
          }}
        />

        <Column
          title="操作"
          width="10%"
          className={'operation-th'}
          render={(rowInfo) => {
            return (
              <div className="operation-box">
                <AuthWrapper functionName="f_jinbi_return_details">
                  <a
                    style={{ marginRight: 10 }}
                    href="javascript:void(0)"
                    onClick={() => {
                      history.push({
                        pathname: `/jinbi-return-details/${
                          rowInfo['activityId']
                        }/${currentPage > 0 ? currentPage - 1 : currentPage}`
                      });
                    }}
                  >
                    查看
                  </a>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
