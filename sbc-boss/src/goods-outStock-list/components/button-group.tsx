import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, history, noop, ExportModal } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      exportModalData: IMap;
      checkedIds: IList;

      onExportModalHide: Function;
    };
  };

  static relaxProps = {
    exportModalData: 'exportModalData',
    checkedIds: 'checkedIds',

    onExportModalHide: noop
  };

  render() {
    const { onExportModalHide, exportModalData } = this.props.relaxProps;
    // const biddingType = searchData.get('biddingType');
    return (
      <div className="handle-bar">
        {/* <AuthWrapper functionName={'f_bidding_add'}> */}

        {/* <Button  onClick={() => {
              onExportModalShow({
                byParamsTitle: '导出筛选出的信息',
                byIdsTitle: '导出勾选的信息',
                byAllTitle:'导出全部信息'
              });
            }}>
              批量导出
            </Button> */}

        {/* </AuthWrapper> */}
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          handleByAll={exportModalData.get('exportByAll')}
        />
      </div>
    );
  }
}
