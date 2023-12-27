import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { withRouter } from 'react-router';
import { Table, Button } from 'antd';
import { noop } from 'qmkit';
import { List } from 'immutable';
import SearchForm from './search-form';
import UploadModal from './upload-modal';
import moment from 'moment';

declare type IList = List<any>;
const { Column } = Table;

@withRouter
@Relax
export default class WaitList extends React.Component<any, any> {
  props: {
    tabKey: string;
    relaxProps?: {
      waitList: IMap;
      pageChange: Function;
    };
  };

  static relaxProps = {
    waitList: 'waitList',
    pageChange: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentRow: ''
    };
  }

  render() {
    const { tabKey } = this.props;
    const { visible, currentRow } = this.state;
    const { waitList, pageChange } = this.props.relaxProps;
    const data = waitList.toJS();
    const { loading, dataList, pageSize, total, currentPage } = data;

    return (
      <div>
        <SearchForm tabKey={tabKey} />
        <Table
          loading={loading}
          rowKey="userContractId"
          pagination={{
            current: currentPage,
            pageSize,
            total
          }}
          dataSource={dataList}
          onChange={(pagination) => this._handleOnChange(pagination)}
        >
          <Column
            title="商家账号"
            key="employeeName"
            dataIndex="employeeName"
          />
          <Column
            title="入驻商家业务代表"
            key="investmentManager"
            dataIndex="investmentManager"
          />
          <Column
            title="注册时间"
            key="createTime"
            dataIndex="createTime"
            render={(text) =>
              text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'
            }
          />
          <Column
            title="签署方式"
            key="signType"
            dataIndex="signType"
            render={(text) => (text == '0' ? '线上签署' : '线下签署')}
          />
          <Column
            title="操作"
            key="opration"
            dataIndex="opration"
            render={(_, rowInfo: any) => {
              if (rowInfo.signType == '0') {
                return '等待在线签约';
              } else {
                return (
                  <div>
                    <Button type="link" onClick={() => this.showModal(rowInfo)}>
                      上传签约文件
                    </Button>
                  </div>
                );
              }
            }}
          />
        </Table>
        <UploadModal
          visible={visible}
          currentRow={currentRow}
          closeModal={this.closeModal}
          pageChange={pageChange}
        />
      </div>
    );
  }

  _handleOnChange = (pagination) => {
    const { pageChange } = this.props.relaxProps;
    pageChange({ type: 'waitList', current: pagination.current });
  };

  showModal = (rowInfo) => {
    this.setState({ visible: true, currentRow: rowInfo });
  };

  closeModal = () => {
    this.setState({ visible: false, currentRow: '' });
  };
}
