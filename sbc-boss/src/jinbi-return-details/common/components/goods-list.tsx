import * as React from 'react';
import {
  Table,
  Row,
  Col,
  Switch,
  Button,
  message,
  Input,
  Checkbox
} from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop } from 'qmkit';

import { DataGrid } from 'qmkit';

const { Column } = Table;

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;
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
    history?: any;
    marketingType?: any;
    relaxProps?: {
      goodsPageContent: IList;
      brands: IList;
      cates: IList;
      coinActivityGoodsVoList: IList;
      isShowActiveStatus: Boolean;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsList', 'goodsInfoPage', 'content'],
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    coinActivityGoodsVoList: 'coinActivityGoodsVoList',
    isShowActiveStatus: 'isShowActiveStatus'
  };

  render() {
    const {
      goodsPageContent,
      brands,
      cates,
      coinActivityGoodsVoList,
      isShowActiveStatus
    } = this.props.relaxProps;
    if (!coinActivityGoodsVoList || !goodsPageContent) {
      return null;
    }
    let dataSource = coinActivityGoodsVoList.map((scope) => {
      let goodInfo = fromJS(goodsPageContent).find(
        (s) => s.get('goodsInfoId') == scope.get('goodsInfoId')
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
        const displayType = scope.get('displayType') || 0;
        goodInfo = goodInfo.set('displayType', displayType);
        return goodInfo;
      }
    });
    dataSource = dataSource.filter((goodsInfo) => goodsInfo);
    const listj = dataSource.toJS();
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
            width="10%"
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
            width="12%"
            render={(value, row: any) => {
              const result = [];
              row.goodsAttributeKeys?.forEach((item) => {
                result.push(item.goodsAttributeValue);
              });
              return result.join('-') || '-';
            }}
          />
          <Column
            width="10%"
            title="类目"
            key="cateName"
            dataIndex="cateName"
          />
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
            width="8%"
            key="displayType"
            title={'是否显示'}
            render={(rowInfo) => {
              return <Switch checked={rowInfo.displayType === 0} disabled />;
            }}
          />
          {isShowActiveStatus ? (
            <Column
              width="8%"
              key="terminationFlag"
              title={'商品状态'}
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
