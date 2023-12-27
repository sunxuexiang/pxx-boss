import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { List, fromJS } from 'immutable';
import { Button, Input, Modal, Table } from 'antd';
import UploadImg from './upload-img';
import Column from 'antd/lib/table/Column';
type TList = List<any>;

// const { Column } = DataGrid;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class MyList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDelete: Function;
      onSave: Function;
      onEdit: Function;
      init: Function;
      roles: any[];
      onEnable: Function;
      switchModal: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDelete: noop,
    onEdit: noop,
    onSave: noop,
    onSelect: noop,
    init: noop,
    current: 'current'
  };
  constructor(props: any) {
    super(props);
    this.state = {
      inputList: []
    };
  }
  render() {
    const { loading, dataList, init } = this.props.relaxProps;
    return (
      <>
        <Table
          loading={loading}
          pagination={false}
          rowKey="id"
          dataSource={dataList.toJS()}
        >
          <Column title="导航名" key="navName" dataIndex="navName" />
          <Column
            title="修改导航名"
            key="createTime"
            dataIndex="createTime"
            render={(text, record, index) => (
              <Input
                key={index}
                maxLength={4}
                style={{ width: '80%' }}
                value={this.state.inputList[index] || ''}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.state.inputList[index] = value;
                  this.setState({ inputList: this.state.inputList });
                }}
              />
            )}
          />
          <Column
            title="导航图标-未点击状态"
            key="iconShow"
            render={(rowInfo) => {
              return <UploadImg dataList={rowInfo} type="iconShow" />;
            }}
          />
          <Column
            title="导航图标-已点击状态"
            key="iconClick"
            render={(rowInfo) => {
              return <UploadImg dataList={rowInfo} type="iconClick" />;
            }}
          />
        </Table>
        {/* <AuthWrapper functionName={'f_preset_search_terms'}> */}
        <div className="bar-button">
          <Button
            type="primary"
            htmlType="submit"
            onClick={this.submit.bind(this)}
          >
            保存
          </Button>
        </div>
        {/* </AuthWrapper> */}
      </>
    );
  }
  submit() {
    const { onSave } = this.props.relaxProps;
    const res = onSave(this.state.inputList);
    if (res) {
      this.setState({ inputList: [] });
    }
  }
  _onEditWords = (sensitiveId) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(sensitiveId);
  };

  _onDeleteWords = (sensitiveId) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除敏感词？删除后不可恢复。',
      onOk() {
        onDelete(sensitiveId);
      },
      onCancel() {}
    });
  };
}
