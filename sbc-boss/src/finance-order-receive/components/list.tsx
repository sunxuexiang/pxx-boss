import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop, checkAuth, ValidConst } from 'qmkit';

import { List } from 'immutable';
import {
  Menu,
  Popconfirm,
  Modal,
  Form,
  Input,
  Table,
  Alert,
  message
} from 'antd';
import momnet from 'moment';
import FormItem from 'antd/lib/form/FormItem';

import debounce from 'lodash/debounce';
import MergeBill from './merge-bill';
type TList = List<any>;
const { Column } = Table;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              { required: true, message: '请输入驳回原因' },
              { validator: this.checkComment }
            ]
          })(
            <Input.TextArea
              placeholder="请输入驳回原因"
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

class comfigForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('commenasdt', {
            rules: [
              { required: true, message: '请输入实收金额' },
              { validator: this.checkCommentas },
              {
                pattern: ValidConst.price,
                message: '请输入合法数字'
              }
            ]
          })(
            <Input
              placeholder="请输入实收金额"
              // autosize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  checkCommentas = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('请填写正常金额'));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create({})(RejectForm);
const WrappedcomfigForm = Form.create({})(comfigForm);

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

const payTypeDic = {
  0: '线上支付',
  1: '线下支付',
  2: '余额支付'
};

/**
 * 订单收款单列表
 */
@Relax
export default class PayOrderList extends React.Component<any, any> {
  _rejectForm;

  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      isloading: boolean;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDestory: Function;
      orderRejectModalVisible: boolean;
      ondragoverRejeckviscomfig: boolean;
      onConfirm: Function;
      onView: Function;
      init: Function;
      onAudit: Function;
      onAudit_cart: Function;
      onCreateReceivable: Function;
      showRejectModal: Function;
      showcomfigModal: Function;
      hideRejectModal: Function;
      hidecomfigModal: Function;
      current: number;
      onNewAudit: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    isloading: 'isloading',
    total: 'total',
    orderRejectModalVisible: 'orderRejectModalVisible',
    ondragoverRejeckviscomfig: 'ondragoverRejeckviscomfig',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onView: noop,
    hideRejectModal: noop,
    hidecomfigModal: noop,
    onCreateReceivable: noop,
    showRejectModal: noop,
    showcomfigModal: noop,
    onAudit: noop,
    onAudit_cart: noop,
    current: 'current',
    onNewAudit: noop
  };
  columns = [
    {
      title: '店铺名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '订单编号',
      dataIndex: 'money',
      align: 'center'
    },
    {
      title: '应收金额',
      dataIndex: 'address',
      align: 'center'
    }
  ];

  data = [
    {
      key: '1',
      name: '超级大白鲸',
      money: 'O202211031002454838',
      address: '￥333.04'
    },
    {
      key: '2',
      name: '超级大白鲸',
      money: 'O202211031002454838',
      address: '￥333.04'
    },
    {
      key: '3',
      name: '超级大白鲸',
      money: 'O202211031002454838',
      address: '￥333.04'
    }
  ];
  render() {
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSelect,
      init,
      orderRejectModalVisible,
      ondragoverRejeckviscomfig,
      isloading,
      current
    } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          loading={loading}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selected.toJS(),
            onChange: (selectedRowKeys) => {
              onSelect(selectedRowKeys);
            }
          }}
          rowKey="payOrderId"
          pagination={{
            pageSize,
            total,
            current: current,
            onChange: (pageNum, pageSize) => {
              init({ pageNum: pageNum - 1, pageSize });
            }
          }}
          dataSource={dataList.toJS()}
        >
          <Column
            title="收款流水号"
            key="receivableNo"
            dataIndex="receivableNo"
            render={(receivableNo) => (
              <span>{receivableNo ? receivableNo : '-'}</span>
            )}
            width="10%"
          />
          <Column
            title="订单编号"
            key="orderCode"
            dataIndex="orderCode"
            width="10%"
          />
          <Column
            title="下单时间"
            key="createTime"
            dataIndex="createTime"
            render={(createTime) => (
              <div>
                {momnet(createTime)
                  .format(Const.TIME_FORMAT)
                  .toString()
                  .split(' ')
                  .map((v, index) => {
                    return (
                      <span key={index} style={{ display: 'block' }}>
                        {v}
                      </span>
                    );
                  })}
              </div>
            )}
            width="9%"
          />
          <Column
            title="客户名称"
            key="customerName"
            dataIndex="customerName"
            width="8%"
          />
          <Column
            width="7%"
            title="业务员"
            key="employeeName"
            dataIndex="employeeName"
            render={(employeeName) => (employeeName ? employeeName : '-')}
          />
          <Column
            title="店铺名称"
            key="storeName"
            dataIndex="storeName"
            width="8%"
          />
          <Column
            title="订单类型"
            key="activityType"
            dataIndex="activityType"
            width="8%"
            render={(rowInfo) => (
              <span>
                {rowInfo == 0
                  ? '销售订单'
                  : rowInfo == 1
                  ? '提货订单'
                  : '囤货订单'}
              </span>
            )}
          />
          <Column
            title="支付方式"
            key="payType"
            render={(rowInfo) => (
              <span>
                {rowInfo.payOrderPrice == null && rowInfo.payOrderPoints != null
                  ? '积分兑换'
                  : payTypeDic[rowInfo.payType]}
              </span>
            )}
            width="6%"
          />
          <Column
            title="收款账户"
            key="receivableAccount"
            dataIndex="receivableAccount"
            render={(receivableAccount) => (
              <div>
                {receivableAccount
                  ? receivableAccount.split(' ').map((v) => {
                      return <span style={{ display: 'block' }}>{v}</span>;
                    })
                  : '-'}
              </div>
            )}
            width="10%"
          />
          <Column
            title="应收金额"
            key="payOrderPrice"
            render={(rowInfo) => (
              <span>
                {rowInfo.payOrderPoints != null &&
                  rowInfo.payOrderPoints + '积分  '}
                {rowInfo.payOrderPrice != null &&
                  `￥${
                    rowInfo.payOrderPrice
                      ? rowInfo.payOrderPrice.toFixed(2)
                      : (0.0).toFixed(2)
                  }`}
              </span>
            )}
            width="6%"
          />
          <Column
            title="实收金额"
            key="payOrderRealPayPrice"
            render={(rowInfo) => (
              <span>
                {rowInfo.payOrderRealPayPrice != null
                  ? rowInfo.payOrderRealPayPrice.toFixed(2)
                  : '-'}
              </span>
            )}
            width="6%"
          />
          <Column
            title="付款状态"
            key="payOrderStatus"
            dataIndex="payOrderStatus"
            render={(payOrderStatus) => (
              <span>{payOrderStatusDic[payOrderStatus || 0]}</span>
            )}
            width="6%"
          />
          <Column
            title="操作"
            render={(rowInfo) => this._renderOperate(rowInfo)}
            width="10%"
          />
        </DataGrid>
        <Modal
          maskClosable={false}
          title="请输入实收金额"
          visible={ondragoverRejeckviscomfig}
          okText="保存"
          onOk={() => this._handleOKcomfig()}
          onCancel={() => this._handleCancelms()}
        >
          {this.state?.mergFlag == false ? (
            <WrappedcomfigForm
              ref={(form) => {
                this._rejectForm = form;
              }}
            />
          ) : (
            <div>
              <Alert
                message="操作提示:"
                description="该订单为合并支付订单，确认后合并支付的其他订单将自动确认实收金额"
                type="info"
              />
              <MergeBill type={1} />
            </div>
          )}
        </Modal>
        <Modal
          maskClosable={false}
          title="请输入驳回原因"
          visible={orderRejectModalVisible}
          okText="确认"
          onOk={() => this._handleOK()}
          onCancel={() => this._handleCancel()}
        >
          {this.state?.mergFlag == true ? (
            <div>
              <Alert
                message="操作提示:"
                description="该订单为合并支付订单，确认后合并支付的其他订单将自动确认实收金额"
                type="info"
              />
              <MergeBill type={2} />
            </div>
          ) : null}
          <WrappedRejectForm
            ref={(form) => {
              this._rejectForm = form;
            }}
          />
        </Modal>
      </div>
    );
  }

  /**
   * 确认收款成功
   */
  _handleOKcomfig = () => {
    const { onAudit, onAudit_cart, onConfirm, hidecomfigModal } =
      this.props.relaxProps;
    if (this.state.mergFlag) {
      onConfirm(null, this.state.activitype, '', this.state.mergFlag);
      hidecomfigModal();
    } else {
      this._rejectForm.validateFields(null, (errs, values) => {
        //如果校验通过
        if (!errs) {
          // if(Number(values.commenasdt)>this.state.payOrderRealPayPrice){
          //   message.error('金额不能大于应收金额');
          //   return
          // }
          this._rejectForm.setFieldsValue({ commenasdt: '' });
          onConfirm(this.state.tdId, this.state.activitype, values.commenasdt);
          hidecomfigModal();
        }
      });
    }
  };
  2;
  /**
   * 处理成功
   */
  _handleOK = () => {
    const { onAudit, onAudit_cart, onNewAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        console.log(values, 'valuesvalues', this.state.activitype);
        if (this.state.mergFlag) {
          onAudit(
            this.state.selectedOrderId,
            'REJECTED',
            values.comment,
            this.state.mergFlag,
            this.state.activitype
          );
        } else {
          if (this.state.activitype == '0') {
            onAudit_cart(
              this.state.selectedOrderId,
              'REJECTED',
              values.comment
            );
          } else if (this.state.activitype == '3') {
            onNewAudit(this.state.selectedOrderId, 'REJECTED', values.comment);
          } else {
            onAudit(
              this.state.selectedOrderId,
              'REJECTED',
              values.comment,
              this.state.mergFlag
            );
          }
        }
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };
  /**
   * 处理确认收款取消
   */
  _handleCancelms = () => {
    const { hidecomfigModal } = this.props.relaxProps;
    hidecomfigModal();
    if (this.state.activitype != 0)
      this._rejectForm.setFieldsValue({ commenasdt: '' });
  };
  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperate(rowInfo) {
    const { onView } = this.props.relaxProps;

    const {
      payOrderId,
      payOrderStatus,
      payType,
      tradeState,
      activityType,
      orderCode,
      mergFlag,
      tids,
      payOrderRealPayPrice
    } = rowInfo;

    if (payType == 0) {
      return checkAuth('fetchPayOrderList') ? (
        <a href="javascript:void(0);" onClick={() => onView(payOrderId)}>
          查看
        </a>
      ) : (
        '-'
      );
    }

    //待确认
    if (payOrderStatus == 2) {
      return this._renderConfirmMenu(
        payOrderId,
        activityType,
        orderCode,
        mergFlag,
        tids,
        payOrderRealPayPrice
      );
    } else if (payOrderStatus == 1) {
      //未付款
      //线下
      if (payType == 1 && tradeState?.flowState != 'VOID') {
        return this._renderPayMenu(rowInfo);
      } else {
        return checkAuth('fetchPayOrderList') ? (
          <a href="javascript:void(0);" onClick={() => onView(payOrderId)}>
            查看
          </a>
        ) : (
          '-'
        );
      }
    } else {
      return checkAuth('fetchPayOrderList') ? (
        <a href="javascript:void(0);" onClick={() => onView(payOrderId)}>
          查看
        </a>
      ) : (
        '-'
      );
    }
  }

  _renderConfirmMenu = (
    id: string,
    activityType: any,
    orderCode,
    mergFlag,
    tids,
    payOrderRealPayPrice
  ) => {
    const { onConfirm, onView } = this.props.relaxProps;
    let isOnclick = 'auto';
    console.log(isOnclick, 'auto');
    return (
      <div className="operation-box">
        {checkAuth('fetchPayOrderList') && (
          <a href="javascript:void(0);" onClick={() => onView(id)}>
            查看
          </a>
        )}

        {checkAuth('fOrderDetail003') ? (
          <Popconfirm
            title="确认已线下收款？"
            // onCancel={() => {
            //   if (isOnclick == 'auto') {
            //     isOnclick = 'none';
            //   }
            //   this._renderConfirmMenu(id, activityType,orderCode);
            // }}
            onConfirm={() => {
              if (isOnclick == 'auto') {
                // onConfirm(id, activityType);
                // this._renderConfirmMenu(id, activityType, orderCode);
                this._showConfirm(
                  id,
                  orderCode,
                  activityType,
                  mergFlag,
                  tids,
                  payOrderRealPayPrice
                );
                isOnclick = 'none';
              }
              // if(isOnclick){
              //   setTimeout(() => {
              //     isOnclick = false
              //   },2000)
              // }
            }}
            okText="确认"
            cancelText="取消"
          >
            {/* style={{pointerEvents: isdisabled}} */}
            <a style={{ pointerEvents: isOnclick }} href="javascript:void(0);">
              确认
            </a>
          </Popconfirm>
        ) : (
          ''
        )}

        {checkAuth('fOrderDetail003') && (
          <a
            href="javascript:void(0);"
            onClick={() =>
              this._showRejectedConfirm(
                id,
                orderCode,
                activityType,
                mergFlag,
                tids
              )
            }
          >
            驳回
          </a>
        )}
        {/* {checkAuth('fOrderDetail003') && (
          <Menu.Item key="1">
            <Popconfirm
              title="确定作废这条收款记录？"
              onConfirm={() => {
                onDestory(id);
              }}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">作废</a>
            </Popconfirm>
          </Menu.Item>
        )} */}
      </div>
    );
  };

  /**
   * 确认收款订单确认提示
   * @private
   */
  _showConfirm = (
    tdId: string,
    orderCode: string,
    activityType,
    mergFlag: boolean,
    tids,
    payOrderRealPayPrice
  ) => {
    const { showcomfigModal } = this.props.relaxProps;
    this.setState(
      {
        selectedOrderId: orderCode,
        activitype: activityType,
        mergFlag: mergFlag,
        tdId,
        payOrderRealPayPrice
      },
      showcomfigModal(tids, mergFlag)
    );
  };

  /**
   * 驳回订单确认提示
   * @private
   */
  _showRejectedConfirm = (
    tdId: string,
    orderCode: string,
    activityType,
    mergFlag: boolean,
    tids
  ) => {
    console.log('====================================');
    console.log(tdId, 'tdId');
    console.log('====================================');
    const { showRejectModal } = this.props.relaxProps;
    this.setState(
      {
        selectedOrderId: orderCode,
        activitype: activityType,
        mergFlag: mergFlag,
        tdId
      },
      showRejectModal(tids, mergFlag)
    );
  };

  _renderPayMenu = (rowInfo) => {
    const { onCreateReceivable, onView } = this.props.relaxProps;

    return (
      <Menu>
        {checkAuth('fetchPayOrderList') && (
          <Menu.Item key="0">
            <a
              href="javascript:void(0);"
              onClick={() => onView(rowInfo.payOrderId)}
              style={{ color: '#F56C1D' }}
            >
              查看
            </a>
          </Menu.Item>
        )}

        {checkAuth('fOrderDetail003') && (
          <Menu.Item key="1">
            <a
              style={{ color: '#F56C1D' }}
              href="javascript:void(0);"
              onClick={() =>
                onCreateReceivable(
                  rowInfo.payOrderId,
                  rowInfo.tids,
                  rowInfo.mergFlag
                )
              }
            >
              新增收款记录
            </a>
          </Menu.Item>
        )}

        <Menu.Divider />
      </Menu>
    );
  };
}
