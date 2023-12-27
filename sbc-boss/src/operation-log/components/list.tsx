import React from 'react';
import { Relax } from 'plume2';
import { Pagination, Spin, Tooltip, Table } from 'antd';
import { List } from 'immutable';
import moment from 'moment';

import { Const, noop } from 'qmkit';

type TList = List<any>;

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;

      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',

    init: noop
  };

  render() {
    const { loading, total, pageSize, dataList, init, currentPage } =
      this.props.relaxProps;

    const columns = [
      {
        title: '操作人账号',
        dataIndex: 'opAccount',
        key: 'opAccount',
        width: '10%',
        render: (text) => text || '-'
      },
      {
        title: '操作人姓名',
        dataIndex: 'opName',
        key: 'opName',
        width: '10%',
        render: (text) => text || '-'
      },
      {
        title: '操作人Ip',
        dataIndex: 'opIp',
        key: 'opIp',
        width: '10%',
        render: (text) => text || '-'
      },
      {
        title: '操作时间',
        dataIndex: 'opTime',
        key: 'opTime',
        width: '15%',
        render: (text) =>
          text ? moment(text).format(Const.TIME_FORMAT).toString() : '-'
      },
      {
        title: '模块',
        dataIndex: 'opModule',
        key: 'opModule',
        width: '10%',
        render: (text) => text || '-'
      },
      {
        title: '操作类型',
        dataIndex: 'opCode',
        key: 'opCode',
        width: '10%',
        render: (text) => text || '-'
      },
      {
        title: '操作内容',
        dataIndex: 'opContext',
        key: 'opContext',
        width: '35%',
        render: (text) => {
          if (text && text.length > 20) {
            return (
              <Tooltip title={text}>
                <div className="line-two">{text}</div>
              </Tooltip>
            );
          }
          return text || '-';
        }
      }
    ];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={dataList ? dataList.toJS() : []}
          rowKey="id"
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (pageNum, pageSize) => {
              init({ pageNum: pageNum - 1, pageSize });
            },
            onShowSizeChange: (current, pageSize) => {
              init({ pageNum: current - 1, pageSize });
            }
          }}
          loading={loading}
        />
      </div>
    );
  }
}
