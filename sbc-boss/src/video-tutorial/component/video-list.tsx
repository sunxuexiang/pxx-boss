import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { List, fromJS } from 'immutable';
import { Modal, Pagination, message } from 'antd';
import Input from 'antd/lib/input/Input';

declare type IList = List<any>;

const confirm = Modal.confirm;

@Relax
export default class VideoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      videoList: IList; //视频列表
      queryVideoPage: Function; //初始化
      doDelete: Function; //删除
      editVideo: Function; //编辑视频名称
      currentPage: number; //分页
      total: number; //分页
      pageSize: number; //分页
      allChecked: boolean;
      cateType: number;
    };
  };

  static relaxProps = {
    videoList: 'videoList',
    queryVideoPage: noop,
    doDelete: noop,
    editVideo: noop,
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    cateType: 'cateType'
  };

  render() {
    const { videoList, currentPage, total, pageSize, cateType } =
      this.props.relaxProps;
    return (
      <div>
        <div style={styles.greyHeader}>
          <span style={styles.videoItem}>视频名称</span>
          <span style={styles.videoItem}>视频链接</span>
          <span style={styles.videoItem}>操作</span>
        </div>
        <div>
          {(videoList || fromJS([])).map((item) => {
            return (
              <div style={styles.boxItem} key={item.get('resourceId')}>
                <span style={styles.videoItem}>
                  <Input
                    defaultValue={item.get('resourceName')}
                    onBlur={(e) => {
                      this._updateVideo(
                        e,
                        item.get('resourceName'),
                        item.get('resourceId')
                      );
                    }}
                  />
                </span>
                <a
                  onClick={this._videoDetail.bind(this, item.get('artworkUrl'))}
                  style={styles.videoItem}
                >
                  {item.get('artworkUrl')}
                </a>
                <AuthWrapper
                  functionName={
                    cateType === 1 ? 'f_videoTutorial_2' : 'f_videoUser_2'
                  }
                >
                  <a
                    onClick={this._delete.bind(this, item.get('resourceId'))}
                    style={styles.videoItem}
                  >
                    删除
                  </a>
                </AuthWrapper>
              </div>
            );
          })}
        </div>
        {(videoList || fromJS([])).size == 0 ? (
          <div className="ant-table-placeholder">
            <span>
              <i className="anticon anticon-frown-o" />
              暂无数据
            </span>
          </div>
        ) : (
          <div style={styles.page}>
            <Pagination
              onChange={(pageNum, pageSize) =>
                this._toCurrentPage(pageNum, pageSize)
              }
              current={currentPage}
              total={total}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>
    );
  }

  _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };

  /**
   * 删除视频
   */
  _delete = (videoId: string) => {
    const { doDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '您确认要删除选择的视频吗？',
      onOk() {
        doDelete(videoId);
      }
    });
  };

  /**
   * 修改视频名称
   * @param videoId
   * @private
   */
  _updateVideo = (e, oldVal, videoId: string) => {
    //修改了视频名称才真正的请求接口进行修改
    if (e.target.value != oldVal) {
      if (!e.target.value.trim()) {
        message.error('请输入文件名');
        return false;
      }

      if (
        /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
          e.target.value
        )
      ) {
        message.error('请输入正确格式的文件名');
        return false;
      }

      if (e.target.value.length > 40) {
        message.error('文件名过长');
        return false;
      }

      const { editVideo } = this.props.relaxProps;
      editVideo(videoId, e.target.value);
    }
  };

  /**
   * 分页
   * @param pageNum
   * @param pageSize
   * @private
   */
  _toCurrentPage = (pageNum: number, pageSize: number) => {
    const { queryVideoPage } = this.props.relaxProps;
    //如果选中分类，则分页要在该分类下进行
    queryVideoPage({ pageNum: pageNum - 1, pageSize: pageSize });
  };
}

const styles = {
  greyHeader: {
    backgroundColor: '#f7f7f7',
    height: '40px',
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any,
  boxItem: {
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    height: '80px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  videoItem: {
    display: 'inline-block',
    width: '30%',
    textAlign: 'center',
    wordBreak: 'break-all',
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  page: {
    float: 'right',
    marginTop: '20px',
    marginBottom: '20px'
  }
} as any;
