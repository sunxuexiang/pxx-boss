import React from 'react';
import { Relax } from 'plume2';
import { Col, Form, Radio, Row ,TreeSelect} from 'antd';
import { IList, IMap } from 'typings/globalType';
import { DataGrid, QMFloat ,FindArea} from 'qmkit';
import GoodsImage from '../../goods-detail/components/image';
import styled from 'styled-components';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Column } = DataGrid;

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

const GreyBox = styled.div`
  background: #f7f7f7;
  padding: 15px;

  p {
    color: #333333;
    line-height: 25px;
  }
`;

@Relax
export default class BasicInfo extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      goods: IMap;
      storeInfo: IMap;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    goods: 'goods',
    storeInfo: 'storeInfo'
  };

  render() {
    const { goodsList, goods, goodsSpecs, storeInfo } = this.props.relaxProps;

    return (
      <div>
        <GreyBox>
          <p>商家：{storeInfo.get('supplierName')}</p>
          <p>商家编码：{storeInfo.get('supplierCode')}</p>
          <p>店铺：{storeInfo.get('storeName')}</p>
          <p>店铺：{goods.get('wareName')||'-'}</p>
        </GreyBox>
        <div style={{ marginTop: 20 }}>
          <div className="detailTitle">基本信息</div>
          <Form style={{ marginTop: 20 }}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="门店价" required={true}>
                  <div>{QMFloat.addZero(goods.get('marketPrice'))}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="大客户价" required={true}>
                  <div>{QMFloat.addZero(goods.get('vipPrice'))}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="上下架" required={true}>
                  <RadioGroup disabled value={goods.get('addedFlag')}>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="商品询价设置" required={true}>
                  <RadioGroup disabled value={goods.get('inquiryFlag')}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
            <Col span={8}>
              <FormItem label="产地" {...formItemLayout}>
                {/* {getFieldDecorator('originCode', {
                  initialValue: goods.get('originCode')
                })( */}
                  <TreeSelect
                  disabled={true}
                  value={goods.get('originCode')}
                    // searchPlaceholder='请选择地区'
                    treeData={this._buildFreeAreaData('')}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
              </FormItem>
            </Col>
            </Row>
          </Form>
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="detailTitle" style={{ marginBottom: 20 }}>
            规格信息
          </div>
          <DataGrid
            dataSource={goodsList.toJS()}
            pagination={false}
            rowKey="goodsInfoId"
          >
            {/*<Column*/}
            {/*title="二维码"*/}
            {/*dataIndex="goodsInfoQrcode"*/}
            {/*key="goodsInfoQrcode"*/}
            {/*render={(url) => {*/}
            {/*return (*/}
            {/*<div className="smallCenter">*/}
            {/*<GoodsImage url={url} />*/}
            {/*</div>*/}
            {/*);*/}
            {/*}}*/}
            {/*/>*/}
            <Column
              title="图片"
              dataIndex="goodsInfoImg"
              key="goodsInfoImg"
              render={(url) => {
                return (
                  <div className="smallCenter">
                    <GoodsImage url={url} />
                  </div>
                );
              }}
            />
            {goodsSpecs
              .map((item) => {
                return (
                  <Column
                    title={item.get('specName')}
                    dataIndex={'specId-' + item.get('specId')}
                    key={item.get('specId')}
                  />
                );
              })
              .toList()}
            <Column title="SKU编码" dataIndex="goodsInfoNo" key="goodsInfoNo" />
            <Column title="库存" dataIndex="stock" key="stock" />
            <Column
              title="条形码"
              dataIndex="goodsInfoBarcode"
              key="goodsInfoBarcode"
              render={(goodsInfoBarcode) =>
                goodsInfoBarcode ? goodsInfoBarcode : '-'
              }
            />
          </DataGrid>
        </div>
      </div>
    );
  }
    /**
   * 构建地区数据
   */
     _buildFreeAreaData = (id) => {

      return FindArea.findProvinceCity([]);
    };
}
