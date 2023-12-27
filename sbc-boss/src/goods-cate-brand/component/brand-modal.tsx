import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, message, Modal } from 'antd';
import { Relax } from 'plume2';
import { fromJS, Map } from 'immutable';
import { IMap } from 'typings/globalType';
import { noop, ValidConst } from 'qmkit';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FILE_MAX_SIZE = 50 * 1024;
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
export default class BrandModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(BrandModalForm as any);
  }

  props: {
    cateId: string;
    relaxProps?: {
      modalVisible: boolean;
      closeModal: Function;
      formData: IMap;
      images: any;
      editFormData: Function;
      doAdd: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 添加品牌
    doAdd: noop,
    // 修改form数据
    editFormData: noop,
    // form数据
    formData: 'formData',
    // 关闭弹框
    closeModal: noop,
    // 附件信息
    images: 'images'
  };

  render() {
    const { modalVisible, formData } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={formData.get('brandId') ? '编辑排序' : '增加'}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
          cateId={this.props.cateId}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { doAdd } = this.props.relaxProps;
        // if (formData.get('brandName')) {
        doAdd();
        // }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}

class BrandModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    cateId: string;
    relaxProps?: {
      modalVisible: boolean;
      images: any;
      closeModal: Function;
      formData: IMap;
      editFormData: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { logo, serialNo } = this.props.relaxProps.formData.toJS();
    let images = this.props.relaxProps.images;
    if (logo) {
      images = fromJS([
        { uid: 1, name: logo, size: 1, status: 'done', url: logo }
      ]);
    }
    images = images.toJS();
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        {/* <FormItem {...formItemLayout} label="品牌名称" hasFeedback>
          {getFieldDecorator('brandName', {
            rules: [
              { required: true, whitespace: true, message: '请输入品牌名称' },
              {
                max: 30,
                message: '最多30字符'
              }
            ],
            onChange: this._changeBrandName,
            initialValue: brandName
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="品牌别名" hasFeedback>
          {getFieldDecorator('nickName', {
            rules: [
              { whitespace: true, message: '请输入品牌别名' },
              {
                max: 30,
                message: '最多30字符'
              }
            ],
            onChange: this._changeNickName,
            initialValue: nickName
          })(<Input />)}
        </FormItem> */}

        <FormItem {...formItemLayout} label="品牌排序" hasFeedback>
          {getFieldDecorator('serialNo', {
            initialValue: serialNo,
            rules: [
              {
                required: true,
                message: '品牌排序是必填项'
              },
              {
                validator: (_rule, value, callback) => {
                  if (99999 < value || (value < 1 && value != null)) {
                    callback('请输入1-99999');
                    return;
                  }
                  callback();
                }
              },
              { pattern: ValidConst.number, message: '请输入1-99999' }
            ]
          })(
            <InputNumber
              min={0}
              precision={0}
              onChange={(value) => this._changeBrandSeqNum(value)}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>

        {/* <FormItem {...formItemLayout} label="品牌logo">
          <div className="clearfix goodsBrandLogo">
            <QMUpload
              style={styles.box}
              name="uploadFile"
              fileList={images}
              action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
              listType="picture-card"
              accept={'.jpg,.jpeg,.png,.gif'}
              onChange={this._editImages}
              beforeUpload={this._checkUploadFile}
            >
              {images.length < 1 ? (
                <Icon type="plus" style={styles.plus} />
              ) : null}
            </QMUpload>
          </div>
          <div>
            <Tips title="尺寸120px*50px,支持格式jpg、jpeg、png、gif，文件大小50kb以内" />
          </div>
        </FormItem> */}
      </Form>
    );
  }

  /**
   * 修改品牌名称
   */
  _changeBrandName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ brandName: e.target.value }));
  };

  /**
   * 修改品牌昵称
   */
  _changeNickName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ nickName: e.target.value }));
  };

  /**
   * 修改品牌排序
   */
  _changeBrandSeqNum = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ serialNo: e }));
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    console.log('f', file);
    console.log('f', fileList);
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    const store = this._store as any;
    //删除图片
    if (file.status == 'removed') {
      store.editFormData(Map({ logo: '' }));
      store.editImages(fromJS([]));
      return;
    }

    console.log('f', file);
    console.log('f', fileList);
    fileList = fileList.filter((item) => item != null);
    if (fileList[0].status == 'done') {
      store.editFormData(Map({ logo: fileList[0].response[0] }));
    }
    store.editImages(fromJS(fileList));
  };

  /**
   * 检查文件格式以及文件大小
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过50KB');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
}

/*
const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
*/
