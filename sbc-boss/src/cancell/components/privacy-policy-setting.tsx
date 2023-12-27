import React from 'react';
import { AuthWrapper, noop, UEditor } from 'qmkit';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Button } from 'antd';

@Relax
export default class privacyPolicySetting extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refSupDetailEditor: Function;
      chooseImgs: List<any>;
      imgType: number;
      setVisible: Function;
      editEditor: Function;
      refSupRegisterEditor: Function;

      privacyPolicyPop: string;
      privacyPolicy: string;
      onSubmit: Function;
    };
  };
  static relaxProps = {
    refSupDetailEditor: noop,
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    setVisible: noop,
    editEditor: noop,
    refSupRegisterEditor: noop,
    privacyPolicy: 'privacyPolicy',
    privacyPolicyPop: 'privacyPolicyPop',
    onSubmit: noop
  };
  constructor(props) {
    super(props);
  }
  state = {
    maximumWord: 50000
  };
  render() {
    const { maximumWord } = this.state;
    return (
      <div>
        <p style={{ fontSize: 'larger' }}>注销政策弹窗</p>
        <div style={{ marginBottom: 30, marginTop: 15 }}>
          <UEditor
            ref={(UEditor) => {
              this.props.relaxProps.refSupDetailEditor(
                (UEditor && UEditor.editor) || {}
              );
            }}
            id="supplier"
            height="320"
            maximumWords={maximumWord}
            content={this.props.relaxProps.privacyPolicyPop}
            insertImg={() => this._handleClick()}
            chooseImgs={this.props.relaxProps.chooseImgs.toJS()}
            imgType={this.props.relaxProps.imgType}
          />
        </div>
        <p style={{ fontSize: 'larger' }}>注销政策</p>
        <div style={{ marginBottom: 30, marginTop: 15 }}>
          <UEditor
            ref={(RegisterEditor) => {
              if (RegisterEditor && RegisterEditor.editor) {
                this.props.relaxProps.refSupRegisterEditor(
                  RegisterEditor.editor
                );
              }
            }}
            id="registerSupEditor"
            height="320"
            maximumWords={maximumWord}
            content={this.props.relaxProps.privacyPolicy}
            insertImg={() => this._registerClick()}
            chooseImgs={this.props.relaxProps.chooseImgs.toJS()}
            imgType={this.props.relaxProps.imgType}
          />
        </div>
        <AuthWrapper functionName={'f_privacy_cancellay_edit'}>
          <div className="bar-button" key="button">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                this._handleSubmit(maximumWord);
              }}
            >
              保存
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }

  _handleSubmit = (maximumWord) => {
    this.props.relaxProps.onSubmit(maximumWord);
  };
  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.editEditor('supplier');
    this.props.relaxProps.setVisible(10, 2);
  };

  _registerClick = () => {
    this.props.relaxProps.editEditor('registerSupEditor');
    this.props.relaxProps.setVisible(10, 2);
  };
}
