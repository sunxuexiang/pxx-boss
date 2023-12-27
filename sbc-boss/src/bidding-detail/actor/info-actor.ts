import { Actor, Action } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS } from 'immutable';
import { number } from 'prop-types';

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 设置勾选的id
      checkedIds: [],
      // 弹框是否展示
      visible: false,
      // 新增/编辑的表单信息
      formData: {},
      // 批量导出弹框 modal状态
      exportModalData: {},
      // 选择的商品ids
      chooseSkuIds: [],
      // 选择的具体商品信息
      goodsRows: [],
      // 分类列表
      cateList: [],
      //添加的标志
      addFlag: true,
      //排序弹框
      sortModalShow: false,
      //排序的商品
      sortInfo: {
        sortSkuId: String,
        sort: number,
        originPosition: number
      },
      //竞价类型 0：关键字，1：分类
      biddingType: 0
    };
  }

  /**
   * 设置loading状态
   */
  @Action('info:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('loading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('info:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('visible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('info:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('formData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('info:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['formData', key], value);
  }

  /**
   * 设置勾选的id
   */
  @Action('info:setCheckedData')
  setCheckedData(state: IMap, ids) {
    return state.set('checkedIds', ids);
  }

  @Action('modalActor: change:goods')
  changePointsGoods(state: IMap, { goodsInfoId, field, value }) {
    return state.update('goodsRows', (rows) =>
      rows.map((goodsInfo) => {
        if (goodsInfo.get('goodsInfoId') == goodsInfoId) {
          return goodsInfo.set(field, value);
        }
        return goodsInfo;
      })
    );
  }

  @Action('delete: selected: sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.get('goodsRows');
    let chooseSkuIds = state.get('chooseSkuIds');
    chooseSkuIds = chooseSkuIds.splice(
      chooseSkuIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(
      goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId)
    );
    return state
      .set('goodsRows', goodsRows)
      .set('chooseSkuIds', chooseSkuIds)
      .setIn(['formData', 'goodsInfoIds'], chooseSkuIds);
  }

  /**
   * 初始化分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initCateList')
  initCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList).set('sourceCateList', dataList);
  }

  /**
   * 设置添加的标志
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('info: setAddFlag')
  setAddFlag(state: IMap, res: boolean) {
    return state.set('addFlag', res);
  }

  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('goods: info: field: value')
  fieldsValue(state, { field, value }) {
    state = state.set(field, fromJS(value));
    return state;
  }

  /**
   * 设置排序弹框
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('info: setSortModalShow')
  setSortModalShow(state: IMap, res: boolean) {
    return state.set('sortModalShow', res);
  }

  /**
   * 设置排序商品的Id
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('info: setSortInfo')
  setSortInfo(state: IMap, { key, value }) {
    return state.setIn(['sortInfo', key], value);
  }

  /**
   * 设置竞价配值的方式
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('info: setBiddingType')
  setSortBiddingType(state: IMap, type) {
    return state.set('biddingType', type);
  }
}
