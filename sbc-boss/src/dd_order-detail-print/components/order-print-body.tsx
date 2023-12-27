import React from 'react';
import { IMap, Relax } from 'plume2';
import { Table } from 'antd';
import { fromJS, List, Map } from 'immutable';
import NP from 'number-precision';

const columns = [
  {
    title: '序号',
    width: 30,
    render: (_text, _row, index) => index + 1
  },
  // {
  //   title: 'ERP编码',
  //   dataIndex: 'erpSkuNo',
  //   key: 'erpSkuNo'
  // },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    key: 'skuName',
    render: (text) => {
      return <span style={{ fontWeight: 'bold' }}>{text}</span>;
    }
  },
  // {
  //   title: '仓库',
  //   dataIndex: 'wareName',
  //   key: 'wareName',
  //   render: (text) => (text ? text : '-')
  // },
  {
    title: '规格',
    width: 160,
    dataIndex: 'goodsSubtitle',
    key: 'goodsSubtitle',
    render: (text) => (text ? text : '-')
  },
  // {
  //   title: '规格型号',
  //   dataIndex: 'subTitle',
  //   key: 'subTitle',
  //   render: (text) => (text ? text : '-')
  // },
  // {
  //   title: '库位',
  //   dataIndex: 'stockName',
  //   key: 'stockName',
  //   render: (text) => {
  //     return <span style={{ fontWeight: 'bold' }}>{text}</span>;
  //   }
  // },
  {
    title: <div style={{ fontSize: '18px' }}>数量</div>,
    width: 60,
    dataIndex: 'num',
    key: 'num',
    render: (text) => {
      return <span style={{ fontWeight: 'bold' }}>{text}</span>;
    }
  },
  {
    title: <div style={{ fontSize: '18px' }}>单位</div>,
    width: 60,
    dataIndex: 'unit',
    key: 'unit',
    render: (text) => (text ? text : '-')
  },
  // {
  //   title: '单价',
  //   width: 70,
  //   dataIndex: 'price',
  //   key: 'price',
  //   render: (price) => <span>￥{price.toFixed(2)}</span>
  // },
  // {
  //   title: '折扣金额',
  //   render: (row) => (
  //     <span>￥{(row.num * row.price - row.splitPrice).toFixed(2)}</span>
  //   )
  // },
  {
    title: <div style={{ fontSize: '18px' }}>金额</div>,
    width: 78,
    render: (row) => {
      if (row.isGift) {
        return <span>￥0.00</span>;
      }
      if (row.priceChanged === 1) {
        return (
          <span>
            ￥{(row.num * row.changedPrice - (row.zkPrice || 0)).toFixed(2)}
          </span>
        );
      } else {
        return (
          <span>
            ￥{(row.num * row.levelPrice - (row.zkPrice || 0)).toFixed(2)}
          </span>
        );
      }
    }
  }
  // {
  //   title: '已退数量',
  //   dataIndex: 'returnedQuantity',
  //   key: 'returnedQuantity'
  // }
];

/**
 * 订单打印头部
 */
@Relax
export default class OrderPrintBody extends React.Component<any, any> {
  onAudit: any;

  props: {
    relaxProps?: {
      detail: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail'
  };

  render() {
    const { detail } = this.props.relaxProps;
    return (
      <div style={{ display: 'flex', marginTop: 20, flexDirection: 'column' }}>
        {this._renderList(detail)}
      </div>
    );
  }

  _renderList(detail) {
    const totalPrice = detail.get('tradePrice').get('totalPrice');
    let totalNum = 0;
    let wareCode = detail.get('wareHouseCode');
    //当前的订单号
    let tradeItems = detail.get('tradeItems').toJS();
    tradeItems.map((t) => (t.wareName = wareCode));
    //赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
    gifts = gifts
      .map((gift) =>
        gift
          .set('skuName', '【赠品】' + gift.get('skuName'))
          .set('levelPrice', 0)
          .set('price', 0)
          .set('splitPrice', 0)
          .set('isGift', true)
      )
      .toJS();
    //计算总是
    gifts.map((t) => (totalNum = totalNum + t.num));
    tradeItems.forEach((item) => {
      if (item.isFlashSaleGoods) {
        item.levelPrice = item.price;
      }
      let zkPrice = NP.minus(NP.times(item.num, item.price), item.splitPrice);
      item.zkPrice = item.walletSettlements.length
        ? NP.minus(zkPrice, item.walletSettlements[0].reduceWalletPrice)
        : zkPrice;
      totalNum = totalNum + item.num;
    });
    return (
      <Table
        columns={columns}
        dataSource={tradeItems.concat(gifts)}
        pagination={false}
        size="small"
        bordered
        footer={() => {
          return (
            <div style={{ width: '100%' }}>
              {/* <span style={{ width: '25%' }}>
                付款方式：{detail.getIn(['payInfo', 'desc']) || '暂无信息'}
              </span> */}
              <span style={{ width: '25%' }}>总数：{totalNum}</span>
              <span style={{ width: '25%', marginLeft: 100 }}>
                实付金额：{totalPrice}
              </span>
            </div>
          );
        }}
      />
    );
  }
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  }
} as any;
