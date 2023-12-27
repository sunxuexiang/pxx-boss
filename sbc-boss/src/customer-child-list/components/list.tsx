import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { withRouter } from 'react-router';
import { DataGrid, FindArea, noop } from 'qmkit';

declare type IList = List<any>;
const { Column } = DataGrid;

const CUSTOMER_REGISTER_TYPE = {
  0: '家用',
  1: '商户',
  2: '单位',
  default: '-'
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      onSelect: Function;
      selected: IList;
      init: Function;
      onDelete: Function;
      //审核客户
      onCustomerStatus: Function;
      //启用/禁用
      onCheckStatus: Function;
      form: any;
      supplierNameMap: IMap;
      getSupplierNameByCustomerId: Function;
      setRejectModalVisible: Function;
      setForbidModalVisible: Function;
      crmFlag: boolean;
      customerId: string;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onSelect: noop,
    init: noop,
    onDelete: noop,
    onCustomerStatus: noop,
    onCheckStatus: noop,
    form: 'form',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop,
    setRejectModalVisible: noop,
    setForbidModalVisible: noop,
    crmFlag: 'crmFlag',
    customerId: 'customerId'
  };

  componentWillMount() {
    this.setState({
      tooltipVisible: {},
      rejectDomVisible: false
    });
  }

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      selected,
      onSelect,
      customerId,
      init
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          },
          getCheckboxProps: (record) => ({
            disabled: record.customerVO.parentCustomerId == customerId
          })
        }}
        rowKey="customerId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init(customerId, { pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerVO.customerAccount"
          render={(customerAccount, rowData) =>
            fromJS(rowData).get('isDistributor') == 1 ? (
              <div>
                <p>{customerAccount ? customerAccount : '-'}</p>
                <span style={styles.platform}>分销员</span>
              </div>
            ) : (
              <p>{customerAccount ? customerAccount : '-'}</p>
            )
          }
        />

        <Column
          title="地区"
          render={(rowData) => {
            const data = fromJS(rowData);
            const provinceId = data.get('provinceId')
              ? data.get('provinceId').toString()
              : '';
            const cityId = data.get('cityId')
              ? data.get('cityId').toString()
              : '';
            const areaId = data.get('areaId')
              ? data.get('areaId').toString()
              : '';
            return provinceId
              ? FindArea.addressInfo(provinceId, cityId, areaId)
              : '-';
          }}
        />

        <Column
          title="联系人"
          key="contactName"
          dataIndex="contactName"
          render={(contactName) => (contactName ? contactName : '-')}
        />
        <Column
          title="会员类型"
          key="customerRegisterType"
          dataIndex="customerVO.customerRegisterType"
          render={(customerRegisterType) => {
            if (customerRegisterType != null) {
              return CUSTOMER_REGISTER_TYPE[customerRegisterType];
            } else {
              return '-';
            }
          }}
        />

        {/*   <Column
          title="状态"
          key="parentCustomerId"
          dataIndex="customerVO.parentCustomerId"
          render={(parentCustomerId) => {
            if (parentCustomerId) {
              if (parentCustomerId == customerId) {
                return '已关联当前账号';
              } else {
                return '已关联其他账号';
              }
            } else {
              return '未关联账号';
            }
          }}
        />*/}

        <Column
          title="联系方式"
          key="contactPhone"
          dataIndex="contactPhone"
          render={(contactPhone) => (contactPhone ? contactPhone : '-')}
        />
      </DataGrid>
    );
  }
}

const styles = {
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
