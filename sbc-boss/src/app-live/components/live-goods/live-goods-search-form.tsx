import React from 'react';
import { Button, Form } from 'antd';
import { Relax } from 'plume2';
import { noop, AuthWrapper } from 'qmkit';
import { GoodsModal } from 'biz';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';
// const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onGoodsChange: Function;
      onAddGoodsChange: Function;
      selectedSkuIds: IList;
      selectedRows: IList;
      modalVisible: Button;
    };
  };

  static relaxProps = {
    onGoodsChange: noop,
    onAddGoodsChange: noop,
    selectedSkuIds: 'selectedSkuIds',
    selectedRows: 'selectedRows',
    modalVisible: 'modalVisible'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { selectedSkuIds, selectedRows, modalVisible } =
      this.props.relaxProps;

    return (
      <div>
        <AuthWrapper functionName="f_app_live_add1">
          <Button
            type="primary"
            onClick={() => {
              this.openGoodsModal();
            }}
          >
            添加商品
          </Button>
        </AuthWrapper>
        <GoodsModal
          visible={modalVisible}
          isWare={true}
          // marketingId={marketingId}
          showValidGood={true}
          checkAddedGood={true}
          // wareId={null}
          selectedSkuIds={selectedSkuIds.toJS()}
          selectedRows={selectedRows.toJS()}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
      </div>
    );
  }

  openGoodsModal = () => {
    const { onGoodsChange } = this.props.relaxProps;
    onGoodsChange('modalVisible', true);
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIdsList, selectedRowsList) => {
    const { onAddGoodsChange } = this.props.relaxProps;
    onAddGoodsChange(fromJS([...new Set(selectedSkuIdsList)]));
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    const { onGoodsChange } = this.props.relaxProps;
    onGoodsChange('modalVisible', false);
  };
}
