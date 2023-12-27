import * as React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { noop, UEditor } from 'qmkit';
import { List } from 'immutable';
import { Row, Col, Button } from 'antd';

@Relax
export default class SettingUeditor extends React.Component<any, any> {
  props: {
    relaxProps?: {
      chooseImgs: List<any>;
      imgType: number;
      refEditor: Function;
      setVisible: Function;
      refEditorBottom: Function;
      printSetting: IMap;
      onSaveFunc: Function;
    };
  };

  static relaxProps = {
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    refEditor: noop,
    setVisible: noop,
    refEditorBottom: noop,
    printSetting: 'printSetting',
    onSaveFunc: noop
  };

  render() {
    const {
      refEditorBottom,
      chooseImgs,
      imgType,
      printSetting,
      onSaveFunc
    } = this.props.relaxProps;
    return (
      <div>
        <Row>
          <Col span={3}>
            <div
              style={{
                fontSize: 14,
                textAlign: 'right',
                color: 'rgba(0, 0, 0, 0.85)'
              }}
            >
              打印模板尾部：
            </div>
          </Col>
          <Col span={19}>
            <UEditor
              ref={(UEditor) => {
                refEditorBottom((UEditor && UEditor.editor) || {});
              }}
              id="regBottom"
              height="100"
              content={printSetting ? printSetting.get('printBottom') : ''}
              insertImg={() => this._handleClick()}
              chooseImgs={chooseImgs.toJS()}
              imgType={imgType}
            />
          </Col>
        </Row>
        <div className="bar-button">
          <Button type="primary" onClick={() => onSaveFunc()}>
            保存
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.setVisible(10, 2);
  };
}
