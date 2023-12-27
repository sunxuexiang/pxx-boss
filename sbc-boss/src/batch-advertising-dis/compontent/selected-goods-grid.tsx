import * as React from 'react';
import { DataGrid } from 'qmkit';
import styled from 'styled-components';
import { Relax } from 'plume2';
import { IList } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button,Table,InputNumber} from 'antd';

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;
const RightContent = styled.div`
  width: calc(100% - 320px);
`;
const Column = Table.Column;
/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  props: {
    type:any,
    relaxProps?: {
      goodsRows: IList;
      rGoodsRows:IList;
      formData:any,
      deleteSelectedSku: Function;
      onFormFieldChange: Function;
      stockBut:Function;
    };
  };

  static relaxProps = {
    goodsRows: 'goodsRows',
    rGoodsRows:'rGoodsRows',
    formData:'formData',
    onFormFieldChange: noop,
    deleteSelectedSku: noop,
    stockBut:noop,
    
  };
  state={
    value:0,
    row:{}
  }
  render() {
    const {  deleteSelectedSku,stockBut,formData
    }= this.props.relaxProps;
    const lists=formData.get('advertisingRetailConfigs')
    return (
      <div>
        <Button type="primary" icon="plus" onClick={() => this.onAdd()}>
          添加商品
        </Button>&nbsp;&nbsp;
        <TableRow>
          <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.goodsInfoId}
            dataSource={lists[this.props.type].goodsRows||[]}
            pagination={false}
          >
            <Column
              title="排序"
              dataIndex="goodsInfoNo1"
              key="goodsInfoNo1"
              width="15%"
              render={(text,row:any,index) => {
                return (
                  <InputNumber placeholder="请输入"  value={row.sortNum}   onBlur={this.blurBut()} onChange={(e)=>stockBut(index,e)} />
                );
              }}
            />
            <Column
              title="SKU编码"
              dataIndex="goodsInfoNo"
              key="goodsInfoNo"
              width="15%"
            />

            <Column
              title="商品名称"
              dataIndex="goodsInfoName"
              key="goodsInfoName"
              width="20%"
            />

            <Column
              title="规格"
              dataIndex="specText"
              key="specText"
              width="15%"
              render={(value) => {
                if (value) {
                  return value;
                } else {
                  return '-';
                }
              }}
            />

            <Column
              title="分类"
              key="cateName"
              dataIndex="cateName"
              width="10%"
            />

            <Column
              title="品牌"
              key="brandName"
              dataIndex="brandName"
              width="10%"
              render={(value) => {
                if (value) {
                  return value;
                } else {
                  return '-';
                }
              }}
            />

            <Column
              title="单价"
              key="marketPrice"
              dataIndex="marketPrice"
              width="10%"
              render={(data) => {
                return `¥${data}`;
              }}
            />

            <Column
              title="操作"
              key="operate"
              width="15%"
              render={(text,row,i) => {
                return (
                  <a onClick={() => deleteSelectedSku(i,this.props.type)}>删除</a>
                );
              }}
            />
          </DataGrid>
        </TableRow>
        
      </div>
    );
  }
  blurBut=()=>{
    // console.log(666)
  };
  
  onAdd() {
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange( 'goodsModalVisible',  true );
    onFormFieldChange( 'isType',  this.props.type);
  }
}
