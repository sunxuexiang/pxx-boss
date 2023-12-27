import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import GoodsGrid from './goods-grid';

export default class LsGoodsModal extends React.Component<any, any> {
  _goodsGrid: any;

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      companyType: props.companyType,
      wareId:props.wareId
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : [],
      wareId:nextProps.wareId
    });
  }

  render() {
    const {
      visible,
      onOkBackFun,
      onCancelBackFun,
      skuLimit,
      showValidGood,
      isCouponList,
      checkAddedGood,
    } = this.props;
    const { selectedSkuIds, selectedRows, companyType,wareId } = this.state;
    return (
       <Modal  maskClosable={false}
        title={
          <div>
            选择商品&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>{selectedSkuIds.length}</span>款商品
              {skuLimit && `，每次最多可选${skuLimit}款`}
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          this._goodsGrid.clearSearchParam();
          if (skuLimit && selectedSkuIds.length > skuLimit) {
            message.error(`最多选择${skuLimit}种商品`);
          } else {
            onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
          }
        }}
        onCancel={() => {
          this._goodsGrid.clearSearchParam();
          onCancelBackFun();
        }}
        okText="确认"
        cancelText="取消"
      >
        {
          <GoodsGrid
            ref={goodsGrid => this._goodsGrid = goodsGrid}
            visible={visible}
            isCouponList={isCouponList}
            showValidGood={showValidGood}
            // 是否仅勾选上架商品
            checkAddedGood={checkAddedGood}
            skuLimit={skuLimit}
            selectedSkuIds={selectedSkuIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            companyType={companyType}
            wareId={wareId}
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
