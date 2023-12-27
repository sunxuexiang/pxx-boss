import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { withRouter } from 'react-router';
import { Table, Button } from 'antd';
import { noop, ImgPreview } from 'qmkit';
import { List } from 'immutable';
import SearchForm from './search-form';
import { downLoadImg } from '../webapi';
import moment from 'moment';

declare type IList = List<any>;
const { Column } = Table;

@withRouter
@Relax
export default class ContractList extends React.Component<any, any> {
  props: {
    tabKey: string;
    relaxProps?: {
      contract: IMap;
      pageChange: Function;
      showPdf: Function;
    };
  };

  static relaxProps = {
    contract: 'contract',
    pageChange: noop,
    showPdf: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    const { visible, imgList } = this.state;
    const { tabKey } = this.props;
    const { contract } = this.props.relaxProps;
    const data = contract.toJS();
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
            title="合同编号"
            key="userContractId"
            dataIndex="userContractId"
          />
          <Column
            title="商家名称"
            key="supplierName"
            dataIndex="supplierName"
          />
          <Column
            title="入驻商家业务代表"
            key="investmentManager"
            dataIndex="investmentManager"
          />
          <Column
            title="批发市场"
            key="tabRelationName"
            dataIndex="tabRelationName"
          />
          <Column
            title="签署时间"
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
              return (
                <div>
                  <Button
                    type="link"
                    onClick={() => this.showContract(rowInfo)}
                  >
                    查看
                  </Button>
                  <Button
                    type="link"
                    onClick={() => this.downloadTemp(rowInfo)}
                  >
                    下载
                  </Button>
                </div>
              );
            }}
          />
        </Table>
        <ImgPreview
          visible={visible}
          imgList={imgList}
          close={() => {
            this.setState({ visible: false });
          }}
        />
      </div>
    );
  }

  _handleOnChange = (pagination) => {
    const { pageChange } = this.props.relaxProps;
    pageChange({ type: 'contract', current: pagination.current });
  };

  downloadTemp = (row) => {
    if (row.contractUrl && row.contractUrl.split(',')[0]) {
      window.open(row.contractUrl.split(',')[0]);
    } else if (row.imgUrl) {
      downLoadImg(row.userContractId);
    }
  };

  showContract = (row) => {
    const { showPdf } = this.props.relaxProps;
    if (row.contractUrl) {
      showPdf(row.contractUrl.split(',')[1], '查看合同');
    } else if (row.imgUrl) {
      this.setState({
        visible: true,
        imgList: row.imgUrl.split(',')
      });
    }
  };
}
