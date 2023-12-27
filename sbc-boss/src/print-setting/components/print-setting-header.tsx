import * as React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { noop, UEditor } from 'qmkit';
import { List } from 'immutable';
import { Row, Col } from 'antd';

@Relax
export default class SettingUeditor extends React.Component<any, any> {
  props: {
    relaxProps?: {
      chooseImgs: List<any>;
      imgType: number;
      refEditorHead: Function;
      setVisible: Function;

      printSetting: IMap;
    };
  };

  static relaxProps = {
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    refEditorHead: noop,
    setVisible: noop,

    printSetting: 'printSetting'
  };

  render() {
    const {
      refEditorHead,
      chooseImgs,
      imgType,
      printSetting
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
              打印模板顶部：
            </div>
          </Col>
          <Col span={19}>
            <UEditor
              ref={(UEditor) => {
                refEditorHead((UEditor && UEditor.editor) || {});
              }}
              id="reg"
              height="100"
              content={printSetting ? printSetting.get('printHead') : ''}
              insertImg={() => this._handleClick()}
              chooseImgs={chooseImgs.toJS()}
              imgType={imgType}
            />
          </Col>
        </Row>
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
