import * as React from 'react';
import { DataGrid } from 'qmkit';
import styled from 'styled-components';
import { Relax } from 'plume2';
import { IList, IMap } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button } from 'antd';
import Table from 'antd/es/table/Table';
import Select from 'antd/lib/select';

const TableSet = styled.div`
  @media screen and (max-width: 1440px) {
    .ant-select {
      max-width: 220px;
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1680px) {
    .ant-select {
      max-width: 320px;
    }
  }
  @media screen and (min-width: 1680px) {
    .ant-select {
      max-width: 400px;
    }
  }
`;

const { Column } = DataGrid;

const Option = Select.Option;

/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  props: {
    form?: any;
    disabled?: boolean;
    relaxProps?: {
      goodsRows: IList;
      cateList: IMap;
      deleteSelectedSku: Function;
      fieldsValue: Function;
      sortModalFunction: Function;
      setSortGoodsInfo: Function;
      setIndex: Function;
      biddingType: number;
    };
  };

  static relaxProps = {
    goodsRows: 'goodsRows',
    cateList: 'cateList',
    deleteSelectedSku: noop,
    fieldsValue: noop,
    sortModalFunction: noop,
    setSortGoodsInfo: noop,
    setIndex: noop,
    biddingType: 'biddingType'
  };

  render() {
    const {
      goodsRows,
      sortModalFunction,
      setSortGoodsInfo,
      setIndex
    } = this.props.relaxProps;

    console.log('------------ goodsRows :' + goodsRows);

    return (
      <TableSet className="resetTable">
        <Button
          disabled={this.props.disabled}
          type="primary"
          icon="plus"
          onClick={() => this.onAdd()}
        >
          添加商品
        </Button>
        &nbsp;&nbsp;
        <Table
          rowKey={(record: any) => record.goodsInfoId}
          dataSource={goodsRows ? goodsRows.toJS() : []}
          pagination={false}
          style={{ width: '100%' }}
        >
          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width={100}
          />
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={100}
          />
          <Column
            title="所属商家"
            dataIndex="storeName"
            key="storeName"
            width={100}
          />
          <Column
            title="分类"
            width={120}
            key="cateName"
            dataIndex="cateName"
          />
          <Column
            title="品牌"
            dataIndex="brandName"
            key="brandName"
            width={100}
            render={(brandName) => {
              return brandName ? brandName : '-';
            }}
          />

          <Column
            title="排名"
            key="sort"
            width={40}
            render={(_text, _rowData: any, index) => {
              return index + 1;
            }}
          />

          <Column
            title="操作"
            key="operate"
            width={100}
            render={(_text, _rowData: any, index) => {
              return (
                <div>
                  <a
                    onClick={() => {
                      setSortGoodsInfo({
                        key: 'sortSkuId',
                        value: _rowData.goodsInfoId
                      });
                      setSortGoodsInfo({
                        key: 'originPosition',
                        value: index + 1
                      });
                      setIndex(index + 1);
                      sortModalFunction(true);
                    }}
                  >
                    排名
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <a
                    onClick={() =>
                      this._deleteSelectedSku(_rowData.goodsInfoId)
                    }
                  >
                    删除
                  </a>
                </div>
              );
            }}
          />
        </Table>
      </TableSet>
    );
  }

  _deleteSelectedSku(goodsInfoId) {
    const { deleteSelectedSku } = this.props.relaxProps;

    this.props.form.resetFields([
      goodsInfoId + '_settlementPrice',
      goodsInfoId + '_cateName',
      goodsInfoId + '_convertStock',
      goodsInfoId + '_convertPoints'
    ]);
    deleteSelectedSku(goodsInfoId);
  }

  /**
   *下拉栏里内容填充
   * @private
   */
  _renderOption = () => {
    const { cateList } = this.props.relaxProps;
    return cateList.map((v) => {
      return (
        <Option value={v.get('cateName')} key={v.get('cateId')}>
          {v.get('cateName')}
        </Option>
      );
    });
  };

  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }
}
