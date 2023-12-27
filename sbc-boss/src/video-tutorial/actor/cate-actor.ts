import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      // 1-商家操作视频 2-用户使用视频
      cateType: 1,
      // 扁平的分类列表信息
      cateAllList: [],
      // 父子结构的分类列表信息
      cateList: [],
      // tree是否展开
      expandedKeys: [],
      // 默认选中
      defaultCheckedKeys: [],
      // 新增分类弹窗显示
      visible: false,
      //  新增分类类型 0 新增一级分类 1 新增子分类
      addType: 0
    };
  }

  /**
   * 初始化
   */
  @Action('cateActor: init')
  init(state, cateList: IList) {
    // // 改变数据形态，变为层级结构
    // const newDataList = cateList
    //   .filter((item) => item.get('cateParentId') == 0)
    //   .map((data) => {
    //     const children = cateList
    //       .filter((item) => item.get('cateParentId') == data.get('cateId'))
    //       .map((childrenData) => {
    //         const lastChildren = cateList.filter(
    //           (item) => item.get('cateParentId') == childrenData.get('cateId')
    //         );
    //         if (!lastChildren.isEmpty()) {
    //           childrenData = childrenData.set('children', lastChildren);
    //         }
    //         return childrenData;
    //       });

    //     if (!children.isEmpty()) {
    //       data = data.set('children', children);
    //     }
    //     return data;
    //   });
    return state.set('cateList', cateList);
  }

  /**
   * 设置扁平的分类列表信息
   * @param state
   * @param cateId
   */
  @Action('cateActor: cateAllList')
  cateAllList(state, cateAllList) {
    return state.set('cateAllList', cateAllList);
  }

  /**
   * 设置选中分类
   * @param state
   * @param cateId
   */
  @Action('cateActor: editCateId')
  editCateId(state, cateId) {
    return state.set('defaultCheckedKeys', cateId);
  }

  /**
   * 设置需要展开的分类
   */
  @Action('cateActor: editExpandedKeys')
  editExpandedKeys(state, cateIds) {
    return state.set('expandedKeys', cateIds);
  }

  @Action('cateActor: update')
  update(state, { key, value }) {
    return state.set(key, value);
  }
}
