import React from 'react';
import PropTypes from 'prop-types';
// import { Store } from 'plume2';
import { Form, Input, Icon, message } from 'antd';
import { Const, Tips, QMUpload, noop } from 'qmkit';
import { fromJS } from 'immutable';
import Store from '../store';
const defaultMaxSize = 2 * 1024 * 1024;
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

export default class EditForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      iconImgFile: this._store.state().get('accountForm').get('iconUrl')
        ? [
            {
              uid: 0,
              status: 'done',
              url: this._store.state().get('accountForm').get('iconUrl')
            }
          ]
        : [],
      ficationBackImgFile: this._store
        .state()
        .get('accountForm')
        .get('imageUrl')
        ? [
            {
              uid: 0,
              status: 'done',
              url: this._store.state().get('accountForm').get('imageUrl')
            }
          ]
        : []
    };
  }
  // props: {
  //   form?:any,
  //   relaxProps?: {
  //     editActorBut: Function;
  //   };
  // };

  // static relaxProps = {
  //   editActorBut: noop
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const accountForm = _state.get('accountForm');
    // const {iconImgFile}=this._store.state().toJS();
    let accountName,
      bankName,
      bankNo,
      bankAccount = {};
    if (_state.get('edit')) {
      accountName = {
        initialValue: accountForm.get('accountName')
      };
      bankName = {
        initialValue: accountForm.get('bankName')
      };
      bankAccount = {
        initialValue: accountForm.get('bankAccount')
      };
      bankNo = {
        initialValue: accountForm.get('bankNo')
      };
      // iconUrl = {
      //   initialValue: accountForm.get('iconUrl')
      // };
      // imageUrl = {
      //   initialValue: accountForm.get('imageUrl')
      // };
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="账户名称">
          {getFieldDecorator('accountName', {
            ...accountName,
            rules: [
              { required: true, message: '请输入账户名称' },
              { validator: this.checkAccountName }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="账号">
          {getFieldDecorator('bankAccount', {
            ...bankAccount,
            rules: [
              { required: true, message: '请输入账号' },
              { validator: this.checkBankAccount }
            ]
          })(<Input />)}
        </FormItem>  
        <FormItem {...formItemLayout} label="开户行名称">
          {getFieldDecorator('bankName', {
            ...bankName,
            rules: [
              { required: true, message: '请输入开户行名称' },
              { validator: this.checkBankName }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="开户行联行号">
          {getFieldDecorator('bankNo', {
            ...bankNo,
            rules: [
              { required: true, message: '请输入开户行联行号' },
              // { validator: this.checkBankAccount }
            ]
          })(<Input />)}
        </FormItem>  
        {/* <FormItem {...formItemLayout} label="选择银行图标">
          <QMUpload
            name={'uploadFile'}
            style={styles.box}
            onChange={(info) => this.onUploadIconImg(info)}
            action={
              Const.HOST + '/uploadResource?cateId=20220902&resourceType=IMAGE'
            }
            fileList={this.state.iconImgFile}
            listType={'picture-card'}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={this._checkUploadFile}
          >
            {this.state.iconImgFile?.length < 1 ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且需小于2M，最多上传1张且图片要求80px*80px" />
          {getFieldDecorator('iconUrl', {
            ...iconUrl,
            rules: [{ required: true, message: '请上传银行图标' }]
          })(<Input type="hidden" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="选择背景图片">
          <QMUpload
            name={'uploadFile'}
            style={styles.box}
            onChange={(info) => this.onUploadTaxpayer(info)}
            action={
              Const.HOST + '/uploadResource?cateId=20220902&resourceType=IMAGE'
            }
            fileList={this.state.ficationBackImgFile}
            listType={'picture-card'}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={this._checkUploadFile}
          >
            {this.state.ficationBackImgFile?.length < 1 ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且需小于2M，最多上传1张且图片要求766px*296px" />
          {getFieldDecorator('imageUrl', {
            ...imageUrl,
            rules: [{ required: true, message: '请上传背景图片' }]
          })(<Input type="hidden" />)}
        </FormItem> */}
      </Form>
    );
  }

  // /**
  //  * 检查文件格式
  //  */
  // _checkUploadFile = (file) => {
  //   let fileName = file.name.toLowerCase();
  //   // 支持的图片格式：jpg、jpeg、png、gif
  //   if (
  //     fileName.endsWith('.jpg') ||
  //     fileName.endsWith('.jpeg') ||
  //     fileName.endsWith('.png') ||
  //     fileName.endsWith('.gif')
  //   ) {
  //     if (file.size <= defaultMaxSize) {
  //       return true;
  //     } else {
  //       message.error('文件大小不能超过2M');
  //       return false;
  //     }
  //   } else {
  //     message.error('文件格式错误');
  //     return false;
  //   }
  // };

  // onUploadIconImg({ file, fileList }) {
  //   console.log(fileList);
  //   let list = fileList.length ? fileList.slice(-1) : [];
  //   //当上传完成的时候设置
  //   if (file.status == 'error') {
  //     message.error('上传失败');
  //     this.setState({ iconImgFile: [] });
  //     this.props.form.setFieldsValue({ iconUrl: '' });
  //     return;
  //   }
  //   if (file.status == 'removed') {
  //     this.setState({ iconImgFile: [] });
  //     this.props.form.setFieldsValue({ iconUrl: '' });
  //   }
  //   if (file.status == 'done') {
  //     this.setState({ iconImgFile: list });
  //     this.props.form.setFieldsValue({
  //       iconUrl: list[0].response[0]
  //     });
  //   }
  //   if ((file.status = 'uploading')) {
  //     this.setState({ iconImgFile: list });
  //   }
  // }

  // onUploadTaxpayer({ file, fileList }) {
  //   //当上传完成的时候设置
  //   let list = fileList.length ? fileList.slice(-1) : [];
  //   //当上传完成的时候设置
  //   if (file.status == 'error') {
  //     message.error('上传失败');
  //     this.setState({ ficationBackImgFile: [] });
  //     this.props.form.setFieldsValue({ imageUrl: '' });
  //     return;
  //   }
  //   if (file.status == 'removed') {
  //     this.setState({ ficationBackImgFile: [] });
  //     this.props.form.setFieldsValue({ imageUrl: '' });
  //   }
  //   if (file.status == 'done') {
  //     this.setState({ ficationBackImgFile: list });
  //     this.props.form.setFieldsValue({
  //       imageUrl: list[0].response[0]
  //     });
  //   }
  //   if ((file.status = 'uploading')) {
  //     this.setState({ ficationBackImgFile: list });
  //   }
  // }

  checkAccountName = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (!value.trim()) {
      callback('请输入账户名称');
      return;
    }

    if (value.length > 30) {
      callback(new Error('账户名称不超过30个字符'));
      return;
    }

    callback();
  };

  checkBankName = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (!value.trim()) {
      callback('请输入开户银行');
      return;
    }
    if (value.length > 30) {
      callback(new Error('开户银行不超过30个字符'));
      return;
    }
    callback();
  };

  checkBankAccount = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    const bankNoReg = /^\d{1,30}$/;
    if (!bankNoReg.test(value)) {
      callback(new Error('账号仅限1-30位数字'));
      return;
    }

    callback();
  };
}

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
