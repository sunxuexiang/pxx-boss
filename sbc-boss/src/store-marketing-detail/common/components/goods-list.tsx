import * as React from 'react';
import { Table, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { IList } from 'typings/globalType';

const { Column } = Table;

const GreyBg = styled.div`
  padding: 15px 0;
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
export default class GoodsList extends React.Component<any, any> {
  props: {
    marketingType?: any;
    relaxProps?: {
      goodsPageContent: IList;
      brands: IList;
      cates: IList;
      marketingScopeList: IList;
      subType: number;
      isShowActiveStatus: Boolean;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsList', 'goodsInfoPage', 'content'],
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    marketingScopeList: 'marketingScopeList',
    subType: 'subType',
    isShowActiveStatus: 'isShowActiveStatus'
  };

  render() {
    const {
      goodsPageContent,
      brands,
      cates,
      marketingScopeList,
      subType,
      isShowActiveStatus
    } = this.props.relaxProps;
    if (!marketingScopeList || !goodsPageContent) {
      return null;
    }
    let dataSource = marketingScopeList.map((scope) => {
      let goodInfo = fromJS(goodsPageContent).find(
        (s) => s.get('goodsInfoId') == scope.get('scopeId')
      );

      if (goodInfo) {
        const cId = goodInfo.get('cateId');
        const cate = fromJS(cates || []).find((s) => s.get('cateId') === cId);
        goodInfo = goodInfo.set('cateName', cate ? cate.get('cateName') : '-');

        const bId = goodInfo.get('brandId');
        const brand = fromJS(brands || []).find(
          (s) => s.get('brandId') === bId
        );
        goodInfo = goodInfo.set(
          'brandName',
          brand ? brand.get('brandName') : '-'
        );
        goodInfo = goodInfo.set(
          'whetherChoice',
          scope ? scope.get('whetherChoice') : ''
        );
        return goodInfo;
      }
    });
    dataSource = dataSource.filter((goodsInfo) => goodsInfo);
    const listj = dataSource.toJS();
    marketingScopeList.toJS().forEach((element) => {
      listj.forEach((el) => {
        if (element.scopeId == el.goodsInfoId) {
          // console.log(el.purchaseNum, '1231231', element.purchaseNum);
          el.purchaseNum = element.purchaseNum;
          el.perUserPurchaseNum = element.perUserPurchaseNum;
        }
      });
    });
    if (subType == 6 || subType == 7 || subType == 8) {
      return <div></div>;
    }
    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>已选商品：</span>
            </Col>
          </Row>
        </GreyBg>
        <Table
          dataSource={listj}
          pagination={false}
          scroll={{ y: 500 }}
          rowKey="goodsInfoId"
        >
          <Column
            width="8%"
            title="SKU编码"
            key="goodsInfoNo"
            dataIndex="goodsInfoNo"
          />

          <Column
            width="15%"
            title="ERP编码"
            key="erpGoodsInfoNo"
            dataIndex="erpGoodsInfoNo"
          />
          <Column
            width="20%"
            title="商品名称"
            key="goodsInfoName"
            dataIndex="goodsInfoName"
          />
          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width="10%"
            render={(value, row: any) => {
              const result = [];
              row.goodsAttributeKeys?.forEach((item) => {
                result.push(item.goodsAttributeValue);
              });
              return result.join('-') || '-';
            }}
          />
          <Column width="8%" title="类目" key="cateName" dataIndex="cateName" />
          <Column
            width="10%"
            title="品牌"
            key="brandName"
            dataIndex="brandName"
          />
          <Column
            width="7%"
            key="priceType"
            title={'单价'}
            render={(rowInfo) => <div>{rowInfo.salePrice}</div>}
          />
          <Column
            width="7%"
            key="marketingLabels"
            title={'必选商品'}
            render={(rowInfo) => (
              //<div>{rowInfo.marketingLabels[0]}</div>
              <div>{rowInfo.whetherChoice == 0 ? '否' : '是'}</div>
            )}
          />
          <Column
            width="8%"
            key="purchaseNum"
            title={'总限购数量'}
            render={(rowInfo) => (
              <div>
                {rowInfo.purchaseNum && rowInfo.purchaseNum > 0
                  ? rowInfo.purchaseNum
                  : '无'}{' '}
              </div>
            )}
          />
          <Column
            width="8%"
            key="perUserPurchaseNum"
            title={'单用户限购量'}
            render={(rowInfo) => (
              //<div>{rowInfo.marketingLabels[0]}</div>
              <div>
                {rowInfo.perUserPurchaseNum && rowInfo.perUserPurchaseNum > 0
                  ? rowInfo.perUserPurchaseNum
                  : '无'}{' '}
              </div>
            )}
          />
          {isShowActiveStatus ? (
            <Column
              width="8%"
              key="terminationFlag"
              title={'活动状态'}
              render={(rowInfo) => (
                <div>{rowInfo.terminationFlag == 0 ? '参与中' : '已终止'}</div>
              )}
            />
          ) : null}
        </Table>
      </div>
    );
  }
}
