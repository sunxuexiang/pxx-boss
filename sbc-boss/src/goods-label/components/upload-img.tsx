import React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { Button, Modal, message, Upload, Icon } from 'antd';
import { AuthWrapper, Const, noop, QMUpload, Tips } from 'qmkit';
import { List } from 'immutable';
type TList = List<any>;
const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
      selected: List<number>;
      onAdd: Function;
    };
  };

  static relaxProps = {
    formData: 'formData',
    editFormData: noop,
    selected: 'selected',
    onAdd: noop
  };

  render() {
    const { formData } = this.props.relaxProps;
    const uploadButton = (
      <div>
        <Icon type={false ? 'loading' : 'plus'} />
        <div>{false ? '请稍后' : '选择文件'}</div>
      </div>
    );
    return (
      <>
        <QMUpload
          style={styles.box}
          action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
          listType="picture-card"
          name="uploadFile"
          onChange={this._editbusinessBanners}
          fileList={this.filterData(formData.toJS().image)}
          accept={'.png,.gif'}
          beforeUpload={this._checkUploadFile.bind(this, 15)}
        >
          {formData.toJS().image.length > 0 ? null : uploadButton}
        </QMUpload>
        <Tips title="图片支持png、gif格式，大小不超过15kb" />
      </>
    );
  }
  filterData(data) {
    console.log(data);
    if (data.length === 0) {
      return [];
    }
    return JSON.parse(data);
  }
  /**
   * businessBanner
   * @param file
   * @param fileList
   * @private
   */
  _editbusinessBanners = ({ file, fileList }) => {
    const { editFormData } = this.props.relaxProps;
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      editFormData({ key: 'image', value: '' });
      return;
    }
    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }
    fileList = this._buildFileList(fileList);
    editFormData({ key: 'image', value: JSON.stringify(fileList) });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= size * 1 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size * 1 + 'kb');
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
  } as any
};
