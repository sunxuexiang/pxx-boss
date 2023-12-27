import React from 'react';
import { Button } from 'antd';
import { history, noop } from 'qmkit';
import { Relax } from 'plume2';

@Relax
export default class EditForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      handleSubmit: Function;
    };
  };

  static relaxProps = {
    handleSubmit: noop
  };

  render() {
    const { handleSubmit } = this.props.relaxProps;
    return (
      <div className="bar-button" style={{ left: 264 }}>
        <Button
          type="primary"
          onClick={() => {
            handleSubmit();
          }}
        >
          保存
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={() => history.goBack()}>
          返回
        </Button>
      </div>
    );
  }
}
