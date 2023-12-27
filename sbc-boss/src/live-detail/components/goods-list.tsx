import React from 'react';
import { Relax } from 'plume2';
import { Table, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IList } from 'typings/globalType';
const defaultImg = require('../../images/none.png');

const styles = {
  edit: {
    paddingRight: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgItem: {
    width: 40,
    height: 40,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  goodsInfoRight: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  }
} as any;

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      liveGoodsList: [];
      goodsInfoList: IList;
    };
  };

  static relaxProps = {
    liveGoodsList: 'liveGoodsList',
    goodsInfoList: 'goodsInfoList'
  };
  render() {
    const { liveGoodsList } = this.props.relaxProps;
    return (
      <Table
        rowKey="liveDetailGoodsList"
        dataSource={liveGoodsList}
        columns={this._columns}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '商品',
      render: (name, rowInfo) => {
        const goodsInfo = this.props.relaxProps.goodsInfoList.find(
          (e) => e.goodsInfoId == rowInfo.goodsInfoId
        );

        return (
          <div style={styles.item}>
            <div>
              <img
                src={rowInfo.coverImgUrl ? rowInfo.coverImgUrl : defaultImg}
                style={styles.imgItem}
              />
            </div>
            <div style={styles.goodsInfoRight}>
              <div>{rowInfo.name}</div>
              <div style={styles.specText}>
                {goodsInfo && goodsInfo.specText ? goodsInfo.specText : '-'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '价格',
      render: (_rowInfo, dataSource) => {
        let comps = [];
        switch (dataSource.priceType) {
          case 1:
            comps = [<div>￥{dataSource.price}</div>];
            break;
          case 2:
            comps = [
              <div>
                ￥{dataSource.price}~{dataSource.price2}
              </div>
            ];
            break;
          case 3:
            comps = [
              <div>
                ￥{dataSource.price}
                <del
                  style={{
                    color: 'rgba(153, 153, 153, 1)',
                    fontSize: '12px'
                  }}
                >
                  {dataSource.price2}
                </del>
              </div>
            ];
            break;
          default:
            comps = [<div>--</div>];
            break;
        }
        return comps;
      }
    },
    {
      key: 'stock',
      dataIndex: 'stock',
      title: '库存',
      render: (stock) => {
        return <div>{stock ? stock : '0'}</div>;
      }
    },
    {
      key: 'url',
      dataIndex: 'url',
      title: '链接'
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <CopyToClipboard
        text={rowInfo.url} // 需要复制的文本
        onCopy={() => {
          message.success('复制成功');
        }} // 复制完成的回调
      >
        <a style={styles.edit}>复制链接</a>
      </CopyToClipboard>
    );
  };
}
