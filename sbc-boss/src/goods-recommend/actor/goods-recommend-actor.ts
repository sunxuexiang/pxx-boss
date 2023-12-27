import { Action, Actor, IMap } from 'plume2';

export default class GoodsRecommendActor extends Actor {
  defaultState() {
    return {
      sortVisible: false,
      sortData: {},
      // 加载状态
      loading: true,
      // 商品推荐开关
      enabled: false,
      //智能推荐开关
      intelligentEnabled: false,
      //推荐入口
      entries: [0, 1],
      //优先级
      priority: 0,
      //推荐规则
      rule: 0,
      //添加商品模块是否显示
      goodsModalVisible: false,
      //商品ids
      goodsInfoIds: [],
      // 选择的具体商品信息
      goodsRows: [],
      //仓库列表
      warehouseList: [],
      //仓库id
      wareId: null,
      //仓库选中的索引值
      wareIndex: 0,
      wareRowList: [],
      settingId: 1,
      // tab页 0: 手动推荐   1: 智能推荐
      tab: 0,
      //0.手动策略   1.智能策略
      strategy: 0,
      //智能推荐对象信息
      intelligentRecommend: {
        //推荐开关(0:开启；1:关闭)
        enabled: false,
        //推荐入口,多选'|'隔开',0个人中心（移动端）1商品列表 2 好友代付（移动端）  3支付成功  4商品详情页 5购物车
        entries: [0, 1],
        //推荐数量
        intelligentRecommendAmount: 1,
        //推荐维度 0.三级类目 1.品牌
        intelligentRecommendDimensionality: 0,
        //优先级(0.最新上架时间 1.关注度 2.浏览量 3.按销量 4.按默认 5.按综合)'
        priority: 0,
        //是否智能推荐(0:手动推荐 1:智能推荐；)',
        isIntelligentRecommend: 1,
        //推荐规则
        rule: 0
      }
    };
  }

  /**
   * 初始化
   */
  @Action('init')
  init(state: IMap, params) {
    return state.merge(params).set('loading', false);
  }

  @Action('form:sortVisible')
  sortVisibleChange(state: IMap, blo) {
    return state.set('sortVisible', blo);
  }

  @Action('form:sortData')
  sortDataChange(state: IMap, data) {
    return state.set('sortData', data);
  }

  /**
   * 修改表单数据
   */
  @Action('form:field:change')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }

  /**
   * 修改wareId
   */
  @Action('form:wareId;change')
  wareIdchange(state: IMap, id) {
    return state.set('wareId', id);
  }

  /**
   * 修改智能推荐表单数据
   */
  @Action('intelligent: field: save')
  intelligentSave(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 修改智能推荐表单数据
   */
  @Action('intelligentRecommend: field: save')
  intelligentRecommendSave(state: IMap, { field, value }) {
    return state.setIn(['intelligentRecommend', field], value);
  }

  /**
   * 删除选择的sku
   */
  @Action('setting:delete:sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.get('goodsRows');
    let goodsInfoIds = state.get('goodsInfoIds');
    goodsInfoIds = goodsInfoIds.splice(
      goodsInfoIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(
      goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId)
    );
    return state.set('goodsRows', goodsRows).set('goodsInfoIds', goodsInfoIds);
  }
}
