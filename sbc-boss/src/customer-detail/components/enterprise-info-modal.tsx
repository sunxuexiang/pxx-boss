import React from 'react';
import { Relax, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { Button, Icon, Input, message, Modal, Form, Select } from 'antd';
import { Const, noop, QMUpload, Tips, ValidConst } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FILE_MAX_SIZE = 5 * 1024 * 1024;

const registTypes = [
  { id: 1, name: '商户' },
  { id: 2, name: '单位' }
];

const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 18,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class EnterpriseInfoModal extends React.Component<any, any> {
  _enterpriseSetForm: any;

  props: {
    relaxProps?: {
      enterpriseModalVisible: boolean;
      enterpriseModalShow: Function;
      customerFormEdit: IMap;
      onFormChangeEdit: Function;
      modifyEnterpriseInfo: Function;
      cancelEditEnterprise: Function;
    };
  };

  static relaxProps = {
    enterpriseModalVisible: 'enterpriseModalVisible',
    customerFormEdit: 'customerFormEdit',
    onFormChangeEdit: noop,
    modifyEnterpriseInfo: noop,
    enterpriseModalShow: noop,
    cancelEditEnterprise: noop
  };

  constructor(props) {
    super(props);
    this._enterpriseSetForm = Form.create()(EnterpriseSetForm);
  }

  render() {
    let EnterpriseSetForm = this._enterpriseSetForm;
    const {
      enterpriseModalVisible,
      enterpriseModalShow
    } = this.props.relaxProps;

    return (
      enterpriseModalVisible && (
        <Modal
          maskClosable={false}
          title={'会员资质编辑'}
          width={600}
          visible={enterpriseModalVisible}
          onCancel={() => enterpriseModalShow(false)}
          footer={[<span></span>]}
        >
          <EnterpriseSetForm
            ref={'_enterpriseSetForm'}
            {...{ relaxProps: this.props.relaxProps }}
          />
        </Modal>
      )
    );
  }
}

class EnterpriseSetForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      flushFlag: false
    };
  }

  render() {
    const {
      form: { getFieldDecorator },
      relaxProps: { customerFormEdit, onFormChangeEdit, cancelEditEnterprise }
    } = this.props;
    let businessLicenseImg = [];
    if (
      businessLicenseImg.length == 0 &&
      customerFormEdit.get('businessImages')
    ) {
      businessLicenseImg = customerFormEdit.get('businessImages').toJS();
    } else if (
      businessLicenseImg.length == 0 &&
      customerFormEdit.get('businessLicenseUrl')
    ) {
      businessLicenseImg.push({
        uid: 0,
        status: 'done',
        url: customerFormEdit.get('businessLicenseUrl')
      });
    }
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="客户名称："
          hasFeedback={false}
          required={true}
        >
          {getFieldDecorator('customerName', {
            initialValue: customerFormEdit.get('customerName')
          })(
            <Input
              disabled={true}
              onChange={(e) =>
                onFormChangeEdit({
                  field: 'customerName',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="账号："
          hasFeedback={false}
          required={true}
        >
          {getFieldDecorator('customerAccount', {
            initialValue: customerFormEdit
              .get('customerAccount')
              .replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          })(
            <Input
              disabled={true}
              onChange={(e) =>
                onFormChangeEdit({
                  field: 'customerAccount',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="会员类型"
          hasFeedback={true}
          required={true}
        >
          {getFieldDecorator('customerRegisterType', {
            initialValue: customerFormEdit.get('customerRegisterType')
              ? customerFormEdit.get('customerRegisterType')
              : '家用'
          })(
            <Select
              placeholder="请选择会员标签"
              onChange={(value) =>
                onFormChangeEdit({
                  field: 'customerRegisterType',
                  value: value
                })
              }
            >
              {registTypes.map((tag) => {
                return (
                  <Select.Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="企业名称："
          hasFeedback={true}
          required={true}
        >
          {getFieldDecorator('enterpriseName', {
            initialValue: customerFormEdit.get('enterpriseName'),
            rules: [
              { required: true, whitespace: true, message: '请输入企业名称' },
              {
                pattern: ValidConst.xyyCompanyName,
                message: '请输入正确的企业名称'
              }
            ]
          })(
            <Input
              onChange={(e) =>
                onFormChangeEdit({
                  field: 'enterpriseName',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="企业统一社会信用代码："
          hasFeedback={true}
          required={true}
        >
          {getFieldDecorator('socialCreditCode', {
            initialValue: customerFormEdit.get('socialCreditCode'),
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入社会信用代码'
              },
              {
                pattern: ValidConst.socialCreditCodeNew,
                message: '请输入正确的社会信用代码且必须8-30字符'
              }
            ]
          })(
            <Input
              onChange={(e) =>
                onFormChangeEdit({
                  field: 'socialCreditCode',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="营业执照：" required={true}>
          {getFieldDecorator('businessLicenseUrl', {
            initialValue: businessLicenseImg,
            rules: [
              {
                validator: (_rule, _value, callback) => {
                  if (!businessLicenseImg || businessLicenseImg.length < 1) {
                    callback('请上传营业执照复印件');
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <div>
              <QMUpload
                name="uploadFile"
                style={styles.box}
                onChange={({ file, fileList }) =>
                  this._editImages(file, fileList, 'businessImages')
                }
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                accept={'.jpg,.png,.gif,.jpeg'}
                fileList={businessLicenseImg}
                listType={'picture-card'}
                beforeUpload={this._checkUploadFile}
              >
                {!businessLicenseImg || businessLicenseImg.length < 1 ? (
                  <Icon type="plus" style={styles.plus} />
                ) : null}
              </QMUpload>
              <Tips title="仅支持jpg、jpeg、png、gif文件，最多上传1张，大小不超过5M" />
            </div>
          )}
        </Form.Item>
        <div style={{ paddingBottom: 20 }}>
          <Button
            type="primary"
            style={{ float: 'right', marginRight: 20 }}
            onClick={() => this._modifyEnterpriseInfo()}
          >
            保存
          </Button>
          <Button
            onClick={() => cancelEditEnterprise()}
            style={{ float: 'right', marginRight: 20 }}
          >
            取消
          </Button>
        </div>
      </Form>
    );
  }

  _modifyEnterpriseInfo = () => {
    const { modifyEnterpriseInfo } = this.props.relaxProps;
    const enterpriseSetForm = this.props.form as WrappedFormUtils;
    enterpriseSetForm.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        modifyEnterpriseInfo();
      }
    });
  };

  /**
   * 改变图片
   */
  _editImages = (file, fileList, field) => {
    const { onFormChangeEdit } = this.props.relaxProps;
    if (file.status == 'error') {
      message.error('上传失败');
    }

    if (file.status == 'done') {
      this.props.form.setFields({ businessLicenseUrl: { errors: null } });
      onFormChangeEdit({
        field: 'businessLicenseUrl',
        value:
          fileList.length > 0 && fileList[0].response
            ? fileList[0].response[0]
            : null
      });
    }

    if (file.status == 'removed') {
      onFormChangeEdit({
        field: 'businessLicenseUrl',
        value: null
      });
    }
    onFormChangeEdit({
      field: field,
      value: fileList.length > 0 ? fromJS(fileList) : null
    });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.jpeg')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不得超过5M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
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
  },
  alertBox: {
    marginLeft: 10
  },
  height: {
    height: 353,
    overflow: scroll
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
