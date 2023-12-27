import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, message } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { List } from 'immutable';
declare type IList = List<any>;

const FormItem = Form.Item;

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      videoList: IList; //视频列表
      showUploadVideoModal: Function; //上传视频弹窗
      queryVideoPage: Function; //搜索视频分页信息
      search: Function; //模糊搜索
      currentPage: number; //分页
      videoName: string; //搜索的视频名
      cateType: number;
    };
  };

  static relaxProps = {
    videoList: 'videoList',
    queryVideoPage: noop,
    showUploadVideoModal: noop,
    search: noop,
    videoName: 'videoName',
    cateType: 'cateType'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { cateType } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper
          functionName={cateType === 1 ? 'f_videoTutorial_1' : 'f_videoUser_1'}
        >
          <Button type="primary" onClick={this._upload}>
            上传视频
          </Button>
        </AuthWrapper>
        <Button type="primary" style={{ visibility: 'hidden' }}>
          占位
        </Button>
        <div style={{ float: 'right' }}>
          <Form layout="inline">
            <FormItem>
              <Input
                placeholder="输入视频名称"
                value={this.props.relaxProps.videoName}
                onChange={this._editSearchData}
              />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this._search} htmlType="submit">
                {' '}
                搜索{' '}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 修改搜索数据
   */
  _editSearchData = (e) => {
    const { search } = this.props.relaxProps;
    search(e.target.value);
  };

  /**
   * 查询
   */
  _search = () => {
    const { queryVideoPage } = this.props.relaxProps;
    queryVideoPage();
  };

  /**
   * 上传视频
   * @private
   */
  _upload = () => {
    const { showUploadVideoModal } = this.props.relaxProps;
    showUploadVideoModal(true);
  };
}
