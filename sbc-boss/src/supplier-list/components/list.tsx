import React from 'react';
import { Relax } from 'plume2';

import { Tooltip, Switch, Popconfirm, Table } from 'antd';
import styled from 'styled-components';
import {
  noop,
  DataGrid,
  Const,
  history,
  QMMethod,
  AuthWrapper,
  checkAuth
} from 'qmkit';
import { IList } from 'typings/globalType';
import moment from 'moment';
import { check } from 'prettier';

const COMPANY_TYPE = {
  0: '平台自营',
  1: '第三方',
  2: '统仓统配',
  3: '零售超市',
  4: '新散批'
};

const AUDIT_STATE = {
  0: '待审核',
  1: '已审核',
  2: '审核未通过'
};

const ACCOUNT_STATE = {
  0: '启用',
  1: '禁用'
};

const STORE_STATE = {
  0: '开启',
  1: '关店'
};

const { Column } = Table;

const Operation = styled.div`
  a {
    padding-right: 5px;
  }
`;
const ErrorText = styled.p`
  color: #f04134;
`;
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      infos: IList;
      pageSize: number;
      pageNum: number;
      total: number;

      switchModal: Function;
      initSuppliers: Function;
      reject: Function;
      switchStore: Function;
      setSelfManage: Function;
      reSign: Function;
    };
  };

  static relaxProps = {
    // 商家列表
    infos: 'infos',
    // 每页展示数量
    pageSize: 'pageSize',
    // 当前页
    pageNum: 'pageNum',
    // 总数量
    total: 'total',

    // 展示/隐藏弹框
    switchModal: noop,
    // 初始化商家列表
    initSuppliers: noop,
    // 启用/禁用账号
    reject: noop,
    // 开店/关店
    switchStore: noop,
    // 设置是否为自营商家
    setSelfManage: noop,
    reSign: noop
  };

  render() {
    const {
      infos,
      pageSize,
      pageNum,
      total,
      initSuppliers,
      setSelfManage,
      reSign
    } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          dataSource={infos.toJS()}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              initSuppliers({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column title="商家编号" dataIndex="companyCode" key="companyCode" />
          <Column
            title="商家账号"
            dataIndex="accountName"
            key="accountName"
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="商家名称"
            dataIndex="supplierName"
            key="supplierName"
            width={180}
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="店铺名称"
            dataIndex="storeName"
            key="storeName"
            width={180}
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="商家类型"
            dataIndex="companyType"
            key="companyType"
            render={(rowInfo) => (
              <p>{rowInfo || rowInfo == 0 ? COMPANY_TYPE[rowInfo] : '-'}</p>
            )}
          />
          <Column
            title="批发市场"
            dataIndex="marketName"
            key="marketName"
            width={180}
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="入驻商家代表"
            dataIndex="investmentManager"
            key="investmentManager"
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="上架商品数"
            dataIndex="onSaleGoodsNum"
            key="onSaleGoodsNum"
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title="是否推荐"
            dataIndex="recommendFlag"
            key="recommendFlag"
            render={(text) => <p>{text ? '是' : '否'}</p>}
          />
          <Column
            title="是否自营商家"
            dataIndex="selfManage"
            key="selfManage"
            render={(selfManage, record: any) => (
              <Switch
                checked={selfManage === 1}
                onChange={(checked) => setSelfManage(record.storeId, checked)}
              />
            )}
          />
          {/* <Column
            title="到期时间"
            dataIndex="contractEndDate"
            key="contractEndDate"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.DAY_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          /> */}
          <Column
            title="审核状态"
            dataIndex="auditState"
            key="auditState"
            render={(text, record: any) => {
              return (
                <div>
                  <p>{text || text == 0 ? AUDIT_STATE[text] : '-'}</p>
                  {text == 2 && (
                    <Tooltip placement="topLeft" title={record.auditReason}>
                      <a href="javascript:;">原因</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          {/* <Column
            title="提审时间"
            dataIndex="applyTime"
            key="applyTime"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          /> */}
          <Column
            title="签约时间"
            dataIndex="applyTime"
            key="applyTime"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.DAY_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          />
          <Column
            title="审核时间"
            dataIndex="applyEnterTime"
            key="applyEnterTime"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.DAY_FORMAT) : '-'}
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
          <Column
            title="操作"
            dataIndex="operation"
            key="operation"
            width={230}
            render={(_text, record: any) => {
              return checkAuth('f_supplier_audit') ||
                checkAuth('f_supplier_detail_1') ||
                checkAuth('f_supplier_edit_1') ||
                checkAuth('f_supplier_list_2') ? (
                <Operation>
                  {record.auditState || record.auditState == 0 ? (
                    record.auditState == 0 ? (
                      <AuthWrapper functionName="f_supplier_audit">
                        <a
                          href="javascript:;"
                          onClick={() => this._detail(record.storeId)}
                        >
                          {' '}
                          审核
                        </a>
                      </AuthWrapper>
                    ) : record.auditState == 2 ? (
                      <AuthWrapper functionName="f_supplier_detail_1">
                        <a
                          href="javascript:;"
                          onClick={() => this._detail(record.storeId)}
                        >
                          {' '}
                          查看
                        </a>
                      </AuthWrapper>
                    ) : (
                      <React.Fragment>
                        <AuthWrapper functionName="f_supplier_detail_1">
                          <a
                            href="javascript:;"
                            onClick={() => this._detail(record.storeId)}
                          >
                            {' '}
                            查看
                          </a>
                        </AuthWrapper>
                        <AuthWrapper functionName={'f_supplier_edit_1'}>
                          <a
                            href="javascript:;"
                            onClick={() => this._edit(record.storeId)}
                          >
                            {' '}
                            编辑
                          </a>
                        </AuthWrapper>
                        <AuthWrapper functionName={'f_supplier_list_2'}>
                          <a
                            href="javascript:;"
                            onClick={() =>
                              this._showModal({
                                modalType: 0,
                                id: record.companyInfoId,
                                state: record.accountState
                              })
                            }
                          >
                            {record.accountState == 1
                              ? '启用'
                              : record.accountState == 0 && '禁用'}
                          </a>
                          <a
                            href="javascript:;"
                            onClick={() =>
                              this._showModal({
                                modalType: 1,
                                id: record.storeId,
                                state: record.storeState
                              })
                            }
                          >
                            {record.storeState == 1
                              ? '开启'
                              : record.storeState == 0 && '关店'}
                          </a>
                        </AuthWrapper>
                      </React.Fragment>
                    )
                  ) : record.isContract !== 1 ? (
                    '-'
                  ) : (
                    ''
                  )}
                  {record.isContract === 1 && (
                    <AuthWrapper functionName={'f_supplier_edit_1'}>
                      <Popconfirm
                        title="是否确认需要重签合同?"
                        onConfirm={() => reSign(record.companyInfoId)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <a href="javascript:;">重签合同</a>
                      </Popconfirm>
                    </AuthWrapper>
                  )}
                </Operation>
              ) : (
                '-'
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }

  /**
   * 显示/禁用弹框
   */
  _showModal = ({ modalType, id, state }) => {
    const { switchModal, reject, switchStore } = this.props.relaxProps;
    // 如果开始状态是账号启用/店铺开启, 点击展示弹框
    if (state == 0) {
      switchModal({ modalType, id });
    } else if (state == 1) {
      // 如果开始状态是账号禁用/店铺关闭, 点击直接操作
      // 启用账号
      if (modalType == 0) {
        reject({ companyInfoId: id, accountState: 0 });
      } else if (modalType == 1) {
        //店铺开启
        switchStore({ storeId: id, storeState: 0 });
      }
    }
  };

  /**
   * 审核/查看
   */
  _detail = (sid) => {
    history.push('/supplier-detail/' + sid);
  };

  /**
   * 编辑
   */
  _edit = (sid) => {
    history.push(`/supplier-edit/${sid}`);
  };
}
