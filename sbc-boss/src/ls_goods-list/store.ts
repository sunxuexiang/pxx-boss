import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import {
  goodsList,
  getCateList,
  getBrandList,
  forbidSale,
  copyToGoodsLibrary,
  setGoodsSeqNum,
  searchBrandLink
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new CateActor(),
      new BrandActor(),
      new GoodsActor(),
      new FormActor()
    ];
  }

  /**
   * 初始化
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    //已审核通过的
    const { res, err } = (await goodsList({
      pageNum,
      pageSize,
      auditStatus: 1
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this._changeData(fromJS(res.context), fromJS(res.context.importStandard));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }
    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
  };

  /**
   * 条件搜索
   */
  onSearch = async () => {
    const pageNum = sessionStorage.getItem('pageNum');
    console.log(pageNum, 'pageNum');

    if (pageNum == undefined) {
      this.dispatch('form:field', { key: 'pageNum', value: 0 });
    }
    this.onPageSearch();
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async () => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeSupplierName: this.state().get('likeSupplierName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      stockUp: this.state().get('stockUp'),
      specialPriceFirst: this.state().get('specialPriceFirst'),
      specialPriceLast: this.state().get('specialPriceLast'),
      goodsInfoBatchNo: this.state().get('goodsInfoBatchNo'),
      pageSize: this.state().get('pageSize'),
      auditStatus: 1, //已审核通过
      goodsSeqFlag: this.state().get('goodsSeqFlag')
    };

    if (this.state().get('cateId') != '-1') {
      request.cateId = this.state().get('cateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('addedFlag') != '-1') {
      request.addedFlag = this.state().get('addedFlag');
    }
    if (this.state().get('saleType') != '-1') {
      request.saleType = this.state().get('saleType');
    }
    if (
      this.state().get('goodsInfoType') &&
      this.state().get('goodsInfoType') != '-1'
    ) {
      request.goodsInfoType = this.state().get('goodsInfoType');
    }
    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this._changeData(fromJS(res.context), fromJS(res.context.importStandard));
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  /**
   * 显示/关闭禁售理由框
   */
  switchShowModal = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal', flag);
  };

  /**
   * 搜索条件表单的变更
   */
  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  /**
   * 搜索skuNo,利用此进行标记展开哪些spuList
   */
  onEditSkuNo = (value) => {
    this.dispatch('goodsActor:editLikeGoodsInfoNo1', value);
  };

  /**
   * 修改展开显示的spuIdList
   */
  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  /**
   * 修改单个禁售的spuId
   */
  changeForbidGoodsId = (forbidGoodsId) => {
    this.dispatch('goodsActor:changeForbidGoodsId', forbidGoodsId);
  };

  /**
   * 修改禁售原因
   */
  changeForbidReason = (forbidReason) => {
    this.dispatch('goodsActor:changeForbidReason', forbidReason);
  };

  /**
   * 禁售商品
   */
  forbidSaleFunc = async (id) => {
    const forbidReason = this.state().get('forbidReason');
    const data: any = await forbidSale({
      goodsIds: [id],
      auditReason: forbidReason,
      auditStatus: 3
    });
    this.message(data);
    this.onSearch();
  };

  /**
   * 提示信息
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(data.res.code);
    }
  };

  //判断商品是否已经加入到商品库中，加入过的set('addToGoodsLibrary', false)，
  _changeData = (data, list) => {
    let content = data.getIn(['goodsPage', 'content']);
    content = content.map((value) => {
      const goodsId = value.get('goodsId');
      if (list && list.includes(goodsId)) {
        return value.set('addToGoodsLibrary', false);
      }
      return value.set('addToGoodsLibrary', true);
    });
    data = data.setIn(['goodsPage', 'content'], content);
    this.dispatch('goodsActor: init', data);
  };

  //将商品加入到商品库中，
  addToGoodsLibrary = async (goodsId) => {
    const { res, err } = (await copyToGoodsLibrary({
      goodsIds: [goodsId]
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      //更新已加入商品库的数据
      this.dispatch('goodsActor: updateGoodsLibrary', goodsId);
      message.success('加入成功');
    } else {
      message.error(res.message);
    }
  };
  /**
   * 数值变更
   */
  onFieldChange = (field, value) => {
    this.dispatch('goods: field: change', { field, value });
  };
  /**
   * 显示/关闭修改序号
   */
  switchShowModal2 = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal2', flag);
  };
  /**
   * 修改商品序号
   */
  setGoodsSeqNum = async (goodsId, goodsSeqNum) => {
    let param = {
      goodsId,
      goodsSeqNum
    };
    const result = (await setGoodsSeqNum(param)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      sessionStorage.setItem('pageNum', this.state().get('pageNum'));
      this.onSearch();
    } else {
      message.error(result.res.message);
    }
  };
  /**
   * 查询关联品牌
   */
  searchBrandLink = async (brandId) => {
    const result = (await searchBrandLink(brandId)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      this.onFieldChange('isBrandLinksort', result.res.context.brandSeqNum);
    } else {
      message.error(result.res.message);
    }
  };
  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };
  /**
   * 打开导出弹框
   */
  onExportModalShow = (exportModalData) => {
    this.dispatch(
      'info:exportModalShow',
      fromJS({
        ...exportModalData,
        visible: true,
        exportByParams: this.onExportByParams,
        exportByIds: this.onExportByIds
      })
    );
  };
  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeSupplierName: this.state().get('likeSupplierName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      stockUp: this.state().get('stockUp'),
      pageSize: this.state().get('pageSize'),
      auditStatus: 1, //已审核通过
      goodsSeqFlag: this.state().get('goodsSeqFlag')
    };

    if (this.state().get('cateId') != '-1') {
      request.cateId = this.state().get('cateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('addedFlag') != '-1') {
      request.addedFlag = this.state().get('addedFlag');
    }
    if (this.state().get('saleType') != '-1') {
      request.saleType = this.state().get('saleType');
    }
    if (
      this.state().get('goodsInfoType') &&
      this.state().get('goodsInfoType') != '-1'
    ) {
      request.goodsInfoType = this.state().get('goodsInfoType');
    }
    return this._onExport(request);
  };
  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    console.log(params, 'paramsparams');
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = window.token;
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref =
            Const.HOST + `/goods/spu/export/params/${encrypted}`;
          console.log(exportHref, 'exportHrefexportHrefexportHref', result);
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve();
      }, 500);
    });
  };
  /**
   * 批量导出
   */
  onExportByIds = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }
    if (ids.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            goodsIds: ids,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/goods/spu/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goodsActor: onSelectChange', fromJS(selectedRowKeys));
  };
}
