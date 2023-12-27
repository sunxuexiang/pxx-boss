import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';

import {
  getCateList,
  fetchVideos,
  deleteVideo,
  updateVideo,
  addMenu,
  delMenu
} from './webapi';
import CateActor from './actor/cate-actor';
import VideoActor from './actor/video-actor';
import { List } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
import _ from 'lodash';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new CateActor(), new VideoActor()];
  }

  findDefault = (list) => {
    let id = '';
    if (list[0].children) {
      id = this.findDefault(list[0].children);
    } else {
      id = list[0].cateId;
    }
    return id;
  };

  formatToTree = (cateParentId, list) => {
    const result = [];
    list.forEach((item) => {
      if (item.cateParentId === cateParentId) {
        const children = this.formatToTree(item.cateId, list);
        if (children.length > 0) {
          item.children = children;
        }
        result.push(item);
      }
    });
    return result;
  };

  /**
   * 初始化
   */
  init = async (
    type?,
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    //1.查询店铺分类列表
    let cateType = this.state().get('cateType');
    if (type) {
      cateType = type;
      this.dispatch('cateActor: update', { key: 'cateType', value: type });
    }
    const list: any = await getCateList({ cateType });
    if (list.res.code !== Const.SUCCESS_CODE) {
      message.error(list.res.message);
      return;
    }
    const cateList = this.formatToTree(
      '0',
      list.res?.context?.videoResourceCateVOList || []
    );
    //找默认分类
    let id = '';
    if (cateList && cateList[0]) {
      id = this.findDefault(cateList);
    }
    //2.查询视频分页信息
    this.dispatch('videoActor: videoLoading', true);
    const videoList: any = await fetchVideos({
      pageNum,
      pageSize,
      cateId: id,
      resourceType: 1
    });
    this.dispatch('videoActor: videoLoading', false);
    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.selectVideoCate(id);
        this.dispatch(
          'cateActor: cateAllList',
          fromJS(list.res?.context?.videoResourceCateVOList || [])
        );
        this.dispatch('cateActor: init', fromJS(cateList)); //初始化分类列表
        this.dispatch('videoActor: init', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch('videoActor: page', fromJS({ currentPage: pageNum + 1 }));
        this.dispatch(
          'cateActor: editExpandedKeys',
          this._getExpandedCateIdList(id)
        );
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  /**
   * 查询视频信息分页列表
   */
  queryVideoPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const id = this.state().get('id'); //之前选中的分类
    const cateList = this.state().get('cateList').toJS();
    //查询视频分页信息
    this.dispatch('videoActor: videoLoading', true);
    const videoList: any = await fetchVideos({
      pageNum,
      pageSize,
      resourceName: this.state().get('videoName'),
      cateIds: this.getAllCateId(id, cateList),
      resourceType: 1
    });
    this.dispatch('videoActor: videoLoading', false);
    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('videoActor: init', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch('videoActor: page', fromJS({ currentPage: pageNum + 1 }));
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  getAllCateId = (cateId, list) => {
    let result = [];
    list.forEach((item) => {
      if (item.cateId === cateId) {
        if (item.children) {
          item.children.forEach((cd) => {
            result = result.concat(this.getAllCateId(cd.cateId, item.children));
          });
        } else {
          result.push(item.cateId);
        }
      } else if (item.children) {
        result = result.concat(this.getAllCateId(cateId, item.children));
      }
    });
    return result;
  };

  /**
   * 根据需要展开的分类id,找寻自己的所有父级
   */
  _getExpandedCateIdList = (cateId, parentList?, parentIds?) => {
    let list = this.state().get('expandedKeys').toJS();
    let newList = [];
    const cateList = this.state().get('cateList').toJS();
    const currentList = parentList || cateList;
    if (cateId) {
      currentList.forEach((item) => {
        if (item.cateId === cateId) {
          newList = newList.concat(
            parentIds ? _.uniq(parentIds.concat(list)) : []
          );
          return;
        } else if (item.children) {
          newList = newList.concat(
            this._getExpandedCateIdList(
              cateId,
              item.children,
              (parentIds || []).concat([item.cateId])
            )
          );
        }
      });
    }
    if (parentList) {
      return newList;
    }
    return fromJS(list.concat(newList));
  };

  /**
   * 设置需要展开的分类
   */
  onExpandCate = (expandedKeys) => {
    this.dispatch('cateActor: editExpandedKeys', fromJS(expandedKeys)); //需要展开的分类
  };

  /**
   * 显示/关闭上传视频框
   */
  showUploadVideoModal = (type: boolean) => {
    this.dispatch('videoActor: showUploadVideoModal', type);
  };

  /**
   * 修改视频名称搜索项
   */
  search = async (videoName: string) => {
    this.dispatch('videoActor: search', videoName);
  };

  /**
   * 选中某个分类
   * @param id
   */
  selectVideoCate = (id) => {
    if (id) {
      this.dispatch('cateActor: editCateId', List.of(id.toString())); //选中的分类id List
      this.dispatch('videoActor: editCateId', id.toString()); //选中的分类id
    } else {
      this.dispatch('cateActor: editCateId', List()); //全部
      this.dispatch('videoActor: editCateId', ''); //选中的分类id
    }
  };

  /**
   * 上传视频选中某个分类
   * @param id
   */
  selectUploadVideoCate = (id) => {
    if (id) {
      this.dispatch('videoActor: editCateId', id.toString()); //选中的分类id
    }
  };

  /**
   * 上传视频-选择分类-点击确认后,自动展开对应的视频分类
   * @param id
   */
  autoExpandVideoCate = (id) => {
    if (id) {
      this.dispatch('cateActor: editCateId', List.of(id.toString())); //选中的分类id List
      this.dispatch(
        'cateActor: editExpandedKeys',
        this._getExpandedCateIdList(id)
      ); //需要展开的分类
    }
  };

  /**
   * 修改某个视频名称信息
   */
  editVideo = async (videoId: string, videoName: string) => {
    const video = { resourceName: videoName, resourceId: videoId };
    const result = (await updateVideo(video)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('修改名称成功');
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除视频
   */
  doDelete = async (videoId: string) => {
    const videoIds = this.state()
      .get('videoList')
      .filter((v) => {
        return v.get('resourceId') == videoId;
      })
      .map((v) => {
        return v.get('resourceId');
      })
      .toJS();

    const result = (await deleteVideo(videoIds)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.queryVideoPage();
      const id = this.state().get('id');
      if (id === '9999' || id === '8888') {
        this.queryAppVideoData(id);
      }
    } else {
      message.error(result.res.message);
    }
  };

  // 检查此目录是否可新增子分类
  addCheck = (cateId) => {
    let isLeaf = true;
    let cateNode;
    const cateAllList = this.state().get('cateAllList').toJS();
    cateAllList.forEach((item) => {
      if (item.cateParentId === cateId) {
        isLeaf = false;
      }
      if (item.cateId === cateId) {
        cateNode = item;
      }
    });
    if (cateNode.cateGrade > 1) {
      message.error('分类最多为二级');
      return false;
    }
    if (isLeaf && this.state().get('videoList').toJS().length > 0) {
      message.error('此分类下已上传视频，不可新增子分类');
      return false;
    }
    if (cateNode.isDefault === 1) {
      message.error(`${cateNode.cateName}下不可新增子分类`);
      return false;
    }
    return true;
  };

  // 打开新增分类弹窗
  showAddModal = (type) => {
    if (type === 1) {
      if (this.state().get('defaultCheckedKeys').toJS().length === 0) {
        message.error('请选择父分类');
        return;
      }
      if (!this.addCheck(this.state().get('defaultCheckedKeys').toJS()[0])) {
        return;
      }
    }

    this.dispatch('cateActor: update', { key: 'addType', value: type });
    this.dispatch('cateActor: update', { key: 'visible', value: true });
  };

  // 关闭新增分类弹窗
  closeAddModal = () => {
    this.dispatch('cateActor: update', { key: 'visible', value: false });
  };

  // 新增分类
  addVideoMenu = async (values) => {
    const addType = this.state().get('addType');
    const defaultCheckedKeys = this.state().get('defaultCheckedKeys').toJS();
    const cateAllList = this.state().get('cateAllList').toJS();
    const cateType = this.state().get('cateType');
    let param = { ...values, cateType };
    if (addType === 1) {
      const selectedKey = defaultCheckedKeys[0];
      let cateGrade;
      cateAllList.forEach((item) => {
        if (item.cateId === selectedKey) {
          cateGrade = item.catePath.split('|').length;
        }
      });
      if (cateGrade > 4) {
        message.error('分类最多4级');
        return;
      }
      param = {
        ...param,
        cateGrade,
        cateParentId: selectedKey
      };
    }
    const { res } = await addMenu(param);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeAddModal();
      this.init();
    } else {
      message.error(res.message || '');
    }
  };

  // 删除分类
  deleteMenu = async () => {
    const defaultCheckedKeys = this.state().get('defaultCheckedKeys').toJS();
    const cateAllList = this.state().get('cateAllList').toJS();
    if (defaultCheckedKeys.length === 0) {
      message.error('请选择要删除的分类');
      return;
    }
    const cateNode = cateAllList.filter(
      (item) => item.cateId === defaultCheckedKeys[0]
    )[0];
    if (cateNode.isDefault === 1) {
      message.error(`${cateNode.cateName}不可删除`);
      return;
    }
    const { res } = await delMenu(defaultCheckedKeys[0]);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message || '');
    }
  };

  // 查询后台视频教程数据
  queryAppVideoData = async (videoId) => {
    const videoList: any = await fetchVideos({
      pageNum: 0,
      pageSize: 10,
      cateId: videoId,
      resourceType: 1
    });
    if (videoList.res && videoList.res.code === Const.SUCCESS_CODE) {
      this.dispatch(
        videoId === '9999'
          ? 'videoActor: appVideoList'
          : 'videoActor: appSettelVideoList',
        fromJS(videoList.res.context?.content || [])
      );
    }
  };
}
