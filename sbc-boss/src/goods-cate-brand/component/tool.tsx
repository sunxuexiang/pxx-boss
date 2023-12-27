import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, history, noop } from 'qmkit';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    cateId: string;
    cateName: string;
    relaxProps?: {
      searchData: any;
      showAddModal: Function;
      _onExport: Function;
    };
  };

  static relaxProps = {
    searchData: 'searchData',
    showAddModal: noop,
    _onExport: noop
  };

  render() {
    const { searchData, _onExport } = this.props.relaxProps;
    const { cateId, cateName } = this.props;

    return (
      <div className="handle-bar">
        {/* <AuthWrapper functionName={'f_goods_brand_1'}>
          <Button type="primary" onClick={this._showBrandModal}>
            新增品牌
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_goods_brand_export'}>
          <Button type="primary" onClick={() => _onExport(searchData.toJS())}>
            导出
          </Button>
        </AuthWrapper> */}
        <AuthWrapper functionName={'f_brand_sort_import'}>
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/goods-brand-sort-import',
                state: { cateId, cateName }
              });
            }}
          >
            品牌排序导入
          </Button>
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 显示品牌弹框
   */
  _showBrandModal = () => {
    const { showAddModal } = this.props.relaxProps;
    showAddModal();
  };
}
