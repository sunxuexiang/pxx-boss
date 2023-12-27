import * as React from 'react';
import { Modal, Form, TreeSelect, Tree, Upload, Icon, message } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import { List } from 'immutable';
import { getOssToken, saveResources } from '../webapi';
import Button from 'antd/lib/button/button';
import moment from 'moment';
declare type IList = List<any>;

const TreeNode = Tree.TreeNode;
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
const FILE_MAX_SIZE = 300 * 1024 * 1024;

@Relax
export default class uploadVideoModal extends React.Component<any, any> {
  state = {
    id: '',
    fileList: [],
    cateDisabled: false,
    uploadHost: '',
    uploadData: {} as any
  };

  props: {
    relaxProps?: {
      uploadVisible: boolean; // 弹框是否显示
      cateList: IList; //分类列表
      appVideoList: IList; //商家操作视频数据(APP用)
      appSettelVideoList: IList; //商家入驻视频数据(APP用)
      showUploadVideoModal: Function; //上传视频弹窗
      autoExpandVideoCate: Function; //上传成功后,自动展开上传的分类
      queryVideoPage: Function; //查询视频分页列表
      search: Function; //修改视频名称搜索
      selectUploadVideoCate: Function;
      queryAppVideoData: Function;
    };
  };

  static relaxProps = {
    uploadVisible: 'uploadVisible',
    showUploadVideoModal: noop,
    cateList: 'cateList',
    appVideoList: 'appVideoList',
    appSettelVideoList: 'appSettelVideoList',
    autoExpandVideoCate: noop,
    queryVideoPage: noop,
    search: noop,
    selectUploadVideoCate: noop,
    queryAppVideoData: noop
  };

  render() {
    const { uploadHost, uploadData } = this.state;
    const {
      uploadVisible,
      cateList,
      appVideoList,
      queryAppVideoData,
      appSettelVideoList
    } = this.props.relaxProps;
    if (!uploadVisible) {
      return null;
    }
    const setFileList = this._setFileList;
    const setCateDisabled = this._setCateDisabled;
    const cateIdCurr = this.state.id;
    //处理分类的树形图结构数据
    const loop = (cateList, parentTitle?) =>
      cateList.map((item) => {
        if (item['children'] && item['children'].length) {
          return (
            <TreeNode
              key={item['cateId']}
              value={item['cateId'].toString()}
              title={item['cateName']}
              selectable={false}
            >
              {loop(item['children'], item.title)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item['cateId']}
            value={item['cateId'].toString()}
            title={item['cateName']}
            parentTitle={parentTitle}
          />
        );
      });

    const props = {
      name: 'file',
      multiple: false,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: false },
      action: uploadHost,
      data: uploadData,
      accept: '.mp4',
      beforeUpload: (file) => {
        if (!cateIdCurr) {
          message.error('请先选择分类!');
          return false;
        }
        if (
          cateIdCurr === '9999' &&
          appVideoList &&
          appVideoList.toJS().length > 0
        ) {
          message.error('商家操作视频只能上传一个视频');
          return false;
        }
        if (
          cateIdCurr === '8888' &&
          appSettelVideoList &&
          appSettelVideoList.toJS().length > 0
        ) {
          message.error('商家入驻视频只能上传一个视频');
          return false;
        }
        let fileName = file.name.toLowerCase();

        if (!fileName.trim()) {
          message.error('请输入文件名');
          return false;
        }

        if (
          /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
            fileName
          )
        ) {
          message.error('请输入正确格式的文件名');
          return false;
        }

        if (fileName.length > 40) {
          message.error('文件名过长');
          return false;
        }

        //支持的视频格式,视频最大限制
        if (fileName.endsWith('.mp4')) {
          if (file.size <= FILE_MAX_SIZE) {
            console.warn(moment().format('YYYYMMDDHHmmssSSSS'), 'moment');
            return new Promise<void>((resolve, reject) => {
              getOssToken()
                .then(({ res }) => {
                  if (res && res.code === Const.SUCCESS_CODE && res.context) {
                    const data = res.context;
                    this.setState(
                      {
                        uploadHost: data.host,
                        uploadData: {
                          key: `${moment().format('YYYYMMDDHHmmssSSSS')}.mp4`,
                          OSSAccessKeyId: data.accessid,
                          policy: data.policy,
                          signature: data.signature,
                          success_action_status: '200'
                        }
                      },
                      () => {
                        resolve(file);
                      }
                    );
                  } else {
                    message.error(res.message || '');
                    reject();
                  }
                })
                .catch(() => {
                  message.error('上传失败');
                  reject();
                });
            });
          } else {
            message.error('文件大小不能超过300M');
            return false;
          }
        } else {
          message.error('文件格式错误');
          return false;
        }
      },
      onChange: async (info) => {
        const status = info.file.status;
        let fileList = info.fileList;
        if (status === 'done') {
          if (info.file && info.file.xhr && info.file.xhr.status === 200) {
            const { res } = await saveResources({
              resourceType: 1,
              cateId: cateIdCurr,
              resourceKey: uploadData.key,
              resourceName: info.file.name,
              artworkUrl: uploadData.key
            });
            if (res && res.code === Const.SUCCESS_CODE) {
              message.success(`${info.file.name} 上传成功！`);
              if (cateIdCurr === '9999' || cateIdCurr === '8888') {
                queryAppVideoData(cateIdCurr);
              }
              setCateDisabled();
            } else {
              message.error(`${info.file.name} 上传失败！`);
            }
          } else {
            message.error(`${info.file.name} 上传失败！`);
          }
          // if (
          //   info.file.response &&
          //   info.file.response.code &&
          //   info.file.response.code !== Const.SUCCESS_CODE
          // ) {
          //   message.error(`${info.file.name} 上传失败！`);
          // } else {
          //   message.success(`${info.file.name} 上传成功！`);
          //   if (cateIdCurr === '9999' || cateIdCurr === '8888') {
          //     queryAppVideoData(cateIdCurr);
          //   }
          //   setCateDisabled();
          // }
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
        }
        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter(
          (f) =>
            f.status == 'uploading' ||
            (f.status == 'done' &&
              info.file.xhr &&
              info.file.xhr.status === 200)
        );
        setFileList(fileList);
      }
    };

