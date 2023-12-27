import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { message, Modal, Table } from 'antd';
import { IMap } from 'typings/globalType';
import { AuthWrapper, checkAuth, Const, noop } from 'qmkit';
import ModalVoucher from '../../balance-apply/components/modal-voucher';
import ImgModal from './imgModal';

const { confirm } = Modal;

/**
 * 退款记录 💵
 */
@Relax
export default class ReturnRecord extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refundRecord: IMap;
      onRefundDestroy: Function;
      detail: IMap;
      init: Function;
      onRefundModalChange: Function;
      onOnlineRefund: Function;
      onOfflineRefund: Function;
      onCloseRefund: Function;
      checkRefundStatus: Function;
      queryCustomerOfflineAccount: Function;
      onUploadImg: Function;
    };
  };

  state={
    visible: false,
    imgVisible: false,
    urlList: []
  }

  setVisible = (blo) => {
    this.setState({visible: blo})
  }


  static relaxProps = {
    refundRecord: 'refundRecord',
    onRefundDestroy: noop,
    detail: 'detail',
    init: noop,
    onRefundModalChange: noop,
    onOnlineRefund: noop,
    onOfflineRefund: noop,
    onCloseRefund: noop,
    checkRefundStatus: noop,
    queryCustomerOfflineAccount: noop,
    onUploadImg: noop,
  };


  changeImg = (imgList) => {
    const { onUploadImg, refundRecord } = this.props.relaxProps;
    let row = refundRecord.toJS();
    let arr = imgList.map(itemUrl => {
      return {
        refundId: row.refundId,
        refundBillType: 2,
        refundBelongBillId: row.returnOrderCode,
        manualRefundPaymentVoucherImg: itemUrl,
      }
    })
    onUploadImg(arr, row);
    this.setVisible(false);
    // onUploadImg(imgList, )
  }


  constructor(props) {
    super(props);
  }

  columns = [
    {
      title: '退款流水号',
      dataIndex: 'refundBillCode',
      key: 'refundBillCode',
      render: (text) => {
        const { detail } = this.props.relaxProps;
        return detail.get('returnFlowState') == 'COMPLETED' ? text : '-';
      }
    },
    {
      title: '退款时间',
      dataIndex: 'refundBillTime',
      key: 'refundBillTime',
      render: (refundBillTime, rowData) =>
          refundBillTime? moment(refundBillTime).format(
          rowData.payType == 0 ? Const.TIME_FORMAT : Const.DAY_FORMAT
        ):'-'
    },
    {
      title: '应退积分',
      dataIndex: 'returnPoints',
      key: 'returnPoints',
      render: (returnPoints) => <div>{returnPoints}</div>
    },
    {
      title: '应退金额',
      dataIndex: 'returnPrice',
      key: 'returnPrice',
      render: (returnPrice) => <div>￥{returnPrice.toFixed(2)}</div>
    },
    {
      title: '退单改价',
      dataIndex: 'actualReturnPrice',
      key: 'actualReturnPrice',
      render: (price) => <div>￥{price.toFixed(2)}</div>
    },
    // {
    //   title: '应退金额',
    //   dataIndex: 'actualReturnPrice',
    //   key: 'actualReturnPrice',
    //   render: (price) => <div>￥{price && price.toFixed(2)}</div>
    // },
    // {
    //   title: '退单改价',
    //   dataIndex: 'returnPrice',
    //   key: 'returnPrice',
    //   render: (returnPrice) => <div>￥{returnPrice.toFixed(2)}</div>
    // },
    {
      title: '退款方式',
      dataIndex: 'payType',
      key: 'payType',
      render: (payType) => Const.payType[payType]
    },
    {
      title: '退款账户',
      dataIndex: 'returnAccountName',
      key: 'returnAccountName',
      render: (returnAccountName) => returnAccountName || '-'
    },
    {
      title: '客户收款账户',
      dataIndex: 'customerAccount',
      key: 'customerAccount',
      render: () => {
        const { detail } = this.props.relaxProps;
        const customerAccount = detail.get('customerAccount');
        if (customerAccount != null) {
          const bankName = customerAccount.get('bankName')
            ? customerAccount.get('bankName')
            : customerAccount.get('customerBankName');
          return `${bankName} ${this._parseBankNo(
            customerAccount.get('customerAccountNo')
          )}`;
        } else {
          return '-';
        }
      }
    },
    {
      title: '退款状态',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: (refundStatus) => Const.refundStatus[refundStatus]
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (comment ? comment : '无')
    },
    {
      title: '退款凭证',
      dataIndex: '',
      key: '',
      render: () => {
        return <a href="javascript:void(0);" onClick={() => { this.setState({ imgVisible: true }) }}>查看凭证</a>
      }
    },
    {
      title: '操作',
      dataIndex: 'refundId',
      key: 'operate',
      render: (value, row) => {
        const {
          detail,
          onOnlineRefund,
          onOfflineRefund,
          onCloseRefund
        } = this.props.relaxProps;
        const rid = detail.get('id');
        const customerId = detail.getIn(['buyer', 'id']);
        // 支付方式 0在线 1线下
        const payType = detail.get('payType');
        const returnFlowState = detail.get('returnFlowState');
        // 总额
        const totalPrice = detail.getIn(['returnPrice', 'totalPrice']);
        // 改价金额
        const applyPrice = detail.getIn(['returnPrice', 'applyPrice']);
        // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
        const payPrice = applyPrice || totalPrice;
        if (returnFlowState === 'REFUND_FAILED') {
          return [
            <AuthWrapper functionName="rodf002">
              <a
                href="javascript:void(0)"
                onClick={async () => {
                  // 校验是否有退款权限, rodf002 为退款权限的功能编号
                  const haveAuth = checkAuth('rodf002');
                  if (haveAuth) {
                    if (payType == 1) {
                      this._showOfflineRefund(
                        onOfflineRefund,
                        rid,
                        customerId,
                        payPrice
                      );
                    } else {
                      this._showOnlineRefund(onOnlineRefund, rid);
                    }
                  } else {
                    message.error('此功能您没有权限访问');
                  }
                }}
              >
                退款
              </a>
            </AuthWrapper>,
            <AuthWrapper functionName="rodf003">
              <a
                href="javascript:void(0)"
                style={{ marginLeft: 20 }}
                onClick={async () => {
                  // 校验是否有关闭退款权限
                  const haveAuth = checkAuth('rodf002');
                  if (haveAuth) {
                    this._showCloseRefund(onCloseRefund, rid);
                  } else {
                    message.error('此功能您没有权限访问');
                  }
                }}
              >
                关闭退款
              </a>
            </AuthWrapper>,
            <a
            href="javascript:void(0);" 
            onClick={() => {
              let arr = []
              row.manualRefundImgVOList?.forEach(item => {
                arr.push(item.manualRefundPaymentVoucherImg);
              })
              this.setState({ visible: true, urlList: arr })
            }}
          >上传凭证</a>
          ];
        } else {
          return <a
          href="javascript:void(0);" 
          onClick={() => {
            let arr = []
            row.manualRefundImgVOList?.forEach(item => {
              arr.push(item.manualRefundPaymentVoucherImg);
            })
            this.setState({ visible: true, urlList: arr })
          }}
        >上传凭证</a>;
        }
      }
    }
  ];

  render() {
    const { refundRecord } = this.props.relaxProps;

    const list: Array<any> =
      refundRecord && refundRecord.get('refundBillCode')
        ? [refundRecord.toJS()]
        : [];

    return list.length > 0 ? (
      <div style={styles.container}>
        <div className="detailTitle" style={{ marginBottom: 10 }}>
          退款记录
        </div>
        <Table
          rowKey="refundId"
          columns={this.columns}
          dataSource={list}
          pagination={false}
          bordered
        />
        { this.state.visible ? (
          <ModalVoucher visible={this.state.visible} setVoucherVisible={this.setVisible} updataImgSubmit={this.changeImg} defaultList={this.state.urlList} size={3} />
        ) : null }
        <ImgModal visible={this.state.imgVisible} close={() => { this.setState({imgVisible: false}) }} imgList={list[0].manualRefundImgVOList} />
      </div>
    ) : null;
  }

  _handleClickDestroy(refundId: string) {
    const { onRefundDestroy } = this.props.relaxProps;

    confirm({
      title: '作废',
      content: '是否确认作废这条退款记录？',
      onOk() {
        return onRefundDestroy(refundId);
      },
      onCancel() {}
    });
  }

  _parseBankNo(bankNo: string) {
    if (!bankNo || bankNo.length <= 9) {
      return '****';
    }
    if (bankNo.length > 9) {
      return `${bankNo.substring(0, 4)}****${bankNo.substring(
        bankNo.length - 4,
        bankNo.length
      )}`;
    }
  }

  // 在线退款
  async _showOnlineRefund(onOnlineRefund: Function, rid: string) {
    const { checkRefundStatus, init, detail } = this.props.relaxProps;
    let confirmContent:Array<any> = [
      <div>是否确认退款？退款后钱款将原路退回对方账户,使用积分将原路退回。</div>
    ];
    // 支付渠道
    const payWay = detail.get('payWay');
    payWay && confirmContent.push(<div>退款渠道：{Const.payWay[payWay]}</div>);
    const { res } = await checkRefundStatus(rid);
    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '在线退款',
        content: confirmContent,
        okText: '退款',
        onOk() {
          return onOnlineRefund(rid);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
      setTimeout(() => init(rid), 2000);
    }
  }

  // 线下退款
  _showOfflineRefund(
    onOfflineRefund: Function,
    rid: string,
    customerId: string,
    refundAmount: number
  ) {
    const { queryCustomerOfflineAccount } = this.props.relaxProps;
    queryCustomerOfflineAccount();
    this.props.relaxProps.onRefundModalChange({
      visible: true,
      onOk: onOfflineRefund,
      rid: rid,
      customerId: customerId,
      refundAmount: refundAmount
    });
  }

  // 关闭退款
  async _showCloseRefund(onCloseRefund: Function, rid: string) {
    const { checkRefundStatus, init } = this.props.relaxProps;
    const { res } = await checkRefundStatus(rid);

    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '关闭退款',
        content: '请确认是否已完成退款。',
        onOk() {
          return onCloseRefund(rid);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
      setTimeout(() => init(rid), 2000);
    }
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
} as any;
