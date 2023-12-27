import React from 'react';
import { Form, Icon, Input, message, Select } from 'antd';
import { Const, noop, QMUpload, Tips, ValidConst } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import PropTypes from 'prop-types';

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

const { Option } = Select;
export default class EditForm extends React.Component<any, any> {
  _store;
  props: {
    form: any;
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
      cateList: IList;
      modalVisible: Function;
    };
  };

  static relaxProps = {
    checkedIds: 'checkedIds',
    exportModalData: 'exportModalData',
    onAdd: noop,
    onBatchDelete: noop,
    onExportModalHide: noop,
    onExportModalShow: noop,
    cateList: 'cateList'
  };

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { formData, cateList } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    const settingForm = this._store && this._store.get('formData');

    const bannerImg = settingForm && settingForm.get('bannerImg');

    const pcLogoImage = bannerImg ? JSON.parse(bannerImg) : [];
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('bannerName', {
            rules: [
              { required: true, whitespace: true, message: '请输入名称' },
              { max: 40, message: '1-40字符' }
            ],
            onChange: (e) => this._changeFormData('bannerName', e.target.value),
            initialValue: formData.get('bannerName')
          })(<Input placeholder="请输入轮播名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="一级分类名称">
          {getFieldDecorator('oneCateId', {
            rules: [
              { required: true, whitespace: true, message: '请选择分类名称' }
            ],
            initialValue: formData.get('oneCateName')
          })(
            <Select
              onSelect={(val) => {
                let strings = JSON.stringify(val).split(',');
                let oneCateId = strings[0].replace('"', '');
                let oneCateName = strings[1].replace('"', '');
                this._changeFormData('oneCateId', oneCateId);
                this._changeFormData('oneCateName', oneCateName);
              }}
              getPopupContainer={() => document.getElementById('page-content')}
              placeholder="请选择一级类目"
              showSearch
              optionFilterProp="children"
            >
              {cateList &&
                cateList.map((v, i) => {
                  return (
                    <Option key={i} value={v.cateId + ',' + v.cateName}>
                      {v.cateName}
                    </Option>
                  );
                })}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="排序号">
          {getFieldDecorator('bannerSort', {
            rules: [
              /*        { required: false, whitespace: true, message: '请输入排序号' },*/

              {
                required: false,
                pattern: ValidConst.numberScope,
                message: '请输入1-15间的数字'
              }
            ],
            onChange: (e) => this._changeFormData('bannerSort', e.target.value),
            initialValue:
              formData.get('bannerSort') || formData.get('bannerSort') == 0
                ? formData.get('bannerSort').toString()
                : null
          })(<Input placeholder="请输入排序号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="添加链接">
          {getFieldDecorator('link', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入添加链接'
              }
            ],
            onChange: (e) => this._changeFormData('link', e.target.value),
            initialValue: formData.get('link')
          })(<Input />)}
        </FormItem>

        <FormItem required={true} {...formItemLayout} label="上传Banner">
          <div>
            {getFieldDecorator('bannerImg', {
              initialValue: bannerImg,
              rules: [
                {
                  required: true,
                  message: '请上传Banner图片'
                }
              ]
            })(
              <QMUpload
                style={styles.box}
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                listType="picture-card"
                name="uploadFile"
                onChange={(fileEntity) =>
                  this._editPcLogo('bannerImg', fileEntity)
                }
                fileList={pcLogoImage}
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this._checkUploadFile.bind(this, 5)}
              >
                {pcLogoImage.length >= 1 ? null : (
                  <div>
                    <Icon type="plus" style={styles.plus} />
                  </div>
                )}
              </QMUpload>
            )}
          </div>
          <Tips title="图片格式仅限jpeg、jpg、png、gif，建议尺寸：750*323，大小不超过5M" />
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };

  /**
   * 编辑pcLogo
   * @param file
   * @param fileList
   * @private
   */
  _editPcLogo = (key, { file, fileList }) => {
    //当所有图片都被删除时
    const { editFormData } = this.props.relaxProps;
    if (JSON.stringify(fileList).length == 2) {
      let value = JSON.stringify(fileList);
      editFormData({ key, value });
      return;
    }
    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }
    fileList = this._buildFileList(fileList);
    let value = JSON.stringify(fileList);
    editFormData({ key, value });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList.map((file) => {
      return {
        uid: file.uid,
        status: file.status,
        url: file.response ? file.response[0] : file.url
      };
    });
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
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
