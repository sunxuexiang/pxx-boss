import React from 'react';
import { Relax } from 'plume2';
import { Checkbox, Spin, Pagination, Tooltip } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper, history } from 'qmkit';
import Moment from 'moment';
import { allCheckedQL } from '../ql';
import { IMap } from 'plume2/es5/typings';
const defaultImg = require('../../goods-list/img/none.png');

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return '未发货';
  } else if (status == 'SHIPPED') {
    return '全部发货';
  } else if (status == 'PART_SHIPPED') {
    return '部分发货';
  } else if (status == 'VOID') {
    return '作废';
  } else {
    return '未知';
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return '未付款';
  } else if (status == 'UNCONFIRMED') {
    return '待确认';
  } else if (status == 'PAID') {
    return '已付款';
  } else {
    return '未知';
  }
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

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;

      onChecked: Function;
      onCheckedAll: Function;
      allChecked: boolean;
      onAudit: Function;
      init: Function;
      onRetrial: Function;
      onConfirm: Function;
      onCheckReturn: Function;
      verify: Function;
      type: string;
      form: IMap;
      addonBeforeForm: IMap;
      tab: IMap;
    };
  };

  static relaxProps = {
    type: 'type',
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',

    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',
    tab: 'tab',

    onChecked: noop,
    onCheckedAll: noop,
    allChecked: allCheckedQL,
    onAudit: noop,
    init: noop,
    onRetrial: noop,
    onConfirm: noop,
    onCheckReturn: noop,
    verify: noop,
    addonBeforeForm: 'addonBeforeForm',
    form: 'form'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      onCheckedAll,
      allChecked,
      init,
      currentPage
    } = this.props.relaxProps;
    console.log('====================================');
    console.log(dataList.toJS(), 'dataListdataListdataListdataList');
    console.log('====================================');

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table
                  style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}
                >
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '4%', paddingLeft: '16px' }}>
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th style={{ width: '16%' }}>商品</th>
                      <th style={{ width: '12%' }}>客户名称</th>
                      <th style={{ width: '17%' }}>店铺名称</th>
                      <th style={{ width: '13%' }}>收件人</th>
                      <th style={{ width: '6%' }}>金额/数量</th>
                      {/* <th style={{ width: '5%' }}>发货仓</th> */}
                      <th style={{ width: '6%' }}>拣货状态</th>
                      <th style={{ width: '6%' }}>发货状态</th>
                      {/* <th style={{ width: '7%' }}>业务代表</th> */}
                      {/* <th style={{ width: '7%' }}>白鲸管家</th> */}
                      <th style={{ width: '6%' }}>订单状态</th>
                      {/* <th style={{ width: '7%' }}>订单类型</th> */}
                      <th style={{ width: '8%' }}>配送方式</th>
                      <th style={{ width: '6%' }}>付款状态</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(dataList)}
                  </tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    暂无数据
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger={true}
              showQuickJumper={true}
              pageSizeOptions={['10', '40', '60', '80', '100']}
              onChange={(pageNum, pageSize) => {
                init({ pageNum: pageNum - 1, pageSize });
              }}
              onShowSizeChange={(current, pageSize) => {
                init({ pageNum: 0, pageSize });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={11}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const { onChecked, form, addonBeforeForm, currentPage, pageSize, tab } =
      this.props.relaxProps;
    const key = tab.get('key');
    return (
      dataList &&
      dataList.map((v, index) => {
        const id = v.get('id');
        const tradePrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const totalPrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const orderSource = v.get('orderSource');
        let orderType = '';
        if (orderSource == 'SUPPLIER') {
          orderType = '代客下单';
        } else if (orderSource == 'WECHAT') {
          orderType = 'H5订单';
        } else if (orderSource == 'APP') {
          orderType = 'APP订单';
        } else if (orderSource == 'PC') {
          orderType = 'PC订单';
        } else if (orderSource == 'LITTLEPROGRAM') {
          orderType = '小程序订单';
        }

        //商品+赠品
        const tradeItems = v.get('tradeItems');
        const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
        const items = tradeItems.concat(gifts);
        // const items = v.get('iDs')||[];
        const num =
          items
            .map((v) => v.get('num'))
            .reduce((a, b) => {
              a = a + b;
              return a;
            }, 0) || 0;

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={15} style={{ padding: 0 }}>
              <table
                className="ant-table-self"
                style={{ border: '1px solid #ddd' }}
              >
                <thead>
                  <tr>
                    <td colSpan={14} style={{ padding: 0, color: '#999' }}>
                      <div
                        style={{
                          alignItems: 'center',
                          borderBottom: '1px solid #F5F5F5',
                          height: 36,
                          lineHeight: '36px'
                        }}
                      >
                        <span style={{ marginLeft: '1%' }}>
                          <Checkbox
                            checked={v.get('checked')}
                            onChange={(e) => {
                              const checked = (e.target as any).checked;
                              onChecked(index, checked);
                            }}
                          />
                        </span>

                        <div style={{ width: 310, display: 'inline-block' }}>
                          <span style={{ marginLeft: 20, color: '#000' }}>
                            {id}
                          </span>
                          {v.get('platform') != 'CUSTOMER' && (
                            <span style={styles.platform}>代下单</span>
                          )}
                          {orderType != '' && (
                            <span style={styles.platform}>{orderType}</span>
                          )}
                          {v.get('grouponFlag') && (
                            <span style={styles.platform}>拼团</span>
                          )}
                          {flowState(v.getIn(['tradeState', 'flowState'])) ===
                            '待发货' &&
                            v.get('presellFlag') && (
                              <span style={styles.platform}>预售订单</span>
                            )}
                        </div>

                        <span
                          style={{ marginLeft: 20, color: 'rbga(0,0,0,.4)' }}
                        >
                          PID：
                          {v.toJS().parentId ? v.toJS().parentId : ''}
                        </span>

                        <span
                          style={{ marginLeft: 20, color: 'rbga(0,0,0,.4)' }}
                        >
                          支付单号：
                          {v.toJS().payOrderNo ? v.toJS().payOrderNo : ''}
                        </span>

                        <span
                          style={{ marginLeft: 40, color: 'rbga(0,0,0,.4)' }}
                        >
                          下单时间：
                          {v.getIn(['tradeState', 'createTime'])
                            ? Moment(v.getIn(['tradeState', 'createTime']))
                                .format(Const.TIME_FORMAT)
                                .toString()
                            : ''}
                        </span>

                        <Tooltip
                          placement="top"
                          title={this._renderTitle(
                            v.toJS().stockOrder ? v.toJS().stockOrder : []
                          )}
                        >
                          <span
                            style={{ marginLeft: 20, color: 'rbga(0,0,0,.4)' }}
                          >
                            囤货订单ID：
                            {v.toJS().stockOrder
                              ? v.toJS().stockOrder.length > 1
                                ? v.toJS().stockOrder[0] + '...'
                                : v.toJS().stockOrder
                              : '无'}
                          </span>
                        </Tooltip>
                        <span style={{ marginRight: 20, float: 'right' }}>
                          {v.getIn(['tradeState', 'payState']) === 'PAID' && (
                            <a
                              onClick={() => {
                                let searchCacheForm =
                                  JSON.parse(
                                    sessionStorage.getItem('searchCacheForm')
                                  ) || {};
                                sessionStorage.setItem(
                                  'searchCacheForm',
                                  JSON.stringify({
                                    ...searchCacheForm,
                                    orderForm:
                                      {
                                        ...form.toJS(),
                                        currentPage: currentPage - 1,
                                        pageSize: pageSize
                                      } || {},
                                    tabKey: key,
                                    orderAddonBeforeForm:
                                      addonBeforeForm.toJS() || {}
                                  })
                                );
                                this._printOrder(id);
                              }}
                              href=""
                              style={{ marginLeft: 20 }}
                            >
                              订单打印
                            </a>
                          )}
                        </span>
                        <AuthWrapper functionName={'fOrderDetail001'}>
                          <span style={{ marginRight: 0, float: 'right' }}>
                            <a
                              onClick={() => {
                                let searchCacheForm =
                                  JSON.parse(
                                    sessionStorage.getItem('searchCacheForm')
                                  ) || {};
                                sessionStorage.setItem(
                                  'searchCacheForm',
                                  JSON.stringify({
                                    ...searchCacheForm,
                                    orderForm:
                                      {
                                        ...form.toJS(),
                                        currentPage: currentPage - 1,
                                        pageSize: pageSize
                                      } || {},
                                    tabKey: key,
                                    orderAddonBeforeForm:
                                      addonBeforeForm.toJS() || {}
                                  })
                                );
                                history.push({
                                  pathname: `/order-detail/${id}`
                                });
                              }}
                              target={
                                this.props.relaxProps.type === 'modal'
                                  ? '_blank'
                                  : '_top'
                              }
                              style={{ marginLeft: 20, marginRight: 20 }}
                            >
                              查看详情
                            </a>
                          </span>
                        </AuthWrapper>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: 'left',
                        alignItems: 'flex-end',
                        width: '20%'
                      }}
                    >
                      {/*商品图片*/}
                      {items.map((v, k) => {
                        return k < 2 ? (
                          <img
                            src={v.get('pic') ? v.get('pic') : defaultImg}
                            style={styles.imgItem}
                            key={k}
                          />
                        ) : null;
                      })}

                      {
                        /*第3张特殊处理*/
                        //@ts-ignore
                        items.size > 2 ? (
                          <div style={styles.imgBg}>
                            <img
                              src={items.get(2).get('pic')}
                              style={styles.imgFourth}
                            />
                            <div style={styles.imgNum}>
                              共{v.get('specNumber')}种
                            </div>
                          </div>
                        ) : null
                      }
                    </td>
                    <td style={{ width: '12%' }}>
                      {/*客户名称*/}
                      {v.getIn(['buyer', 'name'])}
                    </td>
                    <td style={{ width: '17%' }}>
                      {/*商家*/}
                      {v.getIn(['supplier', 'storeName'])}
                      {v.get('selfManage') === 1 && (
                        <span style={styles.platform}>自营</span>
                      )}
                      <br />
                      {v.getIn(['supplier', 'supplierCode'])}
                    </td>
                    <td style={{ width: '13%' }}>
                      {/*收件人姓名*/}
                      收件人：{v.getIn(['consignee', 'name'])}
                      <br />
                      {/*收件人手机号码*/}
                      {v.getIn(['consignee', 'phone'])}
                    </td>
                    <td style={{ width: '6%' }}>
                      {/* ￥{tradePrice.toFixed(2)} */}￥{totalPrice.toFixed(2)}
                      <br />（{num}件）
                    </td>
                    {/* 发货仓 */}
                    {/* <td style={{ width: '5%' }}>
                      {v.get('wareName') ||
                        v.get('wareHouseNmae') ||
                        v.get('wareHouseCode')}
                    </td> */}
                    {/*发货状态*/}
                    <td style={{ width: '6%' }}>
                      {v.get('pickingStatus') ? '已拣货' : '未拣货'}
                    </td>
                    <td style={{ width: '6%' }}>
                      {deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}
                    </td>
                    {/*业务代表*/}
                    {/* <td style={{ width: '7%' }}>{v.get('employeeName')}</td> */}
                    {/*白鲸管家*/}
                    {/* <td style={{ width: '7%' }}>
                      {v.get('managerName') || 'system'}
                    </td> */}
                    {/*订单状态*/}
                    <td style={{ width: '6%' }}>
                      {flowState(v.getIn(['tradeState', 'flowState']))}
                    </td>
                    {/*订单类型*/}
                    {/* <td style={{ width: '7%' }}>
                      {v.get('activityType') == 4
                        ? '囤货订单'
                        : `提货订单(${
                            v.get('saleType') == 0
                              ? '批发'
                              : v.get('saleType') == 1
                              ? '零售'
                              : '散批'
                          })`}
                    </td> */}
                    {/*配送方式*/}
                    <td style={{ width: '8%' }}>
                      {this._getDeliverWayDesc(v.get('deliverWay'))}
                    </td>
                    {/*支付状态*/}
                    <td style={{ width: '6%' }}>
                      {payStatus(v.getIn(['tradeState', 'payState']))}
                      &nbsp;&nbsp;&nbsp;
                    </td>
                  </tr>
                  {this._renderSonTrade(v.get('tradeVOList'))}
                </tbody>
              </table>
            </td>
          </tr>
        );
      })
    );
  }

  _getDeliverWayDesc = (deliverWay) => {
    let result = '--';
    switch (deliverWay) {
      case 0:
        result = '其他';
        break;
      case 1:
        result = '托运部';
        break;
      case 2:
        result = '快递到家';
        break;
      case 3:
        result = '自提';
        break;
      case 4:
        result = '免费店配';
        break;
      case 5:
        result = '站点自提';
        break;
      case 6:
        result = '自提';
        break;
      case 7:
        result = '配送到店(自费)';
        break;
      case 8:
        result = '指定专线';
        break;
      case 9:
        result = '同城配送(自费)';
        break;
      default:
        break;
    }
    return result;
  };

  _renderTitle = (stockOrder) => {
    return stockOrder.map((i) => {
      return (
        <p>
          <span>{i}</span>
        </p>
      );
    });
  };

  _printOrder = (tid: string) => {
    history.push(`/dd_order-detail-print/${tid}`);
  };

  _renderSonTrade(sonList) {
    return (
      sonList &&
      sonList.map((v) => {
        const id = v.get('id');
        let providerName = v.getIn(['supplier', 'storeName']);
        const providerCode = v.getIn(['supplier', 'supplierCode']);
        if (providerName == null && providerCode == null) {
          providerName = '-';
        }
        const tradePrice = v.getIn(['tradePrice', 'goodsPrice']) || 0;
        const totalPrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const tradeItems = v.get('tradeItems');
        const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
        // const items = tradeItems.concat(gifts);
        const items = v.get('iDs');
        const num =
          items
            .map((v) => v.get('num'))
            .reduce((a, b) => {
              a = a + b;
              return a;
            }, 0) || 0;
        return (
          <>
            <tr>
              <td style={{ width: '3%' }} />
              <td style={{ width: '20%' }}>
                <div style={{ display: 'inline-block', color: '#000' }}>
                  <span>子单:{id}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '16px 22px',
                  width: '22%'
                }}
              >
                {/*商品图片*/}
                {items.map((v, k) => {
                  return k < 2 ? (
                    <img
                      src={v.get('pic') ? v.get('pic') : defaultImg}
                      style={styles.imgItem}
                      key={k}
                    />
                  ) : null;
                })}

                {
                  /*第3张特殊处理*/
                  //@ts-ignore
                  items.size > 2 ? (
                    //@ts-ignore
                    <div style={styles.imgBg}>
                      <img
                        //@ts-ignore
                        src={items.get(2).get('pic')}
                        //@ts-ignore
                        style={styles.imgFourth}
                      />
                      //@ts-ignore
                      <div style={styles.imgNum}>共{items.size}种</div>
                      {/* <div style={styles.imgNum}>共{v.get('specNumber')}种</div> */}
                      {/* 共{v.get('tradeItems').concat(gifts).size}种 */}
                      {/* 共{v.get('specNumber')}种 */}
                    </div>
                  ) : null
                }
              </td>
              <td style={{ width: '12%' }}>-</td>
              <td style={{ width: '16%' }}>
                {providerName}
                <br />
                {providerCode}
              </td>
              <td style={{ width: '13%' }}>-</td>
              <td style={{ width: '6%' }}>
                {/* ￥{totalPrice.toFixed(2)} */}￥
                {(
                  tradePrice + (v.get('tradePrice')?.get('balancePrice') || 0)
                ).toFixed(2)}
                <br />（{num}件)
              </td>
              {/* 发货仓 */}
              {/* <td style={{ width: '5%' }}>
                {v.get('wareName') ||
                  v.get('wareHouseNmae') ||
                  v.get('wareHouseCode')}
              </td> */}
              <td style={{ width: '6%' }}>-</td>
              {/*发货状态*/}
              <td style={{ width: '6%' }}>
                {deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}
              </td>
              <td style={{ width: '7%' }}>-</td>
              {/* <td style={{ width: '7%' }}>-</td> */}
              {/*订单状态*/}
              <td style={{ width: '7%' }}>-</td>
              {/* <td style={{ width: '7%' }}>-</td> */}
              {/* <td style={{ width: '7%' }}>-</td> */}
              {/*支付状态*/}
              <td style={{ width: '6%' }}>- &nbsp;&nbsp;&nbsp;</td>
            </tr>
          </>
        );
      })
    );
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5,
    lineHeight: '16px'
  }
} as any;
