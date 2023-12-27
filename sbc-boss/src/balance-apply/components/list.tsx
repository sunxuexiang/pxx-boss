import React from 'react';
// import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, Const } from 'qmkit';
import { IList } from 'typings/globalType';
import { message, Modal, Table, Form } from 'antd';
import VoucherModal from './modal-voucher';
// import ModalDis from './modal-dis';
// import ModalService from './modal-service';
// import ModalFinancial from './modal-financial';
import { fromJS } from 'immutable';
import moment from 'moment';
const Column = Table.Column;
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      init: Function;
      onActorFiledChange: Function;
      onSelect: Function;
      selectedRowKeys: IList;
      receivableBut: Function;
      setVoucherVisible: Function;
      voucherModalVisible: boolean;
      updataImgSubmit: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    selected: 'selected',
    // deleteCoupon: noop,
    init: noop,
    // copyCoupon: noop,
    onSelect: noop,
    onActorFiledChange: noop,
    // onSelect: noop,
    selectedRowKeys: 'selectedRowKeys',
    voucherModalVisible: 'voucherModalVisible',
    setVoucherVisible: noop,
    updataImgSubmit: noop
    // receivableBut:noop,
  };
  render() {
    const {
      total,
      pageNum,
      pageSize,
      couponList,
      init,
      onActorFiledChange,
      selectedRowKeys,
      onSelect,
      voucherModalVisible,
      setVoucherVisible,
      updataImgSubmit
    } = this.props.relaxProps;

    return (
      <div>
        <DataGrid
          rowKey={(record) => record.recordNo}
          dataSource={couponList.toJS()}
          rowSelection={{
            selectedRowKeys: selectedRowKeys.toJS(),
            onChange: (selectedRowKeys, selectedRows) => {
              onSelect(selectedRowKeys);
            }
          }}
          // rowSelection={this.rowSelection}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (pageNum, pageSize) => {
              init({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column
            title="用户账号"
            dataIndex="customerWallet.customerAccount"
            key="customerAccount"
          />
          <Column
            title="账号类型"
            key="accountType"
            dataIndex="accountType"
            render={(text) => {
              if (text === 0) {
                return '入驻企业';
              }
              if (text === 1) {
                return '平台用户';
              }
              return '-';
            }}
          />
          <Column
            title="提现类型"
            key="autoType"
            dataIndex="autoType"
            render={(text) => {
              if (text === 0) {
                return '手动提现';
              }
              if (text === 1) {
                return '自动提现';
              }
              return '-';
            }}
          />
          <Column
            title="提现申请时间"
            dataIndex="applyTime"
            key="applyTime"
            render={(text) =>
              text ? moment(text).format(Const.TIME_FORMAT) : '-'
            }
          />
          <Column
            title="客服审核"
            key="customerauditTime"
            render={(row) => {
              let data = row.customerServiceTicketsFormLogVo?.auditTime;
              return data ? (
                <div>
                  <div>
                    {row.customerServiceTicketsFormLogVo.auditStaffName || ''}
                  </div>
                  <div>
                    {data ? moment(data).format(Const.TIME_FORMAT) : '-'}
                  </div>
                </div>
              ) : (
                '-'
              );
            }}
          />
          <Column
            title="财务审核"
            key="financiAlauditTime"
            render={(row) => {
              let data = row.financialTicketsFormLogVo?.auditTime;
              return data ? (
                <div>
                  <div>
                    {row.financialTicketsFormLogVo.auditStaffName || ''}
                  </div>
                  <div>
                    {data ? moment(data).format(Const.TIME_FORMAT) : '-'}
                  </div>
                </div>
              ) : (
                '-'
              );
            }}
          />
          <Column
            title="取消时间"
            dataIndex="auditTime"
            key="auditTime1"
            render={(text) =>
              text ? moment(text).format(Const.TIME_FORMAT) : '-'
            }
          />

          <Column title="提现金额" dataIndex="applyPrice" key="applyPrice" />

          <Column
            title="到账金额"
            dataIndex="arrivalPrice"
            key="arrivalPrice"
          />
          <Column
            title="收款账户"
            key="customerAccount1"
            render={(row) => {
              return (
                <div>
                  <span>{row.bankBranch}</span>&nbsp;
                  <span>{row.bankName}</span>&nbsp;
                  <span>{row.bankCode}</span>
                </div>
              );
            }}
          />

          <Column
            title="当前状态"
            render={(value) => {
              if (value.extractStatus == '1') {
                return '待审核';
              } else if (value.extractStatus == '2') {
                return '待打款';
              } else if (value.extractStatus == '3') {
                return '已完成';
              } else if (value.extractStatus == '4') {
                return '已拒绝';
              } else if (value.extractStatus == '5') {
                return '打款失败';
              } else if (value.extractStatus == '6') {
                return '用户撤回';
              }
            }}
          />
          <Column
            title="操作"
            key="operate"
            render={(record: any) => {
              return (
                <div className="operation-box">
                  {record.extractStatus == 3 ||
                  record.extractStatus == 4 ||
                  record.extractStatus == 5 ? (
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        onActorFiledChange('pageRow', fromJS(record));
                        onActorFiledChange('isVisible', true);
                      }}
                    >
                      查看详情
                    </a>
                  ) : null}
                  {[3].includes(record.extractStatus) ? (
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        onActorFiledChange('pageRow', fromJS(record));
                        setVoucherVisible(true);
                      }}
                    >
                      编辑凭证
                    </a>
                  ) : null}
                  {!record.customerServiceTicketsFormLogVo &&
                  record.extractStatus == 1 ? (
                    <AuthWrapper functionName={'f_balance_apply_service'}>
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          onActorFiledChange('pageRow', fromJS(record));
                          let opt = {
                            bankBranch: '',
                            bankCode: '',
                            bankName: '',
                            backRemark: '',
                            type: 1
                          };
                          if (record.accountType === 0) {
                            opt = {
                              bankBranch: record.bankBranch || '',
                              bankCode: record.bankCode || '',
                              bankName: record.bankName || '',
                              backRemark: record.backRemark || '',
                              type: 1
                            };
                          }
                          onActorFiledChange('forms', fromJS(opt));
                          onActorFiledChange('isServiceVisible', true);
                        }}
                      >
                        客服审核
                      </a>
                    </AuthWrapper>
                  ) : null}
                  {record.customerServiceTicketsFormLogVo &&
                  !record.financialTicketsFormLogVo &&
                  record.extractStatus == 2 ? (
                    <AuthWrapper functionName={'f_balance_apply_financial'}>
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          // receivableBut();
                          onActorFiledChange('pageRow', fromJS(record));
                          onActorFiledChange(
                            'forms',
                            fromJS({
                              accounId: '',
                              arrivalPrice: Number(record.applyPrice),
                              transferDate: null,
                              auditAdmin: '',
                              remark: '',
                              type: 1
                            })
                          );
                          onActorFiledChange('isFinancialVisible', true);
                        }}
                      >
                        财务审核
                      </a>
                    </AuthWrapper>
                  ) : null}
                </div>
              );
            }}
          />
        </DataGrid>
        {voucherModalVisible ? (
          <VoucherModal
            visible={voucherModalVisible}
            setVoucherVisible={setVoucherVisible}
            updataImgSubmit={updataImgSubmit}
            size={3}
            defaultList={[]}
          />
        ) : null}
        {/* <ModalDis />
        <ModalServiceForm  />
        <ModalFinancialForm /> */}
      </div>
    );
  }
}
