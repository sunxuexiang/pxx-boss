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
  Form,
  Alert,
  Input,
  message,
  Avatar
} from 'antd';
import { AuthWrapper, Const, noop, ValidConst, ImgPreview } from 'qmkit';
import ReceiveAdd from './receive-add';
import { IList } from 'typings/globalType';
import * as webapi from '../webapi';
import moment from 'moment';
import MergeBill from './merge-bill';
const { TextArea } = Input;
const FormItem = Form.Item;

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
      onSavePayOrder: Function;
      destroyOrder: Function;
      fetchOffLineAccounts: Function;
      addReceiverVisible: boolean;
      setReceiveVisible: Function;
      addReturnrVisible: boolean;
      onConfirm: Function;
      init: Function;
      onTabsChange: Function;
      setReturnVisible: Function;
      collectionVisible: boolean;
      setCollectionVisible: Function;
      onConfirmCollection: Function;
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
      returnPrice: null,
      gold: null,
      // 预览图片数据
      imgPreviewList: [],
      // 图片预览显示
      openPreview: false
    };
  }

  static relaxProps = {
    detail: 'detail',
    payRecord: 'payRecord',
    onSavePayOrder: noop,
    destroyOrder: noop,
    fetchOffLineAccounts: noop,
    addReceiverVisible: 'addReceiverVisible',
    addReturnrVisible: 'addReturnrVisible',
    setReceiveVisible: noop,
    init: noop,
    setReturnVisible: noop,
    onTabsChange: noop,
    onConfirm: noop,
    collectionVisible: 'collectionVisible',
    setCollectionVisible: noop,
    onConfirmCollection: noop
  };

  getColumns = (data) => {
    let imgCol = [];
    if (data && data[0] && data[0].ccbPayImg) {
      imgCol.push({
        title: '对公支付凭证',
        dataIndex: 'ccbPayImg',
        key: 'ccbPayImg',
        render: (img) => {
          return img ? (
            <div
              onClick={() => {
                this.setState({ imgPreviewList: [img], openPreview: true });
              }}
              style={{ cursor: 'pointer' }}
            >
              <Avatar
                style={{ lineHeight: 0 }}
                shape="square"
                size={64}
                src={img}
              />
            </div>
          ) : null;
        }
      });
    }

    return [
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
          moment(receiveTime).format(Const.TIME_FORMAT).toString()
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
              content={
                <div style={{ width: '375px' }}>
                  <img style={{ width: '100%' }} src={encloses} />
                </div>
              }
            >
              <a href="javascript:;">
                <img style={styles.attachment} src={encloses} />
              </a>
            </Popover>
          ) : (
            '无'
          )
      },
      ...imgCol,
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
  };

  render() {
    const { imgPreviewList, openPreview } = this.state;
    const {
      detail,
      payRecord,
      onSavePayOrder,
      fetchOffLineAccounts,
      addReceiverVisible,
      setReceiveVisible,
      addReturnrVisible,
      setReturnVisible,
      collectionVisible,
      setCollectionVisible,
      onConfirmCollection
    } = this.props.relaxProps;
    const id = detail.get('id');
    const totalPayCash = detail.getIn(['tradePrice', 'totalPrice']) || 0;
    const refundPrice =
      payRecord.get(0) &&
      payRecord.get(0).totalPrice - payRecord.get(0) &&
      payRecord.get(0).refundPrice;
    const payOrderStatus = payRecord.get(0) && payRecord.get(0).payOrderStatus;
    const payType = payRecord.get(0) && payRecord.get(0).payType;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    let payRecordList = payRecord.filter((param) => param.payOrderId != null);
    const { returnPrice, erpvalue, gold } = this.state;
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
            columns={this.getColumns(payRecordList.toJS())}
            dataSource={payRecordList.toJS()}
            pagination={false}
            bordered
          />
        </div>

        <Modal
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
        </Modal>

        <Modal
          maskClosable={false}
          title="确认收款"
          visible={collectionVisible}
          onOk={() => {
            onConfirmCollection();
          }}
          onCancel={() => {
            setCollectionVisible();
          }}
          okText="确认"
          cancelText="取消"
        >
          <Alert
            message="操作说明：
            该订单为合并支付订单，确认后合并支付的其他订单将自动确认收款"
            type="info"
            showIcon
          />
          <MergeBill />
        </Modal>

        <Modal
          maskClosable={false}
          title="
          退款操作"
          visible={addReturnrVisible}
          onOk={() => {
            this.detailReturn();
          }}
          onCancel={() => {
            setReturnVisible();
          }}
          okText="确认"
          cancelText="取消"
        >
          <Alert
            message="操作说明：
            退款金额不能大于该笔订单的剩余可退金额，订单剩余可退金额=订单实付总金额-已退金额（含退单中的需退款金额）"
            type="info"
            showIcon
          />
          <Form style={{ marginTop: 20 }}>
            <FormItem
              {...formItemLayout}
              label="退款金额"
              required={true}
              hasFeedback
            >
              <Input
                placeholder="输入退款金额"
                value={returnPrice}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    returnPrice: value
                  });
                }}
              />
            </FormItem>
            {/* <FormItem {...formItemLayout} label="退款鲸币" required={true} hasFeedback>
              <Input
                placeholder='输入退款鲸币'
                value={gold}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    gold: value
                  })
                }}
              />
            </FormItem> */}
            <FormItem {...formItemLayout} required={true} label="退款原因">
              <TextArea
                rows={3}
                maxLength={500}
                value={erpvalue}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    erpvalue: value
                  });
                }}
                placeholder="输入退款原因"
              />
            </FormItem>
          </Form>
        </Modal>
        {/* 图片预览 */}
        <ImgPreview
          visible={openPreview}
          imgList={imgPreviewList}
          close={() => {
            this.setState({ openPreview: false });
          }}
        />
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

  // 退款操作
  detailReturn = async () => {
    const { detail, payRecord, init, setReturnVisible, onTabsChange } =
      this.props.relaxProps;
    const refundPrice = (
      Number(payRecord.get(0) && payRecord.get(0).totalPrice) -
      Number(payRecord.get(0) && payRecord.get(0).refundPrice)
    ).toFixed(2);
    const { returnPrice, erpvalue, gold } = this.state;
    if (!ValidConst.price.test(returnPrice)) {
      return message.error('请输入正确的金额');
    }

    console.log('====================================');
    console.log(returnPrice, refundPrice, 'returnPrice > refundPrice');
    console.log('====================================');
    if (!erpvalue) {
      return message.error('请输入退款原因');
    }
    setReturnVisible();
    message.success('退款中');
    const { res } = await webapi.detailReturn({
      orderCode: detail.toJS().id,
      refundPrice: Number(returnPrice),
      // gold:Number(gold),
      refuseReason: erpvalue
    });
    // console.log('====================================');
    // console.log(detail.toJS(), 'detaildetail', res);
    // console.log('====================================');
    if ((res as any).code != Const.SUCCESS_CODE) {
      message.error((res as any).message);
    } else {
      message.success('操作成功');
      onTabsChange('4');
      init(detail.toJS().id);
    }
  };

  _renderOperator(payRecord) {
    console.log(payRecord, 'payRecordpayRecordpayRecord');

    const { setReturnVisible } = this.props.relaxProps;
    if (payRecord.payOrderStatus == '2' && payRecord.payType == '1') {
      return (
        <AuthWrapper functionName={'fOrderDetail009'}>
          {payRecord.isDisplay && (
            <AuthWrapper functionName={'fOrderDetailReturn'}>
              <Button
                type="primary"
                onClick={() => {
                  setReturnVisible();
                }}
              >
                退款
              </Button>
            </AuthWrapper>
          )}
          <Dropdown overlay={this._renderMenu(payRecord)}>
            <a className="ant-dropdown-link">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
        </AuthWrapper>
      );
    } else {
      if (payRecord.isDisplay) {
        return (
          <AuthWrapper functionName={'fOrderDetailReturn'}>
            <Button
              type="primary"
              onClick={() => {
                setReturnVisible();
              }}
            >
              退款
            </Button>
          </AuthWrapper>
        );
      } else {
        return '-';
      }
    }
  }

  _renderMenu = (row) => {
    const { onConfirm, setCollectionVisible } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a
            onClick={() => {
              if (row.mergFlag) {
                setCollectionVisible(row);
              } else {
                onConfirm([row.payOrderId]);
              }
            }}
          >
            确认
          </a>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };
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
