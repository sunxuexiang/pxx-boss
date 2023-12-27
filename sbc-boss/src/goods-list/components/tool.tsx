import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Alert, message } from 'antd';
import { AuthWrapper, history, noop, ExportModal } from 'qmkit';
import { IMap } from '../../../typings/globalType';
import { Const, util } from 'qmkit';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onExportByParams: Function;
      onExportModalShow: Function;
      exportModalData: IMap;
      onExportModalHide: Function;
    };
  };

  static relaxProps = {
    onExportByParams: noop,
    onExportModalShow: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  render() {
    const { exportModalData, onExportModalHide } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_goods_export'}>
          <Button type="primary" onClick={() => this._batchExport()}>
            导出
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_goods_sort_import'}>
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/goods-sort-import'
              });
            }}
          >
            商品排序导入
          </Button>
        </AuthWrapper>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          extraDom={
            <Alert
              message="操作说明：为保证效率，每次最多支持导出1000条记录，如需导出更多，请更换筛选条件后再次导出"
              type="warning"
            />
          }
        />
      </div>
    );
  }
  /**
   * 批量导出
   */
  _batchExport() {
    const { onExportModalShow } = this.props.relaxProps;
    onExportModalShow({
      byParamsTitle: '导出筛选出的信息',
      byIdsTitle: '导出勾选的信息'
    });
  }
}
