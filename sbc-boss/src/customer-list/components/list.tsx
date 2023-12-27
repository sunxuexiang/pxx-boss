import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { message, Tooltip, Switch, Popconfirm, Table } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthWrapper, DataGrid, FindArea, noop } from 'qmkit';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
import moment from 'moment';

declare type IList = List<any>;
const { Column } = Table;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

const CUSTOMER_REGISTER_TYPE = {
  0: '家用',
  1: '商户',
  2: '单位',
  null: '-'
};

const STATUS = (status) => {
  if (status === 0) {
    return 1;
  } else if (status === 1) {
    return 0;
  }
};

const STATUS_OPERATE = (status) => {
  if (status === 0) {
    return '禁用';
  } else if (status === 1) {
    return '启用';
  }
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
      ChangeviFlag: Function;
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
      jumpToInput: Function;
      onchangeStart: Function;
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
    jumpToInput: noop,
    ChangeviFlag: noop,
    form: 'form',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop,
    setRejectModalVisible: noop,
    setForbidModalVisible: noop,
    crmFlag: 'crmFlag',
    onchangeStartLive: noop
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
      init,
      form,
      supplierNameMap,
      onchangeStartLive
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
            disabled: record.customerStatus != 1
          })
        }}
        rowKey="customerId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="客户名称"
          // key="customerName"
          // dataIndex="customerName"
          render={(vlaue) => {
            console.log(vlaue.beaconStar, '123123');

            if (vlaue.beaconStar) {
              return <span style={styles.rescolor}>{vlaue.customerName}*</span>;
            } else {
              return vlaue.customerName ? vlaue.customerName : '-';
            }
          }}
        />

        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
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
          dataIndex="customerRegisterType"
          render={(customerRegisterType) =>
            CUSTOMER_REGISTER_TYPE[customerRegisterType]
          }
        />
        <Column
          title="绑定直播"
          key="isLive"
          // dataIndex="isLive"
          render={(value) => {
            // if (checkMenu('f_customer_live_state')) {
            //   if (value.isLive == 0) {
            //     return (
            //       <Popconfirm
            //         title="是否确定绑定直播？"
            //         onConfirm={() => {
            //           onchangeStartLive(value.customerId, 1);
            //         }}
            //         okText="确认"
            //         cancelText="取消"
            //       >
            //         <Switch checked={value.status ? true : false} />
            //       </Popconfirm>
            //     );
            //   } else {
            //     return (
            //       <Switch
            //         checked={value.isLive ? true : false}
            //         onChange={(e) => {
            //           onchangeStartLive(value.customerId, e ? 1 : 0);
            //         }}
            //       />
            //     );
            //   }
            // } else {
            return value.isLive ? '是' : '否';
            // }
          }}
        />
        <Column
          title="联系方式"
          key="contactPhone"
          dataIndex="contactPhone"
          render={(contactPhone) => (contactPhone ? contactPhone : '-')}
        />

        <Column
          title="客户类型"
          key="customerType"
          dataIndex="customerType"
          render={(customerType, record) =>
            customerType == 1 ? (
              <div>
                <p>商家客户</p>
                <Tooltip
                  placement="top"
                  title={
                    supplierNameMap.get((record as any).customerId)
                      ? supplierNameMap.get((record as any).customerId)
                      : ''
                  }
                  visible={
                    this.state.tooltipVisible[(record as any).customerId]
                      ? this.state.tooltipVisible[(record as any).customerId]
                      : false
                  }
                >
                  <a
                    href="javascript:void(0);"
                    onMouseEnter={() =>
                      this._renderToolTips((record as any).customerId, true)
                    }
                    onMouseOut={() =>
                      this._renderToolTips((record as any).customerId, false)
                    }
                  >
                    查看
                  </a>
                </Tooltip>
              </div>
            ) : (
              <div>平台客户</div>
            )
          }
        />

        {/*<Column*/}
        {/*title="审核状态"*/}
        {/*key="checkState"*/}
        {/*dataIndex="checkState"*/}
        {/*render={(checkState, record) => {*/}
        {/*let statusString = <div>-</div>;*/}
        {/*if (checkState == 0) {*/}
        {/*statusString = <div>待审核</div>;*/}
        {/*} else if (checkState == 1) {*/}
        {/*statusString = <div>已审核</div>;*/}
        {/*} else if (checkState == 2) {*/}
        {/*statusString = (*/}
        {/*<div>*/}
        {/*<p>审核未通过</p>*/}
        {/*<Tooltip placement="top" title={record['rejectReason']}>*/}
        {/*<a href="javascript:void(0);">原因</a>*/}
        {/*</Tooltip>*/}
        {/*</div>*/}
        {/*);*/}
        {/*}*/}
        {/*return statusString;*/}
        {/*}}*/}
        {/*/>*/}

        {form.get('checkState') === '' ||
        form.get('checkState') === '-1' ||
        form.get('checkState') === '1' ? (
          <Column
            title="账号状态"
            key="customerStatus"
            dataIndex="customerStatus"
            render={(customerStatus, rowData) => {
              const data = fromJS(rowData);
              if (data.get('checkState') == 1) {
                if (customerStatus == 1) {
                  return (
                    <div>
                      <p>禁用</p>
                      <Tooltip placement="top" title={rowData['forbidReason']}>
                        <a href="javascript:void(0);">原因</a>
                      </Tooltip>
                    </div>
                  );
                } else {
                  return <span>{CUSTOMER_STATUS[customerStatus]}</span>;
                }
              } else {
                return <span>-</span>;
              }
            }}
          />
        ) : null}
        <Column
          title="注册时间"
          key="createTime"
          dataIndex="createTime"
          render={(createTime) =>
            createTime ? moment(createTime).format('YYYY-MM-DD') : '-'
          }
        />
        <Column
          title="最近登录时间"
          key="lastLoginTime"
          dataIndex="lastLoginTime"
          render={(lastLoginTime) =>
            lastLoginTime
              ? lastLoginTime.substring(0, lastLoginTime.length - 4)
              : '-'
          }
        />

        <Column
          title="最近支付订单时间"
          key="lastPayOrderTime"
          dataIndex="lastPayOrderTime"
          render={(lastPayOrderTime) =>
            lastPayOrderTime
              ? lastPayOrderTime.substring(0, lastPayOrderTime.length - 4)
              : '-'
          }
        />
        {/* <Column
          title="是否大客户"
          render={(rowInfo) => {
           return <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={rowInfo.vipFlag == 1}
                onChange={this._change.bind(this,rowInfo)}
              />
          }}
        /> */}

        <Column
          title="业务代表"
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />

        <Column
          title="白鲸管家"
          key="managerName"
          dataIndex="managerName"
          render={(managerName) => (managerName ? managerName : '-')}
        />

        <Column
          title="操作"
          render={(rowInfo) => {
            return !checkMenu(
              'f_customer_detail_edit,f_customer_detail_view,f_customer_4,f_customer_3'
            ) || rowInfo.checkState == 2 ? (
              <span>-</span>
            ) : (
              this._renderOperation(rowInfo)
            );
          }}
        />
      </DataGrid>
    );
  }
  _change = async (rowInfo) => {
    // console.log(rowInfo.customerId,'rowInfo')
    const { ChangeviFlag } = this.props.relaxProps;
    ChangeviFlag(rowInfo.customerId, rowInfo.vipFlag == 0 ? 1 : 0);
  };

  _renderToolTips = async (customerId, visible) => {
    let { tooltipVisible } = this.state;
    const { supplierNameMap, getSupplierNameByCustomerId } =
      this.props.relaxProps;
    let newState = {};
    if (visible && !supplierNameMap.get(customerId)) {
      await getSupplierNameByCustomerId(customerId);
    }
    tooltipVisible[customerId] = visible;
    newState['tooltipVisible'] = tooltipVisible;
    this.setState(newState);
  };

  /**
   * 操作
   */
  _renderOperation = (rowInfo) => {
    const {
      onCheckStatus,
      setRejectModalVisible,
      setForbidModalVisible,
      crmFlag,
      jumpToInput
    } = this.props.relaxProps;
    return (
      <div className="operation-box">
        {rowInfo.enterpriseStatusXyy == 2 &&
        rowInfo.customerRegisterType != 0 &&
        !rowInfo.parentCustomerId ? (
          <>
            {checkMenu('f_customer_detail_edit,f_customer_detail_view') && (
              <a onClick={() => jumpToInput(rowInfo.customerId)}>
                导入子账号
                {/*to={`/customer-child-list/${rowInfo.customerId}`}*/}
              </a>
            )}
          </>
        ) : null}
        {/*审核状态 0：待审核 1：已审核 2：审核未通过*/}
        {rowInfo.checkState == 0 || rowInfo.checkState == 1 ? (
          <>
            {checkMenu('f_customer_detail_edit,f_customer_detail_view') && (
              <Link
                to={{
                  pathname: crmFlag
                    ? `/crm-customer-detail/${rowInfo.customerId}`
                    : `/customer-detail/${rowInfo.customerId}/${rowInfo.vipFlag}`
                }}
              >
                详情
              </Link>
            )}
          </>
        ) : null}
        {rowInfo.checkState == 1 ? (
          <AuthWrapper functionName={'f_customer_4'}>
            <a
              href="javascript:void(0);"
              onClick={() => {
                STATUS(rowInfo.customerStatus) == 0
                  ? onCheckStatus(
                      rowInfo.customerId,
                      STATUS(rowInfo.customerStatus)
                    )
                  : setForbidModalVisible(rowInfo.customerId, true);
              }}
            >
              {STATUS_OPERATE(rowInfo.customerStatus)}
            </a>
          </AuthWrapper>
        ) : null}
        {/*{rowInfo.checkState == 0 ? (*/}
        {/*<AuthWrapper functionName={'f_customer_3'}>*/}
        {/*<a*/}
        {/*href="javascript:void(0);"*/}
        {/*onClick={() => {*/}
        {/*this._customerStatus(rowInfo, 1);*/}
        {/*}}*/}
        {/*>*/}
        {/*审核*/}
        {/*</a>*/}
        {/*</AuthWrapper>*/}
        {/*) : null}*/}
        {/*{rowInfo.checkState == 0 ? (*/}
        {/*<AuthWrapper functionName={'f_customer_3'}>*/}
        {/*<a*/}
        {/*href="javascript:void(0);"*/}
        {/*onClick={() => {*/}
        {/*setRejectModalVisible(rowInfo.customerId, true);*/}
        {/*}}*/}
        {/*>*/}
        {/*驳回*/}
        {/*</a>*/}
        {/*</AuthWrapper>*/}
        {/*) : null}*/}
      </div>
    );
  };

  /**
   * 审核客户前判断客户信息是否已完善
   * @param rowInfo
   * @param status
   * @private
   */
  _customerStatus = (rowInfo, status) => {
    const { onCustomerStatus } = this.props.relaxProps;
    if (
      !rowInfo.customerName ||
      !rowInfo.contactName ||
      !rowInfo.contactPhone
    ) {
      message.error('请完善客户信息');
    } else {
      onCustomerStatus(rowInfo.customerId, status);
    }
  };
}

const styles = {
  rescolor: {
    color: '#f56c1d'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
