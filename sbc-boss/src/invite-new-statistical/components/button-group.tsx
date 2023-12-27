import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, noop,ExportModal } from 'qmkit';
import {  fromJS } from 'immutable';
import { IMap } from 'plume2/es5/typings';
import EditModal from './dis-model'
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
      exportModalData:any;
      onExportModalHide:Function;
      onExportModalChange:Function;
      onExportByParams:Function;
      onExportByIds:Function;
    };
  };

  static relaxProps = {
    onAdd: noop,
    exportModalData:'exportModalData',
    onExportModalHide:noop,
    onExportModalChange:noop,
    onExportByParams:noop,
    onExportByIds:noop
  };

  render() {
    const { exportModalData,onExportModalHide } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_invite_new_statistical_export'}>
          <Button type="primary" onClick={() => this._handleBatchExport()}>
                批量导出
          </Button>     
        </AuthWrapper>
        <ExportModal
            data={exportModalData}
            onHide={onExportModalHide}
            handleByParams={exportModalData.get('exportByParams')}
            handleByIds={exportModalData.get('exportByIds')}
            alertInfo={fromJS({
              message: '操作说明:',
              description:
                '为保证效率,每次最多支持' +
                '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'
            })}
            alertVisible={true}
          />
        <EditModal />
      </div>
    );
  }

  async _handleBatchExport() {
    // 校验是否有导出权限
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的邀新记录',
        byIdsTitle: '导出选中的邀新记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
   
  }
}
