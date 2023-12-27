import React from 'react';
import { Relax } from 'plume2';
import { Button, Menu, message, Popconfirm, Modal, Input } from 'antd';
// import { IList } from 'typings/globalType';
// import { AuthWrapper, history } from 'qmkit';
import { noop } from 'lodash';
// const { TextArea } = Input;
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onExportModalShow:Function
    };
  };

  static relaxProps = {
    onExportModalShow:noop
  };

  render() {
    const { onExportModalShow} = this.props.relaxProps;
    // console.log(selectedRowKeys, 'selectedRowKeysselectedRowKeys');

    return (
      <div className="handle-bar">
        <Button
            type="primary"
            onClick={() =>
              onExportModalShow({
                byParamsTitle: '导出筛选出的信息',
                byIdsTitle: '导出勾选的信息',
                byAllTitle: '导出全部信息'
              })
            }
          >
            批量导出
          </Button>
      
      </div>
    );
  }
 
}
