import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Col, Modal, Row, Table } from 'antd';
import { Const, ImageModal, noop } from 'qmkit';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';

const columns = [
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
    title: '销售单价',
    dataIndex: 'levelPrice',
    key: 'levelPrice',
    render: (levelPrice) => <span>￥{levelPrice.toFixed(2)}</span>
  },
  {
    title: '囤货数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '已提数量',
    key: 'useNum',
    render: (row) => <span>{row.useNum ? row.useNum : 0}</span>
  },
  {
    title: '未提数量',
    key: '1',
    render: (row) => <span>{(row.num || 0) - (row.useNum || 0)}</span>
  },
  {
    title: '商品总价',
    render: (row) => <span>￥{(row.num * row.levelPrice).toFixed(2)}</span>
  },

  {
    title: '折扣金额',
    render: (row) => (
      <span>￥{(row.num * row.price - row.splitPrice).toFixed(2)}</span>
    )
  },
  {
    title: '实付金额',
    render: (row) => (
      <span>
        ￥
        {(
          row.num * row.levelPrice -
          (row.num * row.price - row.splitPrice)
        ).toFixed(2)}
      </span>
    )
  }
];

const invoiceContent = (invoice) => {
  let invoiceContent = '';

  if (invoice.type == '0') {
    invoiceContent += '普通发票';
  } else if (invoice.type == '1') {
    invoiceContent += '增值税发票';
  } else if (invoice.type == '-1') {
    invoiceContent += '不需要发票';
    return invoiceContent;
  }

  invoiceContent += ' ' + (invoice.projectName || '');

  if (invoice.type == 0 && invoice.generalInvoice.flag) {
    invoiceContent += ' ' + (invoice.generalInvoice.title || '');
    invoiceContent += ' ' + invoice.generalInvoice.identification;
  } else if (invoice.type == 1 && invoice.specialInvoice) {
    invoiceContent += ' ' + invoice.specialInvoice.companyName;
    invoiceContent += ' ' + invoice.specialInvoice.identification;
  }
  return invoiceContent;
};

const flowState = (status) => {
  if (status == 'INIT') {
    return '待审核';
  } else if (status == 'GROUPON') {
    return '待成团';
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return '待发货';
  } else if (status == 'DELIVERED') {
    return '待收货';
  } else if (status == 'CONFIRMED') {
    return '已收货';
  } else if (status == 'COMPLETED') {
    return '已完成';
  } else if (status == 'VOID') {
    return '已作废';
  } else if (status == 'TOPICKUP') {
    return '待自提';
  }
};

type TList = List<any>;

/**
 * 订单详情
 */