    return (
      <Modal
        maskClosable={false}
        title="上传视频"
        visible={uploadVisible}
        cancelText="关闭"
        onCancel={this._handleCancel}
        onOk={this._handleOk}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="选择分类"
            required={true}
            hasFeedback
          >
            <TreeSelect
              showSearch
              disabled={this.state.cateDisabled}
              filterTreeNode={(input, treeNode) => {
                return (
                  treeNode.props.title
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0 ||
                  (treeNode.props.parentTitle &&
                    treeNode.props.parentTitle
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0)
                );
              }}
              style={{ width: 300 }}
              value={this.state.id}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择分类"
              notFoundContent="暂无分类"
              allowClear
              treeDefaultExpandAll
              onChange={this._onChange}
            >
              {loop(cateList ? cateList.toJS() : [])}
            </TreeSelect>
          </FormItem>
          <FormItem {...formItemLayout} label="选择视频" required={true}>
            <div>
              <Upload {...props} fileList={this.state.fileList}>
                <Button>
                  <Icon type="upload" /> 点击上传视频
                </Button>
              </Upload>
            </div>
            <p style={{ lineHeight: '2em', marginTop: '15px', color: '#999' }}>
              视频教程大小最大限制300M，支持文件类型MP4,推荐视频比例7:9
            </p>
          </FormItem>
        </Form>
      </Modal>
    );
  }

  /**
   * 上传成功后,分类不可编辑
   * @private
   */
  _setCateDisabled = () => {
    this.setState({ cateDisabled: true });
  };

  /**
   * 选择视频
   * @param info 上传的视频信息
   * @private
   */
  _setFileList = (fileList) => {
    this.setState({ fileList });
  };

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _onChange = (value) => {
    const { selectUploadVideoCate } = this.props.relaxProps;
    this.setState({ id: value });
    selectUploadVideoCate(value);
  };

  /**
   * 关闭弹窗
   * @private
   */
  _handleCancel = () => {
    if (
      this.state.id == '' ||
      this.state.fileList.filter((file) => file.status === 'done').length <= 0
    ) {
      const { showUploadVideoModal } = this.props.relaxProps;
      showUploadVideoModal(false);
      this.setState({ id: '', fileList: [], cateDisabled: false });
    } else {
      this._okFunc();
    }
  };

  /**
   * 提交
   * @param e
   * @private
   */
  _handleOk = () => {
    if (this.state.id == '') {
      message.error('请选择分类!');
      return;
    }
    if (
      this.state.fileList.filter((file) => file.status === 'done').length <= 0
    ) {
      message.error('请选择上传视频!');
      return;
    }

    this._okFunc();
  };

  /**
   * 确定并刷新对应分类的列表
   * @private
   */
  _okFunc = () => {
    //提交
    const {
      search,
      autoExpandVideoCate,
      showUploadVideoModal,
      queryVideoPage
    } = this.props.relaxProps;
    //清空搜索内容
    search('');
    //展开上传的分类
    autoExpandVideoCate(this.state.id);
    showUploadVideoModal(false);
    //刷新列表信息
    queryVideoPage();
    this.setState({ id: '', fileList: [], cateDisabled: false });
  };
}
