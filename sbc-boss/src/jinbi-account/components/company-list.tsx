import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Button } from 'antd';
import { withRouter } from 'react-router';
import { noop, history } from 'qmkit';
import { IMap } from 'typings/globalType';

@withRouter
@Relax
export default class CompanyList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      companyInfo: IMap;
      geCompanyList: Function;
    };
  };

  static relaxProps = {
    companyInfo: 'companyInfo',
    geCompanyList: noop
  };

  render() {
    const { companyInfo } = this.props.relaxProps;
    const dataList = companyInfo.get('dataList')
      ? companyInfo.get('dataList').toJS()
      : [];
    const columns = [
      {
        title: '店铺名称',
        dataIndex: 'customerAccount',
        key: 'customerAccount'
      },
      {
        title: '企业账号',
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
          if (!row.walletId) {
            return '-';
          }
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
        rowKey="customerAccount"
        pagination={{
          pageSize: companyInfo.get('pageSize'),
          current: companyInfo.get('current'),
          total: companyInfo.get('total')
        }}
        onChange={this.pageChange}
        loading={companyInfo.get('loading')}
      />
    );
  }

  //分页变化
  pageChange = ({ pageSize, current }) => {
    const { geCompanyList } = this.props.relaxProps;
    geCompanyList({ pageSize, pageNum: current - 1 });
  };

  showDetail = (walletId) => {
    history.push(`/jinbi-account-detail/company/${walletId}`);
  };
}