@Relax
export default class OrderDetailTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      payRecord: TList;
      // onAudit: Function;
      // confirm: Function;
      // retrial: Function;
      sellerRemarkVisible: boolean;
      // setSellerRemarkVisible: Function;
      // remedySellerRemark: Function;
      // setSellerRemark: Function;
      // verify: Function;
      // onDelivery: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    payRecord: 'payRecord',
    // onAudit: noop,
    // confirm: noop,
    // retrial: noop,
    sellerRemarkVisible: 'sellerRemarkVisible'
    // setSellerRemarkVisible: noop,
    // remedySellerRemark: noop,
    // setSellerRemark: noop,
    // verify: noop,
    // onDelivery: noop
  };
  render() {
    const { detail } = this.props.relaxProps;
    const { payRecord } = this.props.relaxProps;
    let orderSource = detail.get('orderSource');
    let orderType = '';
    if (orderSource == 'WECHAT') {
      orderType = 'H5订单';
    } else if (orderSource == 'APP') {
      orderType = 'APP订单';
    } else if (orderSource == 'PC') {
      orderType = 'PC订单';
    } else if (orderSource == 'LITTLEPROGRAM') {
      orderType = '小程序订单';
    } else {
      orderType = '代客下单';
    }

    //当前的订单号
    const tradeItems = detail.get('tradeItems').toJS();
    //赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
    gifts = gifts
      .map((gift) =>
        gift
          .set('skuName', '【赠品】' + gift.get('skuName'))
          .set('levelPrice', 0)
      )
      .toJS();
    const tradeMarketings = detail.toJS().tradeMarketings
      ? detail
          .toJS()
          .tradeMarketings.filter(
            (item) => item.subType == 7 || item.subType == 8
          )
      : [];
    const tradePrice = detail.get('tradePrice').toJS() as {
      special: boolean; //是否特价
      originPrice: number; //原始总额
      couponPrice: number; // 优惠券
      pointsPrice: number;
      deliveryPrice: number; //配送费用
      goodsPrice: number; //商品总金额
      totalPrice: number; //订单应付金额（不含手续费）
      totalPayCash: number; //订单实际支付金额
      privilegePrice: number; //特价金额
      deliveryCouponPrice: number; //运费优惠金额
      discountsPriceDetails: List<any>; //订单优惠金额明细
      balancePrice: number; //鲸币抵扣
    };

    //收货人信息
    // const consignee = detail.get('consignee').toJS() as {
    //   detailAddress: string;
    //   name: string;
    //   phone: string;
    // };

    //发票信息
    const invoice = detail.get('invoice')
      ? (detail.get('invoice').toJS() as {
          open: boolean; //是否需要开发票
          type: number; //发票类型
          title: string; //发票抬头
          projectName: string; //开票项目名称
          generalInvoice: IMap; //普通发票
          specialInvoice: IMap; //增值税发票
          address: string;
          contacts: string; //联系人
          phone: string; //联系方式
          provinceId: number;
          cityId: number;
          areaId: number;
        })
      : null;

    //附件信息
    const encloses = detail.get('encloses')
      ? detail.get('encloses').split(',')
      : [];
    const enclo = fromJS(
      encloses.map((url, index) =>
        Map({ uid: index, name: index, size: 1, status: 'done', url: url })
      )
    );

    //满减、满折金额
    tradePrice.discountsPriceDetails =
      tradePrice.discountsPriceDetails || fromJS([]);
    const reduction = tradePrice.discountsPriceDetails.find(
      (item) => item.marketingType == 0
    );
    const discount = tradePrice.discountsPriceDetails.find(
      (item) => item.marketingType == 1
    );

    const isSelf = detail.getIn(['supplier', 'isSelf']);
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
    });
    let deliver;
    if (detail.get('deliverWay')) {
      if (detail.get('deliverWay') == 0) {
        deliver = '其他';
      } else if (detail.get('deliverWay') == 1) {
        deliver = '第三方物流';
      } else if (detail.get('deliverWay') == 2) {
        deliver = '快递到家(收费)';
      } else if (detail.get('deliverWay') == 3) {
        deliver = '自提';
      } else if (detail.get('deliverWay') == 4) {
        deliver = '免费店配(五件起)';
      } else {
        deliver = '-';
      }
    } else {
      deliver = '-';
    }
    return (
      <div>
        <div style={styles.headBox as any}>
          <h4 style={styles.greenText}>
            {flowState(detail.getIn(['tradeState', 'flowState']))}
          </h4>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>
                订单号：{detail.get('id')}{' '}
                {/* {detail.get('platform') != 'CUSTOMER' && ( */}
                <span style={styles.platform}>{orderType}</span>
                {detail.get('grouponFlag') && (
                  <span style={styles.platform}>拼团</span>
                )}
                {/* )} */}
              </p>
              <p style={styles.darkText}>
                下单时间：
                {moment(detail.getIn(['tradeState', 'createTime'])).format(
                  Const.TIME_FORMAT
                )}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                商家：{detail.getIn(['supplier', 'supplierName'])}
              </p>
              <p style={styles.darkText}>
                商家编号：{detail.getIn(['supplier', 'supplierCode'])}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                客户：{detail.getIn(['buyer', 'name']) + '  '}
              </p>
              <p style={styles.darkText}>
                客户账号：{detail.getIn(['buyer', 'account'])}
              </p>
              {/*{detail.getIn(['buyer', 'customerFlag']) && (*/}
              {/*<p style={styles.darkText}>*/}
              {/*{(isSelf ? '平台等级：  ' : '客户等级：  ') +*/}
              {/*detail.getIn(['buyer', 'levelName'])}*/}
              {/*</p>*/}
              {/*)}*/}
            </Col>
          </Row>

          {/* {this._renderBtnAction(tid)} */}
        </div>

        <div
          style={{ display: 'flex', marginTop: 10, flexDirection: 'column' }}
        >
          {this._renderList(fromJS(payRecord), detail)}

          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />

            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>商品金额:</span>
                <strong>￥{(tradePrice.goodsPrice || 0).toFixed(2)}</strong>
              </label>

              {reduction && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>满减优惠:</span>
                  <strong>-￥{reduction.discounts.toFixed(2)}</strong>
                </label>
              )}

              {discount && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>满折优惠:</span>
                  <strong>-￥{discount.discounts.toFixed(2)}</strong>
                </label>
              )}

              {tradePrice.pointsPrice ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>积分抵扣: </span>
                    <strong>
                      -￥{(tradePrice.pointsPrice || 0).toFixed(2)}
                    </strong>
                  </label>
                </div>
              ) : null}

              {tradePrice.couponPrice ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>优惠券: </span>
                    <strong>
                      -￥
                      {(
                        tradePrice.couponPrice -
                          tradePrice.deliveryCouponPrice || 0
                      ).toFixed(2)}
                      {/* -￥{(tradePrice.couponPrice || 0).toFixed(2)} */}
                    </strong>
                  </label>
                </div>
              ) : null}

              {tradePrice.special ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>订单改价: </span>
                    <strong>
                      ￥{(tradePrice.privilegePrice || 0).toFixed(2)}
                    </strong>
                  </label>
                </div>
              ) : null}

              {/* <label style={styles.priceItem as any}>
                <span style={styles.name}>配送费用: </span>
                <strong>￥{(tradePrice.deliveryPrice || 0).toFixed(2)}</strong>
              </label> */}
              {/* <label style={styles.priceItem as any}>
                <span style={styles.name}>运费优惠金额: </span>
                <strong>
                  ￥{(tradePrice.deliveryCouponPrice || 0).toFixed(2)}
                </strong>
              </label> */}
              {tradeMarketings.length > 0 && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    {`订单满${
                      tradeMarketings[0].subType == 7 ? '减' : '折'
                    }优惠金额`}
                    :{' '}
                  </span>
                  <strong>
                    -￥{tradeMarketings[0].discountsAmount.toFixed(2)}
                  </strong>
                </label>
              )}
              <label style={styles.priceItem as any}>
                <span style={styles.name}>鲸币抵扣: </span>
                <strong>￥{(tradePrice?.balancePrice || 0).toFixed(2)}</strong>
              </label>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>实付金额: </span>
                <strong>
                  ￥
                  {(
                    Number((tradePrice.totalPrice || 0).toFixed(2)) -
                    Number((tradePrice.balancePrice || 0).toFixed(2))
                  ).toFixed(2)}
                </strong>
              </label>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>实付总额: </span>
                <strong>￥{(tradePrice?.totalPrice || 0).toFixed(2)}</strong>
              </label>
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}
        >
          <label style={styles.inforItem}>
            卖家备注: {detail.get('sellerRemark') || '无'}
          </label>
          <label style={styles.inforItem}>
            买家备注: {detail.get('buyerRemark') || '无'}
          </label>
          <label style={styles.inforItem}>
            订单附件: {this._renderEncloses(enclo)}
          </label>

          <label style={styles.inforItem}>
            支付方式: {detail.getIn(['payInfo', 'desc']) || '暂无信息'}
          </label>
          {
            <label style={styles.inforItem}>
              发票信息: {invoice ? invoiceContent(invoice) || '' : '无'}
            </label>
          }
          {/* {invoice.address && (
            <label style={styles.inforItem}>
              发票收货地址:{' '}
              {invoice && invoice.type == -1
                ? '无'
                : `${invoice.contacts} ${invoice.phone}  ${
                    invoice.address || '无'
                  }`}
            </label>
          )} */}
          <label style={styles.inforItem}>配送方式: {deliver}</label>
          {/* <label style={styles.inforItem}>
            收货信息：{consignee.name} {consignee.phone}{' '}
            {consignee.detailAddress}
          </label> */}
        </div>
      </div>
    );
  }

  _renderList(payRecord, detail) {
    console.log(detail.get('tradeItems').toJS(), '---------');
    return (
      payRecord &&
      payRecord.map((v, index) => {
        if ((v.tradeVOList && v.tradeVOList.length == 0) || !v.tradeVOLis) {
          //当前的订单号
          const { tradeItems } = detail.get('tradeVOList')?.toJS()[0] || [];
          //赠品信息
          let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
          gifts = gifts
            .map((gift) =>
              gift
                .set('skuName', '【赠品】' + gift.get('skuName'))
                .set('levelPrice', 0)
            )
            .toJS();
          tradeItems.forEach((tradeItems) => {
            if (tradeItems.isFlashSaleGoods) {
              tradeItems.levelPrice = tradeItems.price;
            }
          });
          return (
            <Table
              columns={columns}
              dataSource={tradeItems.concat(gifts)}
              pagination={false}
              bordered
            />
          );
        }
        return <div key={index}>{this._renderSonOrderSku(v.tradeVOList)}</div>;
      })
    );
  }

  //子订单商品
  _renderSonOrderSku(list) {
    return (
      list &&
      list.map((v, index) => {
        //当前的订单号
        const tradeItems = v.tradeItems;
        //赠品信息
        let gifts = Array.from(v.gifts ? v.gifts : fromJS([]));
        console.log(typeof gifts);
        gifts = gifts.map((gift) => {
          console.log('====================================');
          console.log(gift, 'giftgiftgift');
          console.log('====================================');
          gift.set('skuName', '【赠品】' + gift.skuName).set('levelPrice', 0);
        });
        tradeItems.forEach((tradeItems) => {
          if (tradeItems.isFlashSaleGoods) {
            tradeItems.levelPrice = tradeItems.price;
          }
        });
        return (
          <div key={index}>
            <div style={{ height: '50px' }}>
              <span>
                子单:{v.id}&nbsp;&nbsp;商家：{v.supplier.supplierName || '-'}
                <br />
                备注：{v.buyerRemark || '无'}
              </span>
            </div>
            <Table
              columns={columns}
              dataSource={tradeItems.concat(gifts)}
              pagination={false}
              bordered
            />
          </div>
        );
      })
    );
  }

  //附件
  _renderEncloses(encloses) {
    if (encloses.size == 0 || encloses[0] === '') {
      return <span>无</span>;
    }
    return (
      <ImageModal
        imgList={encloses.map((v) => v.get('url')).toJS()}
        imgStyle={styles.attachment}
      />
    );
  }

  // _renderBtnAction(tid: string) {
  //   const { detail, onAudit, verify, onDelivery } = this.props.relaxProps;
  //   const flowState = detail.getIn(['tradeState', 'flowState']);
  //   const payState = detail.getIn(['tradeState', 'payState']);

  //   //创建订单状态
  //   if (flowState === 'INIT') {
  //     return (
  //       <div>
  //         {payState === 'PAID' ? null : (
  //           <a
  //             style={styles.pr20}
  //             onClick={() => {
  //               verify(tid);
  //             }}
  //           >
  //             修改
  //           </a>
  //         )}

  //         {payState === 'PAID' ? null : (
  //           <a
  //             onClick={() => this._showRejectedConfirm(tid)}
  //             href="javascript:void(0)"
  //             style={styles.pr20}
  //           >
  //             驳回
  //           </a>
  //         )}

  //         <Button
  //           onClick={() => {
  //             onAudit(tid, 'CHECKED');
  //           }}
  //           style={{ fontSize: 14 }}
  //         >
  //           审核
  //         </Button>
  //       </div>
  //     );
  //   } else if (flowState === 'AUDIT') {
  //     return (
  //       <div>
  //         {payState === 'PAID' || payState === 'UNCONFIRMED' ? null : (
  //           <a
  //             onClick={() => {
  //               this._showRetrialConfirm(tid);
  //             }}
  //             href="javascript:void(0)"
  //             style={styles.pr20}
  //           >
  //             回审
  //           </a>
  //         )}
  //         <a
  //           href="javascript:void(0);"
  //           style={styles.pr20}
  //           onClick={() => {
  //             onDelivery();
  //           }}
  //         >
  //           发货
  //         </a>
  //       </div>
  //     );
  //   } else if (flowState === 'DELIVERED_PART') {
  //     return (
  //       <div>
  //         <a
  //           href="javascript:void(0);"
  //           style={styles.pr20}
  //           onClick={() => {
  //             onDelivery();
  //           }}
  //         >
  //           发货
  //         </a>
  //       </div>
  //     );
  //   } else if (flowState === 'DELIVERED') {
  //     return (
  //       <div>
  //         <a
  //           onClick={() => {
  //             this._showConfirm(tid);
  //           }}
  //           href="javascript:void(0)"
  //           style={styles.pr20}
  //         >
  //           确认收货
  //         </a>
  //       </div>
  //     );
  //   }

  //   return null;
  // }

  // /**
  //  * 驳回订单确认提示
  //  * @private
  //  */
  // _showRejectedConfirm = (tdId: string) => {
  //   const { onAudit } = this.props.relaxProps;

  //   const confirm = Modal.confirm;
  //   confirm({
  //     title: '驳回',
  //     content: '确认驳回这条订单?',
  //     onOk() {
  //       onAudit(tdId, 'REJECTED');
  //     },
  //     onCancel() { }
  //   });
  // };

  // /**
  //  * 回审订单确认提示
  //  * @param tdId
  //  * @private
  //  */
  // _showRetrialConfirm = (tdId: string) => {
  //   const { retrial } = this.props.relaxProps;

  //   const confirm = Modal.confirm;
  //   confirm({
  //     title: '回审',
  //     content: '确认将选中的订单退回重新审核?',
  //     onOk() {
  //       retrial(tdId);
  //     },
  //     onCancel() { }
  //   });
  // };

  //   /**
  //    * 确认收货确认提示
  //    * @param tdId
  //    * @private
  //    */
  //   _showConfirm = (tdId: string) => {
  //     const { confirm } = this.props.relaxProps;

  //     const confirmModal = Modal.confirm;
  //     confirmModal({
  //       title: '确认收货',
  //       content: '确认已收到全部货品?',
  //       onOk() {
  //         confirm(tdId);
  //       },
  //       onCancel() { }
  //     });
  //   };
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  greenText: {
    color: '#339966',
    display: 'block',
    marginBottom: 5
  },
  greyText: {
    marginLeft: 20
  },
  pr20: {
    paddingRight: 20
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 120,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-between'
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20
  } as any,

  imgItem: {
    width: 40,
    height: 40,
    border: '1px solid #ddd',
    display: 'inline-block',
    marginRight: 10,
    background: '#fff'
  },
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 400,
    maxHeight: 400
  },
  darkText: {
    color: '#333333',
    lineHeight: '24px'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
} as any;
