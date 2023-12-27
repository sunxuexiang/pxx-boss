import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message, Upload, Icon } from 'antd';
import { AuthWrapper, Const, noop, QMUpload } from 'qmkit';
import { List } from 'immutable';
type TList = List<any>;
const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    dataList;
    type;
    relaxProps?: {
      setBusinessBanner: Function;
      selected: List<number>;
      onAdd: Function;
      dataList1: TList;
    };
  };

  static relaxProps = {
    dataList1: 'dataList',
    setBusinessBanner: noop,
    selected: 'selected',
    onAdd: noop
  };

  render() {
    const {} = this.props.relaxProps;
    const { dataList, type } = this.props;
    const uploadButton = (
      <div>
        <Icon type={false ? 'loading' : 'plus'} />
        <div>{false ? '请稍后' : '选择文件'}</div>
      </div>
    );
    return (
      <QMUpload
        style={styles.box}
        action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
        listType="picture-card"
        name="uploadFile"
        onChange={this._editbusinessBanners}
        fileList={this.filterData(dataList[type])}
        accept={'.png,.gif'}
        beforeUpload={this._checkUploadFile.bind(this, 25)}
      >
        {dataList[type] && dataList[type].length > 0 ? null : uploadButton}
      </QMUpload>
    );
  }
  filterData(data) {
    if (!data || data.length === 0) {
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
    const { dataList, type } = this.props;
    const { setBusinessBanner } = this.props.relaxProps;
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      dataList[type] = '';
      setBusinessBanner(dataList);
      return;
    }
    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }
    fileList = this._buildFileList(fileList);
    dataList[type] = JSON.stringify(fileList);
    setBusinessBanner(dataList);
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
