import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import GoodsRecommendActor from './actor/goods-recommend-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new GoodsRecommendActor()];
  }

  onWareHousePage = async () => {
    let { res }: any = await webapi.wareHousePage({
      pageNum: 0,
      pageSize: 10000,
      defaultFlag: 1
    });
    if (res.code === Const.SUCCESS_CODE) {
      let list = (res.context?.wareHouseVOPage?.content || []).filter(
        (item) => item.wareId != 49 && item.wareId != 45
      );
      this.dispatch('form:field:change', {
        key: 'warehouseList',
        value: fromJS(list)
      });
      this.init(list[0].wareId);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 初始化
   */
  init = async (wareId = null) => {
    let warehouseList = this.state()
      .get('warehouseList')
      .toJS();
    this.dispatch('form:field:change', {
      key: 'wareId',
      value: fromJS(wareId || warehouseList[0].wareId)
    });
    const { res } = (await webapi.getSetting({
      wareId: wareId || warehouseList[0].wareId
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      let contextNew = res.context.goodsRecommendSettingVOS;
      let handRecommend = contextNew.find((i) => i.isIntelligentRecommend == 0);
      let intelligentRecommend = contextNew.find(
        (i) => i.isIntelligentRecommend == 1
      );
      //let context = res.context.goodsRecommendSettingVO;
      let context = handRecommend;
      //let brands = res.context.goodsRecommendSettingVO.brands;
      let brands = context.brands;
      //let cates = res.context.goodsRecommendSettingVO.cates;
      let cates = context.cates;
      //0 手动策略  1.智能策略
      context.strategy = context.intelligentStrategy == 0 ? 0 : 1;
      //对应的策略显示对应tab页面
      context.tab = context.intelligentStrategy == 0 ? 0 : 1;
      context.enabled = context.enabled == 0;
      context.entries =
        context.entries == null ? [] : context.entries.split('|');
      context.goodsRows = context.goodsInfos.map((sku) => {
        sku.brandName = '';
        sku.cateName = '';
        const cate = cates.find((item) => item.cateId == sku.cateId);
        const brand = brands.find((item) => item.brandId == sku.brandId);
        sku.brandName = brand ? brand.brandName : '';
        sku.cateName = cate ? cate.cateName : '';
        return sku;
      });
      //存放智能推荐对象信息
      context.intelligentRecommend = {
        enabled: intelligentRecommend.enabled == 0,
        entries:
          intelligentRecommend.entries == null
            ? []
            : intelligentRecommend.entries.split('|'),
        intelligentRecommendAmount:
          intelligentRecommend.intelligentRecommendAmount,
        intelligentRecommendDimensionality:
          intelligentRecommend.intelligentRecommendDimensionality,
        priority: intelligentRecommend.priority
      };

      this.dispatch('init', fromJS(context));
      // let res1=await webapi.wareHouseList();
      // let warehouseList=this.state().get('warehouseList').toJS();
      // let list=[...[{...{goodsRowsL:[],goodsInfoIds:[]}}],...Array(warehouseList.length-1).fill({goodsRowsL:[],goodsInfoIds:[]})];
      // this.dispatch('form:field:change', {key: 'wareRowList', value:fromJS(list) });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存
   */
  save = async () => {
    const state = this.state();

    let tab = state.get('tab');
    let params;

    const rGoods = state.toJS().goodsRows;
    let list = rGoods.map((item, i) => {
      return {
        goodsInfoId: item.goodsInfoId,
        recommendSort: i + 1,
        wareId: state.get('wareId') || null
      };
    });
    const Sortes = await webapi.saveSort(list);
    if (Sortes.res.code != Const.SUCCESS_CODE) {
      message.success('排序失败');
    }
    //手动推荐
    if (tab == 0) {
      let listasdasd = rGoods.map((item, i) => {
        return item.goodsInfoId;
      });
      params = {
        enabled: state.get('enabled') ? 0 : 1,
        entries: state.get('entries').join('|'),
        priority: state.get('priority'),
        rule: state.get('rule'),
        goodsInfoIds: listasdasd,
        isIntelligentRecommend: 0,
        wareId: state.get('wareId') || null
      };
      let goodsInfoList = params.goodsInfoIds;
      let enabled = params.enabled;
      if (goodsInfoList.length == 0 && enabled == 0) {
        message.error('请添加推荐商品');
        return;
      }
      //智能推荐
    } else {
      params = state.get('intelligentRecommend');

      params = {
        enabled: params.get('enabled') ? 0 : 1,
        entries: params.get('entries').join('|'),
        intelligentRecommendAmount: params.get('intelligentRecommendAmount'),
        intelligentRecommendDimensionality: params.get(
          'intelligentRecommendDimensionality'
        ),
        priority: params.get('priority'),
        isIntelligentRecommend: 1,
        rule: state.get('rule')
      };
    }
    const { res } = await webapi.save(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
    } else {
      message.error(res.message);
    }
  };

  onChangeWareId = (id) => {
    this.dispatch('form:wareId;change', id);
  };

  showSort = (blo) => {
    this.dispatch('form:sortVisible', blo);
  };

  setRowData = (data) => {
    this.dispatch('form:sortData', data);
  };

  setSortChange = (index) => {
    const state = this.state();
    let sortData = state.get('sortData');
    let data = state
      .get('goodsRows')
      .toJS()
      .filter((item) => item.goodsInfoId !== sortData.goodsInfoId);
    data.splice(index - 1, 0, sortData);
    let skus: Array<string> = [];
    data.forEach((item: any) => {
      skus.push(item.goodsInfoId);
    });
    this.onOkBackFun(skus, data);
    this.showSort(false);
  };

  /**
   * 修改表单信息
   */
  onFormFieldChange = (key, value) => {
    this.dispatch('form:field:change', { key, value: fromJS(value) });
  };

  /**
   * 键值存储(修改表单智能推荐信息)
   */
  fieldSave = ({ field, value }) => {
    this.dispatch('intelligent: field: save', { field, value });
  };

  /**
   * 键值存储(修改表单智能推荐信息)
   */
  intelligentRecommendSave = ({ field, value }) => {
    this.dispatch('intelligentRecommend: field: save', { field, value });
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = async (id) => {
    this.dispatch('setting:delete:sku', id);
  };
  /**
   * 排序选中的商品
   */
  saveSortSku = async (value, id) => {
    const { res } = await webapi.saveSort({
      goodsInfoId: id,
      recommendSort: value
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
      await this.init();
    } else {
      message.error(res.message);
      await this.init();
    }
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.onFormFieldChange('goodsModalVisible', false);
  };

  /**
   * 点击完成，保存用户选择的商品信息
   */
  onOkBackFun = async (skuIds, rows) => {
    this.onFormFieldChange('goodsInfoIds', skuIds);
    this.onFormFieldChange('goodsRows', rows);
    this.onFormFieldChange('goodsModalVisible', false);
  };

  /**
   * 保存策略
   * @param strategy
   */
  onStrategyFun = async (strategy) => {
    let params = {
      isOPenIntelligentStrategy: strategy == 1 ? true : false
    };
    const { res } = await webapi.saveStrategy(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
      await this.init();
    } else {
      message.error(res.message);
    }
  };
}
