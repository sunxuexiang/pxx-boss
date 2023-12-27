import React from 'react';
import { Button, Modal, message } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { history } from 'qmkit';
const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
      marketId: string | number;
    };
  };

  static relaxProps = {
    onAdd: noop,
    marketId: 'marketId'
  };

  render() {
    const { onAdd, marketId } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <Button
          onClick={() =>
            history.push({
              pathname: '/logistics-company-import',
              state: { marketId }
            })
          }
        >
          批量导入
        </Button>
        <Button type="primary" onClick={() => onAdd()}>
          新增物流公司
        </Button>
      </div>
    );
  }
}
