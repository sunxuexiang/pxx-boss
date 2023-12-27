import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs,Form,Alert } from 'antd';

import { noop,AuthWrapper } from 'qmkit';
import List from './list';
import SearchForm from './search-form';
import { IList } from 'typings/globalType';
import { BdGoodsModal } from 'biz';
@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
        fieldsValue: Function;
        wareId: any;
      warehouseList:IList;
      chooseSkuIds:IList;
      goodsModalVisible:boolean;
      list:IList;
      onOkBackFun:Function;
      onTab:Function;
    };
  };

  static relaxProps = {
    fieldsValue: noop,
    wareId: 'wareId',
    onTab:noop,
    warehouseList:'warehouseList',
    chooseSkuIds:'chooseSkuIds',
    goodsModalVisible:'goodsModalVisible',
    list:'list',
    onOkBackFun:noop
  };

  render() {
    const { fieldsValue,onTab, wareId,warehouseList,chooseSkuIds,goodsModalVisible,list } = this.props.relaxProps;
    return (
      <div>
        <Tabs onChange={(key) => onTab(key)} activeKey={String(wareId)}>
            {
                warehouseList.toJS().map(item=><Tabs.TabPane tab={item.wareName} key={item.wareId+''}>
                    <SearchForm />
                    <List />
                </Tabs.TabPane>)
            }
            
            
        </Tabs>
        <div style={{ width: '100%' }}>
                    <BdGoodsModal
                        limitNOSpecialPriceGoods={true}
                        showValidGood={true}
                        isCouponList={12}
                        visible={goodsModalVisible}
                        selectedSkuIds={chooseSkuIds.toJS()}
                        selectedRows={list.toJS()}
                        onOkBackFun={this._onOkBackFun}
                        onCancelBackFun={this.onCancelBackFun}
                        wareId={Number(wareId)}
                    />
       </div>    
    </div>
    );
  }

    // 关闭弹窗
    onCancelBackFun = () => {
        const { fieldsValue } = this.props.relaxProps;
        fieldsValue('goodsModalVisible', false)
    }
    /**
    *商品 点击确定之后的回调
    */
    _onOkBackFun = (skuIds, rows) => {
        console.log(skuIds, rows,'skuIds, rows');
        
        // this.props.form.fieldsValue({
        //     chooseSkuIds: skuIds
        // });
        // this.props.form.validateFields((_errs) => {});
        this.props.relaxProps.onOkBackFun(skuIds, rows);
    };
    
}
