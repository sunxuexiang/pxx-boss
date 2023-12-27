import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, DataGrid, QMMethod } from 'qmkit';
import { Modal, Form, Input, Tooltip } from 'antd';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';

const Column = DataGrid;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const ErrorText = styled.p`
  color: #f04134;
`;

const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalType } = this.props;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message:
                  '请输入' + (modalType == '3' ? '驳回' : '禁用') + '原因'
              },
              { validator: this.checkComment }
            ]
          })(
            <Input.TextArea
              placeholder={
                '请输入' + (modalType == '3' ? '驳回' : '禁用') + '原因'
              }
              autosize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('备注请填写小于100字符'));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create({})(RejectForm);

const ACCOUNT_STATE = {
  0: '启用',
  1: '禁用'
};

const STORE_STATE = {
  0: '开启',
  1: '关店'
};

@Relax
export default class InfoList extends React.Component<any, any> {
  _rejectForm;
  props: {
    relaxProps?: {
      liveCompanyLoading: boolean;
      liveCompanyTotal: number;
      liveCompanyPageSize: number;
      liveCompanyDataList: IList;
      liveCompanyCurrent: number;
      currentLiveCompanyTab: string;
      orderRejectModalVisible: boolean;
      modalType: string;
      storeId: string;
      modify: Function;
      queryPage: Function;
      showRejectModal: Function;
      hideRejectModal: Function;
    };
  };

  static relaxProps = {
    liveCompanyLoading: 'liveCompanyLoading',
    liveCompanyTotal: 'liveCompanyTotal',
    liveCompanyPageSize: 'liveCompanyPageSize',
    liveCompanyDataList: 'liveCompanyDataList',
    liveCompanyCurrent: 'liveCompanyCurrent',
    currentLiveCompanyTab: 'currentLiveCompanyTab',
    orderRejectModalVisible: 'orderRejectModalVisible',
    modalType: 'modalType',
    storeId: 'storeId',
    onSelect: noop,
    modify: noop,
    queryPage: noop,
    showRejectModal: noop,
    hideRejectModal: noop
  };

  render() {
    const {
      liveCompanyLoading,
      liveCompanyTotal,
      liveCompanyPageSize,
      liveCompanyDataList,
      liveCompanyCurrent,
      currentLiveCompanyTab,
      queryPage,
      orderRejectModalVisible,
      modalType
    } = this.props.relaxProps;

    return (
      <TableBox>
        <DataGrid
          dataSource={liveCompanyDataList.toJS()}
          loading={liveCompanyLoading}
          pagination={{
            total: liveCompanyTotal,
            pageSize: liveCompanyPageSize,
            current: liveCompanyCurrent,
            onChange: (pageNum, pageSize) => {
              queryPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
          rowKey={'liveCompanyList'}
        >
          <Column title="商家编号" dataIndex="companyCode" key="companyCode" />
          <Column
            title="商家账号"
            dataIndex="accountName"
            key="accountName"
            render={(text) => (
              <p>{text ? QMMethod.encryptionPhone(text) : '-'}</p>
            )}
          />
          <Column
            title="商家名称"
            dataIndex="supplierName"
            key="supplierName"
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="店铺名称"
            dataIndex="storeName"
            key="storeName"
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="商家类型"
            dataIndex="companyType"
            key="companyType"
            render={(companyType) => {
              return <div>{companyType == 0 ? '平台自营' : '第三方商家'}</div>;
            }}
          />
          <Column
            title="签约时间"
            dataIndex="contractStartDate"
            key="contractStartDate"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          />
          <Column
            title="到期时间"
            dataIndex="contractEndDate"
            key="contractEndDate"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          />
          <Column
            title="账号状态"
            dataIndex="accountState"
            key="accountState"
            render={(text, record: any) => {
              return (
                <div>
                  <p>{text || text == 0 ? ACCOUNT_STATE[text] : '-'}</p>
                  {text == 1 && (
                    <Tooltip
                      placement="topLeft"
                      title={record.accountDisableReason}
                    >
                      <a href="javascript:;">原因</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          <Column
            title="店铺状态"
            dataIndex="storeState"
            key="storeState"
            render={(text, record: any) => {
              return (
                <div>
                  {text == 1 ? (
                    <div>
                      <ErrorText>
                        {STORE_STATE[text]}
                        {moment(record.contractEndDate).isBefore(moment()) &&
                          '-过期'}
                      </ErrorText>
                      <Tooltip
                        placement="topLeft"
                        title={record.storeClosedReason}
                      >
                        <a href="javascript:;">原因</a>
                      </Tooltip>
                    </div>
                  ) : (
                    <p>
                      {moment(record.contractEndDate).isBefore(moment())
                        ? '过期'
                        : text || text == 0
                        ? STORE_STATE[text]
                        : '-'}
                    </p>
                  )}
                </div>
              );
            }}
          />
          {currentLiveCompanyTab == '1' || currentLiveCompanyTab == '2' ? (
            <Column
              title="操作"
              dataIndex="option"
              key="option"
              render={(_row, rowInfo) => {
                if (currentLiveCompanyTab == '2') {
                  return (
                    <div>
                      {/*<AuthWrapper functionName={'f_xxx'}>*/}
                      <a
                        style={styles.edit}
                        onClick={() =>
                          this._showRejectedConfirm(rowInfo.storeId, '4')
                        }
                      >
                        禁用
                      </a>
                      {/*</AuthWrapper>*/}
                    </div>
                  );
                }
                return (
                  <div>
                    {/*<AuthWrapper functionName={'f_xxx'}>*/}
                    <a
                      style={styles.edit}
                      onClick={() => this._modify(rowInfo.storeId, '2', '')}
                    >
                      审核
                    </a>
                    {/*</AuthWrapper>*/}
                    {/*<AuthWrapper functionName={'f_xxx'}>*/}
                    <a
                      onClick={() =>
                        this._showRejectedConfirm(rowInfo.storeId, '3')
                      }
                    >
                      驳回
                    </a>
                    {/*</AuthWrapper>*/}
                  </div>
                );
              }}
            />
          ) : (
            <Column
              title={
                currentLiveCompanyTab == '4' ? '禁用原因' : '审核不通过原因'
              }
              dataIndex="option"
              key="option"
              align="left"
              render={(_row, rowInfo) => {
                if (
                  currentLiveCompanyTab == '3' ||
                  currentLiveCompanyTab == '4'
                ) {
                  return (
                    <div style={{ textAlign: 'left' }}>
                      {rowInfo && rowInfo.auditReason
                        ? rowInfo.auditReason
                        : '--'}
                    </div>
                  );
                }
              }}
            />
          )}
          }
        </DataGrid>

        <Modal
          maskClosable={false}
          title={(modalType == '3' ? '驳回' : '禁用') + '原因'}
          visible={orderRejectModalVisible}
          okText="保存"
          onOk={() => this._handleOK()}
          onCancel={() => this._handleCancel()}
        >
          <WrappedRejectForm
            ref={(form) => {
              this._rejectForm = form;
            }}
            modalType={modalType}
          />
        </Modal>
      </TableBox>
    );
  }

  /**
   * 驳回，禁用
   * @private
   */
  _showRejectedConfirm = (storeId, type) => {
    const { showRejectModal } = this.props.relaxProps;
    showRejectModal(storeId, type);
  };

  /**
   * 处理成功
   */
  _handleOK = () => {
    const { storeId, modalType } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this._modify(storeId, modalType, values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };

  /**
   * 操作
   */
  _modify = (id, type, cause) => {
    const { modify } = this.props.relaxProps;
    modify(id, type, cause);
  };
}
