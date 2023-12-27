import React from 'react';
import { Relax } from 'plume2';
import { noop,AuthWrapper } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

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
      onState: Function;
      onEdit: Function;
      queryPage: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onSelect: noop,
    onState: noop,
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
      checkedIds,
      onSelect,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        // rowSelection={{
        //   type: 'checkbox',
        //   selectedRowKeys: checkedIds.toJS(),
        //   onChange: (checkedRowKeys) => {
        //     onSelect(checkedRowKeys);
        //   }
        // }}
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
      key: 'networkName',
      dataIndex: 'networkName',
      title: '网点名称'
    },
    {
      key: 'networkAddress',
      dataIndex: 'networkAddress',
      title: '网点地址'
    },
    {
      key: 'delFlag',
      dataIndex: 'delFlag',
      title: '状态',
      render:(text)=>{
        return text?'停用':'启用'
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
    return (
      <div>
        <AuthWrapper functionName={'f_network_management_edit'}>
          <a style={{marginRight:'6px'}} onClick={() => this._onState(rowInfo)}>
            {rowInfo.delFlag?'启用':'停用'}
          </a>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo.networkId)}>
            编辑
          </a>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id);
  };

  /**
   * 修改状态
   */
   _onState = (rowInfo) => {
    const { onState } = this.props.relaxProps;
    confirm({
      title: '确认',
      content: `是否确认【${rowInfo.delFlag?'启用':'停用'}】该数据`,
      onOk() {
        onState([rowInfo.networkId],rowInfo.delFlag);
      },
      onCancel() {}
    });
  };
}
