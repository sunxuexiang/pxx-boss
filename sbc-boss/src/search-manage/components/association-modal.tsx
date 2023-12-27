import * as React from 'react';
import { Form, Input, Modal, Alert, Select } from 'antd';
import { Relax, Store } from 'plume2';
import { noop, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { fromJS, Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const Option = Select.Option;
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
export default class AssociationModal extends React.Component<any, any> {
  _store: Store;
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }
  props: {
    relaxProps?: {
      associationModalVisible: boolean;
      isAdd: boolean;
      associationModal: Function;
      associationFormData: IMap;
      editAssociationFormData: Function;
      doAssociationAdd: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    associationModalVisible: 'associationModalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    associationFormData: 'associationFormData',
    associationModal: noop, // 关闭弹窗
    editAssociationFormData: noop, //修改from表单数据
    doAssociationAdd: noop
  };

  render() {
    const { associationModalVisible, isAdd } = this.props.relaxProps;

    const WrapperForm = this.WrapperForm;
    if (!associationModalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={isAdd ? '新增搜索联想词' : '编辑搜索联想词'}
        visible={associationModalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
        width={580}
      >
        <div>
          <Alert
            style={{ marginBottom: 15 }}
            message=""
            description={
              <p>
                每个联想词可添加3个长尾词，用于扩展搜索场景，每个长尾词不要超过5个字
              </p>
            }
            type="info"
          />
          <WrapperForm
            ref={(form) => (this._form = form)}
            relaxProps={this.props.relaxProps}
          />
        </div>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { associationModal } = this.props.relaxProps;
    associationModal();
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
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
    const { doAssociationAdd } = this.props.relaxProps;
    doAssociationAdd();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      associationFormData: IMap;
      editAssociationFormData: Function;
    };

    form;
  };

  constructor(props) {
    super(props);

    this.state = {
      inputVisible: false,
      inputValue: ''
    };
  }

  render() {
    const {
      associationFormData,
      editAssociationFormData
    } = this.props.relaxProps;

    const searchTerms = associationFormData.get('searchTerms'); //搜索词
    let longTailWordList =
      associationFormData.get('longTailWordList') || fromJS([]); //长尾词
    const associationalWord = associationFormData.get('associationalWord'); //联想词
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="搜索词：">
          {getFieldDecorator('searchTerms', {
            initialValue: searchTerms
          })(<div>{searchTerms}</div>)}
        </FormItem>
        <FormItem {...formItemLayout} label="搜索联想词：" hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              { required: true, whitespace: true, message: '仅限1-10位字符' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '搜索联想词');
                }
              }
            ],
            initialValue: associationalWord,
            onChange: (e) =>
              editAssociationFormData(
                Map({ associationalWord: e.target.value })
              )
          })(<Input placeholder="仅限1-10位字符" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="长尾词：">
          {getFieldDecorator('tag', {
            rules: [
              {
                validator: (_rule, value, callback) => {
                  if (!value) {
                    callback();
                    return;
                  }

                  if (value.length > 0) {
                    const valueList = fromJS(value);
                    let overLen = false;
                    let whitespace = false;
                    let duplicated = false;

                    valueList.forEach((v, k) => {
                      const trimValue = v.trim();
                      if (!trimValue) {
                        whitespace = true;
                        return false;
                      }
                      if (v.length > 5) {
                        overLen = true;
                        return false;
                      }

                      // 重复校验
                      const duplicatedIndex = valueList.findIndex(
                        (v1, index1) => index1 != k && v1.trim() === trimValue
                      );
                      if (duplicatedIndex > -1) {
                        duplicated = true;
                      }
                    });

                    if (whitespace) {
                      callback(new Error('长尾词不能为空格字符'));
                      return;
                    }
                    if (overLen) {
                      callback(new Error('每项值最多支持5个字符'));
                      return;
                    }
                    if (duplicated) {
                      callback(new Error('规格值重复'));
                      return;
                    }
                  }

                  if (value.length > 3) {
                    callback(new Error('最多支持3个规格值'));
                    return;
                  }

                  callback();
                }
              }
            ],
            initialValue: longTailWordList.toJS(),
            onChange: (e) => {
              this.handleInputConfirm(e);
            }
          })(
            <Select
              mode="tags"
              placeholder="请输入规格值"
              notFoundContent="暂无规格值"
              tokenSeparators={[',']}
            >
              {this._getChildren()}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }

  handleInputConfirm = (e) => {
    const {
      editAssociationFormData,
      associationFormData
    } = this.props.relaxProps;
    let longTailWordList = associationFormData.get('longTailWordList') || []; //长尾词

    if (e && longTailWordList.indexOf(e) === -1) {
      longTailWordList = fromJS(e);
    }
    editAssociationFormData(Map({ longTailWordList: longTailWordList }));
  };

  /**
   * 获取规格值转为option
   */
  _getChildren = () => {
    const { associationFormData } = this.props.relaxProps;
    let longTailWordList = associationFormData.get('longTailWordList'); //长尾词

    console.log('longTailWordList', longTailWordList);
    if (!longTailWordList) longTailWordList = [];
    let children = [];

    longTailWordList.map((item, index) => {
      children.push(<Option key={index}>{item}</Option>);
    });

    return children;
  };
}
