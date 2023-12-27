import React from 'react';
import { Button } from 'antd';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
    };
  };

  static relaxProps = {
    onAdd: noop
  };

  render() {
    const { onAdd } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        {/* <AuthWrapper functionName={'f_goods_label_2'}> */}
        <Button type="primary" onClick={() => onAdd()}>
          新增标签
        </Button>
        {/* </AuthWrapper> */}
      </div>
    );
  }
}
