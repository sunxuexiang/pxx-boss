import React from 'react';
import { Relax } from 'plume2';
import {
  Col,
  Modal,
  Row,
  Table,
  Popover,
  Timeline,
  Button,
  InputNumber,
  message
} from 'antd';
import { IList, IMap } from 'typings/globalType';
import { Const, noop, Logistics } from 'qmkit';
import Moment from 'moment';
import { fromJS } from 'immutable';

/**
 * 订单发货记录
 */
@Relax
export default class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: []
    };
  }

  props: {
    relaxProps?: {
      detail: IMap;
      deliver: Function;
      confirm: Function;
      changeDeliverNum: Function;
      showDeliveryModal: Function;
      modalVisible: boolean;
      formData: IMap;
      hideDeliveryModal: Function;
      saveDelivery: Function;
      obsoleteDeliver: Function;
      changeGiftsDeliverNum: Function;
      onOrderPicking: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    deliver: noop,
    confirm: noop,
    changeDeliverNum: noop,
    showDeliveryModal: noop,
    modalVisible: 'modalVisible',
    formData: 'formData',
    hideDeliveryModal: noop,
    saveDelivery: noop,
    obsoleteDeliver: noop,
    changeGiftsDeliverNum: noop,
    onOrderPicking: noop
  };

  render() {
    const { detail, deliver, modalVisible, saveDelivery, onOrderPicking } =
      this.props.relaxProps;
    const tradeDelivers = detail.get('tradeDelivers') as IList;
    const pickUpFlag = detail.get('deliverWay');
    let showPickUp = pickUpFlag === '3';
    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
    };
    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map(
      (gift) =>
        gift
          .set('skuName', `【赠品】${gift.get('skuName')}`)
          .set('levelPrice', 0)
    );
    //是否自营商家订单
    const isSelf = detail.getIn(['supplier', 'isSelf']);
    const logisticsCompanyInfo = detail.get('logisticsCompanyInfo');
    const flowState = detail.getIn(['tradeState', 'flowState']);

    const userInfo = JSON.parse(
      sessionStorage.getItem('s2b-platform@login') || '{}'
    );
    const payState = detail.getIn(['tradeState', 'payState']);
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(detail.get('deliverWay') == 1 || detail.get('deliverWay') == 8) && (
            <div>
              <h4>客户物流信息</h4>
              <Row>
                <Col style={{ width: '50%' }}>
                  <p style={styles.darkText}>
                    【物流公司】
                    {logisticsCompanyInfo &&
                    logisticsCompanyInfo.get('logisticsCompanyName')
                      ? logisticsCompanyInfo.get('logisticsCompanyName')
                      : '由大白鲸代选物流'}
                  </p>
                  <p style={styles.darkText}>
                    【收货站点】
                    {logisticsCompanyInfo &&
                    logisticsCompanyInfo.get('receivingPoint')
                      ? logisticsCompanyInfo.get('receivingPoint')
                      : '-'}
                  </p>
                  <p style={styles.darkText}>
                    【添加物流公司】物流公司名称:
                    {logisticsCompanyInfo &&
                    logisticsCompanyInfo.get('logisticsCompanyName')
                      ? logisticsCompanyInfo.get('logisticsCompanyName')
                      : '-'}
                    &nbsp;&nbsp; 物流公司电话:
                    {logisticsCompanyInfo &&
                    logisticsCompanyInfo.get('logisticsCompanyPhone')
                      ? logisticsCompanyInfo.get('logisticsCompanyPhone')
                      : '-'}
                    &nbsp;&nbsp; 收货站点:
                    {logisticsCompanyInfo &&
                    logisticsCompanyInfo.get('receivingPoint')
                      ? logisticsCompanyInfo.get('receivingPoint')
                      : '-'}
                  </p>
                </Col>
              </Row>
            </div>
          )}
          {/* {flowState === 'AUDIT' &&
          payState === 'PAID' &&
          ['system', '13068208375', '18374975168', '18188888888'].includes(
            userInfo.accountName
          ) ? (
            <div style={{ height: '40px', lineHeight: '40px' }}>
              {detail.get('pickingStatus') ? (
                <Button
                  type="primary"
                  onClick={() => {
                    deliver();
                  }}
                >
                  发货
                </Button>
              ) : (
                <Button
                  type="primary"
                  style={{ marginRight: '16px' }}
                  onClick={() => {
                    Modal.confirm({
                      title: '是否已拣货',
                      onOk: () => {
                        onOrderPicking();
                      }
                    });
                  }}
                >
                  拣货
                </Button>
              )}
            </div>
          ) : null} */}
          <Table
            columns={
              showPickUp
                ? this._deliveryColumnsToPickUp()
                : this._deliveryColumns()
            }
            dataSource={detail.get('tradeItems').concat(gifts).toJS()}
            pagination={false}
            bordered
          />
        </div>
        {tradeDelivers.count() > 0
          ? tradeDelivers.map((v, i) => {
              const logistic = v.get('logistics');
              const deliverTime = v.get('deliverTime')
                ? Moment(v.get('deliverTime')).format(Const.DAY_FORMAT)
                : null;
              //处理赠品
              const deliversGifts = (
                v.get('giftItemList') ? v.get('giftItemList') : fromJS([])
              ).map((gift) => {
                return gift.set('itemName', `【赠品】${gift.get('itemName')}`);
              });
              return (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div className="detailTitle" style={styles.title}>
                    发货记录
                  </div>
                  <Table
                    columns={this._deliveryRecordColumns()}
                    dataSource={v
                      .get('shippingItems')
                      .concat(deliversGifts)
                      .toJS()}
                    pagination={false}
                    bordered
                  />

                  <div style={styles.expressBox as any}>
                    <div style={styles.stateBox}>
                      {!['01', null].includes(logistic) ? (
                        <label style={styles.information}>
                          子单：{v.get('tradeId')}&nbsp;&nbsp; 商家：
                          {v.get('providerName')}
                          <br />
                          【物流信息】发货日期：{deliverTime}
                          物流公司：{logistic.get('logisticCompanyName')}{' '}
                          物流单号：{logistic.get('logisticNo')}
                          物流联系方式：{logistic.get('logisticPhone')}
                          {isSelf && (
                            <Logistics
                              companyInfo={logistic}
                              deliveryTime={deliverTime}
                              consignee={consignee}
                            />
                          )}
                          <br />
                          {/* 配送到店 已发货订单显示接货点 */}
                          {[
                            'DELIVERED',
                            'CONFIRMED',
                            'COMPLETED',
                            'VOID'
                          ].includes(flowState) &&
                            detail.get('deliverWay') == 7 && (
                              <span>
                                接货点: {logistic.get('shipmentSiteName')}
                              </span>
                            )}
                          {/* <Popover
                            placement="bottomLeft"
                            content={
                              <div
                                className="order-delivery"
                                style={{ maxWidth: 560 }}
                              >
                                <div
                                  className="order-delivery-head clearfix"
                                  style={{ marginBottom: 15 }}
                                >
                                  <ul className="pull-left">
                                    <li>
                                      物流公司：
                                      {detail
                                        ?.get('logistics')
                                        ?.get('nickName')}
                                    </li>
                                    <li>
                                      物流单号：
                                      {detail?.get('logistics')?.get('ecId')}
                                    </li>
                                    <li>
                                      发货时间:&nbsp;&nbsp;&nbsp;
                                      {detail
                                        ?.get('logistics')
                                        ?.get('createTime')}
                                    </li>
                                  </ul>
                                  <br />
                                  <br />
                                  <Timeline>
                                    {(
                                      detail
                                        ?.get('logistics')
                                        ?.get('logisticsData')
                                        ?.toJS() || []
                                    ).map((item, index) => {
                                      return (
                                        <Timeline.Item>
                                          {item.memo} {item.time}
                                        </Timeline.Item>
                                      );
                                    })}
                                  </Timeline>
                                </div>
                              </div>
                            }
                          >
                            <a href="javascript:;">&nbsp;实时物流&nbsp;</a>
                          </Popover> */}
                        </label>
                      ) : (
                        '暂无物流信息'
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : null}
        <Modal
          visible={modalVisible}
          width={1000}
          onOk={() => {
            const gifts = detail.get('gifts');
            const shippingItemList = detail
              .get('tradeItems')
              .concat(gifts)
              .filter((v) => {
                return v.get('deliveringNum') != 0;
              })
              .map((v) => {
                return {
                  skuId: v.get('skuId'),
                  itemNum: v.get('deliveringNum')
                };
              })
              .toJS();
            if (shippingItemList.length <= 0) {
              message.error('请填写发货数量');
            } else {
              saveDelivery();
            }
          }}
          onCancel={() => {
            this._hideDeliveryModal();
          }}
        >
          <Table
            columns={this._deliverColumns()}
            dataSource={detail.get('tradeItems').concat(gifts).toJS()}
            pagination={false}
            bordered
          ></Table>
        </Modal>
        <div style={styles.expressBox as any}>
          <div style={styles.stateBox} />
        </div>
      </div>
    );
  }

  _deliveryColumns = () => {
    return [
      {
        title: '序号',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (text) => text
      },
      {
        title: '商品名称',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '生产日期',
        dataIndex: 'goodsBatchNo',
        key: 'goodsBatchNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '已发货数',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (deliveredNum) => (deliveredNum ? deliveredNum : 0)
      }
    ];
  };

  _deliveryColumnsToPickUp = () => {
    return [
      {
        title: '序号',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (text) => text
      },
      {
        title: '商品名称',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '生产日期',
        dataIndex: 'goodsBatchNo',
        key: 'goodsBatchNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      }
    ];
  };

  _deliverColumns = () => {
    const { changeDeliverNum } = this.props.relaxProps;
    return [
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: '商品名称',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '订单数量',
        dataIndex: 'num',
        key: 'num_2'
      },
      {
        title: '已发货数量',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (deliveredNum) => (deliveredNum ? deliveredNum : 0)
      },
      {
        title: '可发货数量',
        dataIndex: 'num',
        key: 'num_1',
        render: (text, record) => {
          return (text || 0) - (record.deliveredNum || 0);
        }
      },
      {
        title: '发货数量',
        dataIndex: 'deliveringNum',
        key: 'deliveringNum',
        render: (text, record, index) => {
          return (
            <InputNumber
              defaultValue={text}
              onChange={(num) => {
                changeDeliverNum(
                  index,
                  num,
                  record.isGift ? 'gifts' : 'tradeItems'
                );
              }}
              min={0}
              max={(record.num || 0) - (record.deliveredNum || 0)}
            />
          );
        }
      }
    ];
  };

  _deliveryRecordColumns = () => {
    return [
      {
        title: '序号',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: '商品名称',
        dataIndex: 'itemName',
        key: 'itemName'
      },
      {
        title: '规格',
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: '生产日期',
        dataIndex: 'listNo',
        key: 'listNo',
        render: (param) => {
          return param ? <div>{param}</div> : <div>{param}</div>;
        }
      },
      {
        title: '本次发货数',
        dataIndex: 'itemNum',
        key: 'itemNum'
      }
    ];
  };

  /**
   * 显示发货弹框
   */
  _showDeliveryModal = () => {
    const { showDeliveryModal } = this.props.relaxProps;
    showDeliveryModal();
  };

  /**
   * 关闭发货modal
   * @private
   */
  _hideDeliveryModal = () => {
    const { hideDeliveryModal } = this.props.relaxProps;
    hideDeliveryModal();
  };

  /**
   * 作废发货记录提示
   * @private
   */
  _showCancelConfirm = (tdId: string) => {
    const { obsoleteDeliver } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '提示',
      content: '是否确认作废这条发货记录',
      onOk() {
        obsoleteDeliver(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = () => {
    const { confirm, detail } = this.props.relaxProps;
    const tid = detail.get('id');
    const confirmModal = Modal.confirm;
    confirmModal({
      title: '确认收货',
      content: '确认已收到全部货品?',
      onOk() {
        confirm(tid);
      },
      onCancel() {}
    });
  };
}

const styles = {
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  title: {
    marginTop: 10,
    marginBottom: 10
  },
  expressBox: {
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  expressOp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  information: {
    marginBottom: 10
  } as any
} as any;
