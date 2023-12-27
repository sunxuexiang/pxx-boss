import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { Relax, Store } from 'plume2';
import { noop, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { fromJS, Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class SearchModal extends React.Component<any, any> {
  _store: Store;
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }
  props: {
    relaxProps?: {
      presetModalVisible: boolean;
      isAdd: boolean;
      presetModal: Function;
      searchFormData: IMap;
      editSearchFormData: Function;
      editInfo: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    presetModalVisible: 'presetModalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    searchFormData: 'searchFormData',
    presetModal: noop, // 关闭弹窗
    editSearchFormData: noop, //修改from表单数据
    editInfo: noop
  };

  render() {
    const { presetModalVisible, isAdd } = this.props.relaxProps;

    const WrapperForm = this.WrapperForm;
    if (!presetModalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={isAdd ? '新增预置搜索词' : '编辑预置搜索词'}
        visible={presetModalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { presetModal } = this.props.relaxProps;
    presetModal();
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      console.log('errs', errs);
      if (!errs) {
        this.examine();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 校验一下
   */
  examine = () => {
    const { editInfo } = this.props.relaxProps;
    editInfo();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      searchFormData: IMap;
      editSearchFormData: Function;
    };

    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { searchFormData, editSearchFormData } = this.props.relaxProps;

    const presetSearchKeyword = searchFormData.get('presetSearchKeyword'); //等级名称
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="预置搜索词" hasFeedback>
          {getFieldDecorator('presetSearchKeyword', {
            rules: [
              { required: true, whitespace: true, message: '仅限1-10位字符' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '预置搜索词');
                }
              }
            ],
            initialValue: presetSearchKeyword,
            onChange: (e) =>
              editSearchFormData(Map({ presetSearchKeyword: e.target.value }))
          })(<Input placeholder="请输入1-10位字符" />)}
        </FormItem>
      </Form>
    );
  }
}
