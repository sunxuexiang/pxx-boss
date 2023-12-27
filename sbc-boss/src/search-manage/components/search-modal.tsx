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
      searchModalVisible: boolean;
      isAdd: boolean;
      searchModal: Function;
      searchFormData: IMap;
      editSearchFormData: Function;
      doSearchAdd: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    searchModalVisible: 'searchModalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    searchFormData: 'searchFormData',
    searchModal: noop, // 关闭弹窗
    editSearchFormData: noop, //修改from表单数据
    doSearchAdd: noop
  };

  render() {
    const { searchModalVisible, isAdd } = this.props.relaxProps;

    const WrapperForm = this.WrapperForm;
    if (!searchModalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={isAdd ? '新增搜索词' : '编辑搜索词'}
        visible={searchModalVisible}
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
    const { searchModal } = this.props.relaxProps;
    searchModal();
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
    const { doSearchAdd } = this.props.relaxProps;

    doSearchAdd();
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

    const searchTerms = searchFormData.get('searchTerms'); //等级名称
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="搜索词" hasFeedback>
          {getFieldDecorator('searchTerms', {
            rules: [
              { required: true, whitespace: true, message: '仅限1-10位字符' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '搜索词');
                }
              }
            ],
            initialValue: searchTerms,
            onChange: (e) =>
              editSearchFormData(Map({ searchTerms: e.target.value }))
          })(<Input placeholder="请输入1-10位字符" />)}
        </FormItem>
      </Form>
    );
  }
}
