import * as React from 'react';
import { Table, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';

const { Column } = Table;

import styled from 'styled-components';

const GreyBg = styled.div`
  padding: 15px 0 15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@withRouter
@Relax
export default class GiftList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      levelList: IList;
      giftList: IList;
      brands: IList;
      cates: IList;
      subType: any;
    };
  };

  static relaxProps = {
    levelList: 'levelList',
    giftList: 'giftList',
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    subType: 'subType'
  };

  render() {
    const { levelList, giftList, brands, cates, subType } =
      this.props.relaxProps;
    let skuList = fromJS(giftList);
    let brandList = fromJS(brands ? brands : []);
    let cateList = fromJS(cates ? cates : []);
    let dataSource = levelList.map((level) => {
      level = level.set(
        'fullGiftDetailList',
        level.get('fullGiftDetailList').map((gift) => {
          const sku = skuList.find(
            (s) => s.get('goodsInfoId') === gift.get('productId')
          );
          gift = gift.set('sku', sku);

          const cId = sku.get('cateId');
          const cate = cateList.find((s) => s.get('cateId') === cId);
          gift = gift.set('cateName', cate ? cate.get('cateName') : '');

          const bId = sku.get('brandId');
          const brand = brandList.find((s) => s.get('brandId') === bId);
          gift = gift.set('brandName', brand ? brand.get('brandName') : '');
          return gift;
        })
      );
      return level;
    });
    console.log(dataSource.toJS(), 'nextPropsnextProps');

    return (
      <div>
        {dataSource.toJS().map((level) => (
          <div key={Math.random()}>
            <GreyBg>
              <Row>
                <Col span={24}>
                  <span>规则：</span>满
                  {level.fullAmount ? level.fullAmount : level.fullCount}
                  {subType == '4' ? '元' : '件'}{' '}
                  {level.giftType == '1' ? '可选一种' : '默认全赠'}
                </Col>
              </Row>
            </GreyBg>

            <Table
              dataSource={level.fullGiftDetailList}
              pagination={false}
              rowKey="giftDetailId"
            >
              <Column
                width="10%"
                title="SKU编码"
                key="goodsInfoNo"
                render={(rowInfo) => <div>{rowInfo.sku.goodsInfoNo}</div>}
              />
              <Column
                width="15%"
                title="ERP编码"
                key="erpGoodsInfoNo"
                render={(rowInfo) => <div>{rowInfo.sku.erpGoodsInfoNo}</div>}
              />
              <Column
                width="25%"
                title="商品名称"
                key="goodsInfoName"
                render={(rowInfo) => <div>{rowInfo.sku.goodsInfoName}</div>}
              />
              <Column
                width="12%"
                title="类目"
                key="cateName"
                render={(rowInfo) => (
                  <div>{rowInfo.cateName ? rowInfo.cateName : '-'}</div>
                )}
              />
              <Column
                width="10%"
                title="品牌"
                key="brandName"
                render={(rowInfo) => (
                  <div>{rowInfo.brandName ? rowInfo.brandName : '-'}</div>
                )}
              />
              <Column
                width="8%"
                key="priceType"
                title={'单价'}
                render={(rowInfo) => {
                  let price = rowInfo.sku.salePrice;
                  if (rowInfo.sku.goodsInfoType == 1) {
                    price = rowInfo.sku.specialPrice;
                  }
                  return <div>{price}</div>;
                }}
              />
              <Column
                width="7%"
                title="赠送数量"
                key="productNum"
                dataIndex="productNum"
              />
              <Column
                width="7%"
                title="限赠送数量"
                key="boundsNum"
                dataIndex="boundsNum"
              />
            </Table>
          </div>
        ))}
      </div>
    );
  }
}
