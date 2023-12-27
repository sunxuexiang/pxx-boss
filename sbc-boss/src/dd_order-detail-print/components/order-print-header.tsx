import React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List, Map } from 'immutable';
import { Const, cache } from 'qmkit';
import Moment from 'moment';

/**
 * 订单打印头部
 */
@Relax
export default class OrderPrintHeader extends React.Component<any, any> {
  onAudit: any;

  props: {
    relaxProps?: {
      detail: IMap;
      printSetting: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail',
    printSetting: 'printSetting'
  };

  render() {
    const { detail, printSetting } = this.props.relaxProps;
    const createTime = detail.get('createTime');
    const createTimeStr = Moment(createTime)
      .format(Const.DAY_FORMAT)
      .toString();
    const printTime = Moment(Date.now()).format(Const.DATE_FORMAT).toString();
    const orderId = detail.get('id');
    // const customerName =
    //   detail.get('consignee').get('address') + detail.get('buyer').get('name');
    const customerName = detail.get('buyer').get('name');
    const deliverWay = detail.get('deliverWay');
    let addressDetail;
    let pointDetail = detail.get('logisticsCompanyInfo')
      ? detail.get('logisticsCompanyInfo').get('receivingPoint')
      : '';
    if (deliverWay == 1 || deliverWay == 8) {
      // 托运部或指定物流
      addressDetail = detail.get('logisticsCompanyInfo')
        ? `${detail.get('logisticsCompanyInfo').get('logisticsCompanyName')} 
        ${detail.get('logisticsCompanyInfo').get('logisticsCompanyPhone')} 
        ${detail.get('logisticsCompanyInfo').get('logisticsAddress')}`
        : '';
    } else {
      addressDetail = detail.get('logisticsCompanyInfo')
        ? `${detail.get('logisticsCompanyInfo').get('logisticsAddress')}`
        : '';
    }
    const buyerRemark = detail.get('buyerRemark');
    return (
      <div style={{ marginLeft: 5 }}>
        <div
          dangerouslySetInnerHTML={{ __html: printSetting.get('printHead') }}
        ></div>
        <div style={{ fontSize: 14 }}>
          <div>
            <img
              style={{ width: '190px' }}
              src={sessionStorage.getItem(cache.SITE_LOGO)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              fontSize: '36px',
              fontWeight: 'bold'
            }}
          >
            {detail.get('supplier').get('storeName')}
          </div>
          <div>
            <text>日&emsp;&emsp;期：{createTimeStr}</text>
            <text style={{ marginLeft: 40 }}>打印时间：{printTime}</text>
            <text style={{ marginLeft: 40 }}>单据编号：{orderId}</text>
          </div>
          <div>
            <text>店铺名称：{detail.get('supplier').get('storeName')}</text>
          </div>
          <div>
            <text>客户名称：{customerName}</text>
          </div>
          <div>配送方式：{this.showDeliverWayName(deliverWay)}</div>
          <div>
            收货地址：{detail.get('consignee').get('name')}{' '}
            {detail.get('consignee').get('phone')}{' '}
            {detail.get('consignee').get('detailAddress')}
          </div>
          <div>收货站点：{pointDetail || '-'}</div>
          <div>物流地址：{addressDetail ? addressDetail : '-'}</div>
          <div>备&emsp;&emsp;注：{buyerRemark ? buyerRemark : '-'}</div>
        </div>
      </div>
    );
  }

  showDeliverWayName = (deliverWay) => {
    let result = '';
    switch (deliverWay) {
      case 0:
        result = '其他';
        break;
      case 1:
        result = '托运部';
        break;
      case 2:
        result = '快递到家(收费)';
        break;
      case 3:
        result = '自提';
        break;
      case 4:
        result = '免费店配(五件起)';
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
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  }
} as any;
