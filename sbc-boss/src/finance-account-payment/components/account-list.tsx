import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Modal, Popconfirm } from 'antd';
import { DataGrid, noop, checkAuth, AuthWrapper } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = Table;
const confirm = Modal.confirm;

@Relax
export default class AccountList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      onEnable: Function;
      onDisable: Function;
      onDelete: Function;
      onEdit: Function;
      initOffLineAccounts: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    init: noop,
    onEnable: noop,
    onDisable: noop,
    onDelete: noop,
    onEdit: noop,
    initOffLineAccounts: noop
  };

  // componentWillMount() {
  //   const { initOffLineAccounts } = this.props.relaxProps;

  //   initOffLineAccounts();
  // }

  render() {
    const { loading, dataList } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        dataSource={dataList.toJS()}
        rowKey={'withdrawId'}
      >
        <Column title="账户名称" dataIndex="accountName" key="accountName" />
        <Column title="账号" dataIndex="bankAccount" key="bankAccount" />
        <Column title="开户行名称" dataIndex="bankName" key="bankName" />
        <Column title="开户行联行号" dataIndex="bankNo" key="bankNo"  />
        <Column
          title="状态"
          dataIndex="enableStatus"
          key="enableStatus" 
          render={(status) => (status ? '启用' : '禁用')}
        />
        <Column
          title="操作"
          key="action"
          render={(rowInfo) => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { onEnable, onDisable, onEdit } = this.props.relaxProps;

    let hasMenu =
      checkAuth('f_finance_account_payment_edit') ||
      checkAuth('f_finance_account_payment_state') ||
      checkAuth('f_finance_account_payment_del');

    return hasMenu ? (
      <div>
        <AuthWrapper functionName="f_finance_account_payment_edit">
            <a href="javascript:;" style={{margin:'0 4px'}} onClick={() => onEdit(rowInfo.withdrawId)}>
              编辑
            </a>
          </AuthWrapper>
        <AuthWrapper functionName="f_finance_account_payment_state">
            {rowInfo.enableStatus ? (
              <Popconfirm
              title="是否确认禁用此收款账户？"
              onConfirm={() => {
                onDisable(rowInfo.withdrawId);
              }}
              okText="确定"
              cancelText="取消"
              >
              <a href="javascript:void(0);" style={{margin:'0 4px'}}>禁用</a>
            </Popconfirm>
            ) : (
              <a
                href="javascript:;" style={{margin:'0 4px'}}
                onClick={() => onEnable(rowInfo.withdrawId)}
              >
                启用
              </a>
            )}
          </AuthWrapper>
        <AuthWrapper functionName="f_finance_account_payment_del">
            <a
              href="javascript:;" style={{margin:'0 4px'}}
              onClick={() => this._handleDelete(rowInfo.withdrawId)}
            >
              删除
            </a>
        </AuthWrapper>
      </div>
    ) : (
      '-'
    );
  }

  _handleDelete(id) {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '确定要删除该账户吗？',
      onOk() {
        onDelete(id);
      }
    });
  }
}
