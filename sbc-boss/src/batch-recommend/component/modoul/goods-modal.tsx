import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import GoodsGrid from './goods-grid';
import { IList } from 'typings/globalType';

export default class GoodsModal extends React.Component<any, any> {
  props: {
    marketingId: String,
    selectedSkuIds: IList;
    selectedRows: IList;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    //搜索参数
    searchParams?: Object;
    //应用标示。如添加秒杀商品：saleType
    application?: string;
    //是否排除提价商品
    limitNOSpecialPriceGoods: boolean;
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
        marketingId: props.marketingId
        ? props.marketingId
        : '',
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      visible,
      onOkBackFun,
      onCancelBackFun,
      skuLimit,
      showValidGood,
      searchParams,
      application,
      limitNOSpecialPriceGoods
    } = this.props;
    
    const { selectedSkuIds, selectedRows ,marketingId} = this.state;
    
    return (
      <Modal  maskClosable={false}
        title={
          <div>
            选择三级类目&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>{selectedSkuIds.length}</span>一种类目
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          if(this.state.selectedRows.size <= 10) {
            onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
          }else {
            message.error('最多选择10种推荐类目');
          }
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="确认"
        cancelText="取消"
      >
        {
          <GoodsGrid
          marketingId={marketingId}
            visible={visible}
            showValidGood={showValidGood}
            skuLimit={skuLimit}
            selectedSkuIds={selectedSkuIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
            limitNOSpecialPriceGoods={limitNOSpecialPriceGoods}
          />
        }
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows) => {
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows
    });
  };
}
