import { Actor, Action, IMap } from 'plume2';
export default class VideoActor extends Actor {
  defaultState() {
    return {
      //视频列表
      videoList: [],
      //商家操作视频数据(APP用)
      appVideoList: [],
      //商家入驻视频数据(APP用)
      appSettelVideoList: [],
      //分类id
      id: '',
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      //上传视频弹框显示标志
      uploadVisible: false,
      //上传的视频列表
      videos: [],
      //搜索的视频名称
      videoName: '',
      // 查询视频列表loading
      videoLoading: false
    };
  }

  /**
   * 初始化视频列表信息
   */
  @Action('videoActor: init')
  init(state, videoList) {
    return state
      .set('videoList', videoList.get('content'))
      .set('total', videoList.get('totalElements'));
  }

  /**
   * 更新商家操作视频数据
   */
  @Action('videoActor: appVideoList')
  appVideoList(state, appVideoList) {
    return state.set('appVideoList', appVideoList);
  }

  /**
   * 更新商家入驻视频数据
   */
  @Action('videoActor: appSettelVideoList')
  appSettelVideoList(state, appSettelVideoList) {
    return state.set('appSettelVideoList', appSettelVideoList);
  }

  /**
   * 更新当前页码
   */
  @Action('videoActor: page')
  page(state, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }

  /**
   * 设置视频名称搜索项
   */
  @Action('videoActor: search')
  changeField(state, value) {
    return state.set('videoName', value);
  }

  /**
   * 显示/关闭-上传视频弹窗
   */
  @Action('videoActor: showUploadVideoModal')
  showUpload(state, needClear: boolean) {
    return state.set('uploadVisible', needClear);
  }

  /**
   * 设置当前选中分类
   */
  @Action('videoActor: editCateId')
  editCateId(state, cateId) {
    return state.set('id', cateId);
  }

  /**
   * 设置查询视频列表loading
   */
  @Action('videoActor: videoLoading')
  videoLoading(state, videoLoading) {
    return state.set('videoLoading', videoLoading);
  }
}
