import React from 'react';
import { IMap, Relax } from 'plume2';
import {
  Button,
  Dropdown,
  Icon,
  Menu,
  Modal,
  Popover,
  Table,
  Tooltip,
  Alert,
  Form,
  Input
} from 'antd';
import { AuthWrapper, Const, noop } from 'qmkit';
import ReceiveAdd from './receive-add';
import { IList } from 'typings/globalType';
import moment from 'moment';
import RefundModalForm  from './refund-modal-form';
const FormItem=Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

/**
 * 订单收款记录
 */
@Relax
export default class OrderReceive extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      payRecord: IList;
      // onSavePayOrder: Function;
      destroyOrder: Function;
      fetchOffLineAccounts: Function;
      // addReceiverVisible: boolean;
      // setReceiveVisible: Function;
      // onConfirm: Function;
      setReturnVisible:Function;

      // addReturnrVisible: boolean;
    };
  };

  /*state: {
    addReceiverVisible: boolean;
  }*/

  constructor(props) {
    super(props);
    /*this.state = {
      addReceiverVisible: false
    }*/
    this.state = {
      erpvalue: null,
      returnPrice: null
    }
  }

  static relaxProps = {
    detail: 'detail',
    payRecord: 'payRecord',
    // onSavePayOrder: noop,
    destroyOrder: noop,
    fetchOffLineAccounts: noop,
    // addReceiverVisible: 'addReceiverVisible',
    // setReceiveVisible: noop,
    // onConfirm: noop,
    setReturnVisible:noop,
    // addReturnrVisible: boolean;
  };

  //收款列表
  receiveColumns = [
    {
      title: '收款流水号',
      dataIndex: 'receivableNo',
      key: 'receivableNo'
    },
    {
      title: '收款时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      render: (receiveTime) =>
        receiveTime &&
        moment(receiveTime)
          .format(Const.TIME_FORMAT)
          .toString()
    },
    {
      title: '实收金额',
      dataIndex: 'payOrderPrice',
      key: 'payOrderPrice',
      render: (text, record) =>
        record.payOrderStatus == 1 ? '' : '￥' + (text || 0).toFixed(2)
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      key: 'payType',
      render: (payType) => payTypeDic[payType]
    },
    {
      title: '收款账户',
      dataIndex: 'receivableAccount',
      key: 'receivableAccount',
      render: (receivableAccount) =>
        receivableAccount ? receivableAccount : '-'
    },
    {
      title: '附件',
      dataIndex: 'encloses',
      key: 'encloses',
      render: (encloses) =>
        encloses ? (
          <Popover
            key={'encloses'}
            placement="topRight"
            title={''}
            trigger="click"
            content={<img style={styles.attachmentView} src={encloses} />}
          >
            <a href="javascript:;">
              <img style={styles.attachment} src={encloses} />
            </a>
          </Popover>
        ) : (
          '无'
        )
    },
    {
      title: '状态',
      dataIndex: 'payOrderStatus',
      key: 'payOrderStatus',
      render: (payOrderStatus) => payOrderStatusDic[payOrderStatus]
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <span>
          {comment ? (
            <Tooltip title={this._renderComment(comment)} placement="top">
              <a href="javascript:void(0);">查看</a>
            </Tooltip>
          ) : (
            '无'
          )}
        </span>
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_text, record) => this._renderOperator(record)
    }
  ];

  render() {
    const {
      detail,
      payRecord,
      // onSavePayOrder,
      fetchOffLineAccounts,
      // addReceiverVisible,
      // setReceiveVisible,
    } = this.props.relaxProps;
    const id = detail.get('id');
    const totalPayCash = detail.getIn(['tradePrice', 'totalPrice']) || 0;

    const payOrderStatus = payRecord.get(0) && payRecord.get(0).payOrderStatus;
    const payType = payRecord.get(0) && payRecord.get(0).payType;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    let payRecordList = payRecord.filter((param) => param.payOrderId != null);
    return (
      <div style={styles.container}>
        <div style={styles.addReceive}>
          <div style={styles.orderInfo}>
            <label style={styles.orderNum}>
              订单号：{id}&nbsp;&nbsp;&nbsp;&nbsp; 应收金额：￥
              {(totalPayCash || 0).toFixed(2)}
            </label>
          </div>
          {payOrderStatus == '1' && payType == 1 && flowState != 'VOID' && (
            <div style={styles.addReceiveButton as any}>
              <AuthWrapper functionName={'fOrderDetail009'}>
                <Button
                  onClick={() => {
                    fetchOffLineAccounts(payRecord);
                  }}
                >
                  添加收款记录
                </Button>
              </AuthWrapper>
            </div>
          )}
        </div>

        <div>
          <Table
            columns={this.receiveColumns}
            dataSource={payRecordList.toJS()}
            pagination={false}
            bordered
          />
        </div>
        <RefundModalForm></RefundModalForm>

        {/* <Modal
          maskClosable={false}
          title="添加收款记录"
          visible={addReceiverVisible}
          onOk={() => {
            this['_receiveAdd']['_form'].validateFields(
              null,
              (errs, values) => {
                //如果校验通过
                if (!errs) {
                  values.createTime = values.createTime.format('YYYY-MM-DD');
                  onSavePayOrder(values);
                }
              }
            );
          }}
          onCancel={() => {
            setReceiveVisible();
          }}
          okText="确认"
          cancelText="取消"
        >
          <ReceiveAdd
            ref={(_receiveAdd) => (this['_receiveAdd'] = _receiveAdd)}
          />
        </Modal> */}
      </div>
    );
  }

  /**
   * 作废发货记录提示
   * @private
   */
  _showDestroyConfirm = (payId: string) => {
    const { destroyOrder } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '提示',
      content: '是否确认作废这条收款记录',
      onOk() {
        destroyOrder(payId);
      },
      onCancel() {}
    });
  };

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperator(payRecord) {
    const {setReturnVisible}=this.props.relaxProps;
    if (payRecord.payOrderStatus == '2' && payRecord.payType == '1') {
      return (
        <AuthWrapper functionName={'fOrderDetail009'}>
          {payRecord.isDisplay &&
            <AuthWrapper functionName={'f_thOrderDetailReturn'}>
              <Button
                type="primary"
                onClick={() => {
                  setReturnVisible(payRecord);
                }}
              >
                退款
              </Button>
            </AuthWrapper>
          } 
          {/* <Dropdown overlay={this._renderMenu(payRecord.payOrderId)}>
            <a className="ant-dropdown-link">
              操作 <Icon type="down" />
            </a>
          </Dropdown> */}
        </AuthWrapper>
      );
    } else {
      if (payRecord.isDisplay) {
        return (
        <AuthWrapper functionName={'f_thOrderDetailReturn'}>
          <Button
            type="primary"
            onClick={() => {
              setReturnVisible(payRecord);
            }}
          >
            退款
          </Button>
        </AuthWrapper>
        )
      } else {
        return '-'
      }
    }
  }

//   _renderMenu = (id: string) => {
//     const { onConfirm } = this.props.relaxProps;

//     return (
//       <Menu>
//         <Menu.Item key="0">
//           <a onClick={() => onConfirm(id)}>确认</a>
//         </Menu.Item>
//         <Menu.Divider />
//       </Menu>
//     );
//   };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  addReceive: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 15
  },
  orderInfo: {
    display: 'flex',
    flexGrow: 7,
    alignItems: 'center'
  },
  addReceiveButton: {
    display: 'flex',
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  orderNum: {
    fontSize: 14
  } as any,
  attachment: {
    width: 30,
    height: 30
  },
  attachmentView: {
    maxWidth: 500,
    maxHeight: 400
  }
} as any;
