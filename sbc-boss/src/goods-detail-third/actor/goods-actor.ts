import { Actor, Action } from 'plume2';
import { IMap, IList } from 'typings/globalType';

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 平台类目信息
      cateList: [],
      sourceCateList: [],
      // 店铺分类信息
      storeCateList: [],
      sourceStoreCateList: [],
      // 品牌信息
      brandList: [],
      // 商品信息
      goods: {
        // 分类编号
        cateId: '',
        // 品牌编号
        brandId: '',
        // 商品名称
        goodsName: '',
        // SPU编码
        goodsNo: '',
        // 计量单位
        goodsUnit: '',
        // 上下架状态
        addedFlag: 1,
        // 商品详情
        goodsDetail: '',
        // 门店价
        mktPrice: '',
        // 成本价
        costPrice: ''
      },
      // 是否编辑商品
      isEditGoods: false,
      //保存状态loading
      saveLoading: false,
      detailEditor: {},
      // 当前处于基础信息tab还是价格tab：main | price
      activeTabKey: 'main',
      storeInfo: {},
      goodsPropDetails: [],
      goodsTabs: []
    };
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
   * 初始化店铺分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initStoreCateList')
  initStoreCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('storeCateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter(
              (item) =>
                item.get('cateParentId') == childrenData.get('storeCateId')
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
    return state
      .set('storeCateList', newDataList)
      .set('sourceStoreCateList', dataList);
  }

  /**
   * 初始化品牌
   * @param state
   * @param brandList
   */
  @Action('goodsActor: initBrandList')
  initBrandList(state, brandList: IList) {
    return state.set('brandList', brandList);
  }

  @Action('goodsActor: isEditGoods')
  isEditGoods(state, isEditGoods) {
    return state.set('isEditGoods', isEditGoods);
  }

  @Action('goodsActor: tabChange')
  tabChange(state, activeKey) {
    return state.set('activeTabKey', activeKey);
  }

  @Action('goodsActor: detailEditor')
  detailEditor(state, detailEditor) {
    return state.set('detailEditor', detailEditor);
  }

  @Action('goodsActor: goodsTabs')
  goodsTabs(state, goodsTabs) {
    return state.set('goodsTabs', goodsTabs);
  }

  /**
   * 修改商品信息
   * @param state
   * @param data
   */
  @Action('goodsActor: editGoods')
  editGoods(state, data: IMap) {
    return state.update('goods', (goods) => goods.merge(data));
  }

  @Action('goodsActor:randomGoodsNo')
  randomGoodsNo(state) {
    return state.update('goods', (goods) =>
      goods.set(
        'goodsNo',
        'P' +
          new Date().getTime().toString().slice(4, 10) +
          Math.random().toString().slice(2, 5)
      )
    );
  }

  /**
   * 修改商品信息
   * @param state
   * @param saveLoading
   */
  @Action('goodsActor: saveLoading')
  saveLoading(state, saveLoading: boolean) {
    return state.set('saveLoading', saveLoading);
  }

  /**
   * 店铺信息
   * @param state
   * @param storeInfo
   */
  @Action('goodsActor: initStoreInfo')
  initStoreInfo(state, storeInfo) {
    return state.set('storeInfo', storeInfo);
  }

  /**
   * 设置商品属性信息
   */
  @Action('goodsActor: setGoodsPropDetails')
  setGoodsPropDetails(state, goodsPropDetails) {
    return state.set('goodsPropDetails', goodsPropDetails);
  }
}
