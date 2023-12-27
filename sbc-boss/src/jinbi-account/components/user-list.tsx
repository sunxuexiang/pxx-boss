import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Button } from 'antd';
import { withRouter } from 'react-router';
import { noop, history } from 'qmkit';
import { IMap } from 'typings/globalType';

@withRouter
@Relax
export default class UserList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      userInfo: IMap;
      getUserList: Function;
    };
  };

  static relaxProps = {
    userInfo: 'userInfo',
    getUserList: noop
  };

  render() {
    const { userInfo } = this.props.relaxProps;
    const dataList = userInfo.get('dataList')
      ? userInfo.get('dataList').toJS()
      : [];
    const columns = [
      {
        title: '客户名称',
        dataIndex: 'customerAccount',
        key: 'customerAccount'
      },
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account'
      },
      {
        title: '鲸币余额',
        dataIndex: 'balance',
        key: 'balance'
      },
      {
        title: '最近获得时间',
        dataIndex: 'jtime',
        key: 'jtime'
      },
      {
        title: '获得金额',
        dataIndex: 'jmoney',
        key: 'jmoney'
      },
      {
        title: '最近扣除时间',
        dataIndex: 'htime',
        key: 'htime'
      },
      {
        title: '扣除金额',
        dataIndex: 'hmoney',
        key: 'hmoney'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, row) => {
          return (
            <Button type="link" onClick={() => this.showDetail(row.walletId)}>
              查看明细
            </Button>
          );
        }
      }
    ];
    return (
      <Table
        dataSource={dataList}
        columns={columns}
        rowKey="walletId"
        pagination={{
          pageSize: userInfo.get('pageSize'),
          current: userInfo.get('current'),
          total: userInfo.get('total')
        }}
        onChange={this.pageChange}
        loading={userInfo.get('loading')}
      />
    );
  }

  //分页变化
  pageChange = ({ pageSize, current }) => {
    const { getUserList } = this.props.relaxProps;
    getUserList({ pageSize, pageNum: current - 1 });
  };

  showDetail = (walletId) => {
    history.push(`/jinbi-account-detail/user/${walletId}`);
  };
}
