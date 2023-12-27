import { IOptions, Store, Action } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import SearchManageActor from './actor/search-manage-actor';
import { IMap } from 'typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new SearchManageActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    //热门搜索词
    const preset = (await webapi.fetchPresupposition()) as any;
    const papular = (await webapi.fetchPapular()) as any;
    if (preset.res && preset.res.code == Const.SUCCESS_CODE) {
      const presetSearchTermsVO = preset.res?.context.presetSearchTermsVO.sort(
        this.compare('sort')
      );
      preset.res.context.presetSearchTermsVO = presetSearchTermsVO;
      this.dispatch('presetform:init', fromJS(preset.res?.context));
    }
    if (papular.res && papular.res.code == Const.SUCCESS_CODE) {
      this.dispatch('papular:init', fromJS(papular.res.context));
    }

    const association = (await webapi.fetchAssociation({
      pageNum,
      pageSize
    })) as any;
    if (association.res && association.res.code == Const.SUCCESS_CODE) {
      this.dispatch(
        'association:page',
        fromJS({ currentPage: pageNum + 1, pageSize })
      );
      this.dispatch('association:init', association.res.context);
    }
  };
  // 排序
  compare = (property) => {
    return function(a, b) {
      let value1 = a[property];
      let value2 = b[property];
      return value1 - value2;
    };
  };
  /**
   * 编辑
   * @param info
   * @returns {Promise<void>}
   */
  editInfo = async (info) => {
    const id = this.state()
      .get('searchFormData')
      .get('id');
    const presetSearchKeyword = this.state()
      .get('searchFormData')
      .get('presetSearchKeyword');
    if (id) {
      const param = {
        id,
        presetSearchKeyword
      };
      const { res } = (await webapi.changePresetInfo(param)) as any;
      if (res.code == Const.SUCCESS_CODE) {
        message.success('修改预置搜索词成功');
        await this.init();
        await this.presetModal(true, false);
      } else {
        message.error(res.message);
      }
    } else {
      const { res } = (await webapi.savePresetInfo({
        presetSearchKeyword: presetSearchKeyword
      })) as any;
      if (res.code == Const.SUCCESS_CODE) {
        message.success('新增预置搜索词成功');
        await this.init();
        await this.presetModal(true, false);
      } else {
        message.error(res.message);
      }
    }
  };

  /**
   * 联想词拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  associationCateSort = async (sortList) => {
    let paramList = [];
    for (let index in sortList) {
      paramList.push({
        associationLongTailWordId: sortList[index].associationLongTailWordId,
        sortNumber: Number(index) + 1
      });
    }

    const { res } = (await webapi.associationDragSort(paramList)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除联想词
   */
  deleteAssociation = async (id) => {
    let result: any = await webapi.deleteAssociation({
      associationLongTailWordId: id
    });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  //删除搜索词
  deleteSearch = async (id) => {
    const { pageSize, pageNum } = this.fetchPageParams({ delNum: 1 });
    let result: any = await webapi.deleteSearch({ id });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh({ pageSize, pageNum });
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除热搜词
   */
  deletePreset = async (params) => {
    const { pageSize, pageNum } = this.fetchPageParams();
    let result: any = await webapi.deletePreset(params);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh({ pageSize, pageNum });
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除热搜词
   */
  deletePopular = async (params) => {
    const { pageSize, pageNum } = this.fetchPageParams();
    let result: any = await webapi.deletePopular(params);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh({ pageSize, pageNum });
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 搜索词拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  popularCateSort = async (sortList) => {
    let paramList = { presetSearchTermsList: [] };
    for (let index in sortList) {
      paramList.presetSearchTermsList.push({
        id: sortList[index].id,
        sort: sortList[index].sort
      });
    }

    const { res } = (await webapi.editPresetInfo(paramList)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  //联想词提交
  doAssociationAdd = async () => {
    let result: any;
    const formData = this.state().get('associationFormData');

    let params = { ...formData.toJS() };
    params.sortNumber = 1; //临时排序
    params.searchAssociationalWordId = params.id;

    if (this.state().get('isAdd')) {
      result = await webapi.addAssociationTerms(params);
    } else {
      result = await webapi.modifyAssociationTerms(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.associationModal(false);
    } else {
      message.error(result.res.message);
    }
  };

  //搜索词提交
  doSearchAdd = async () => {
    let result: any;
    const formData = this.state().get('searchFormData');

    let params = { ...formData.toJS() };

    if (this.state().get('isAdd')) {
      result = await webapi.addsearchTerms(params);
    } else {
      result = await webapi.modifySearchTerms(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.searchModal(false);
    } else {
      message.error(result.res.message);
    }
  };

  //热门词提交
  doPopularAdd = async () => {
    let result: any;
    const formData = this.state().get('popularFormData');
    let dataInfo =
      this.state().get('dataInfo') &&
      this.state()
        .get('dataInfo')
        .toJS();
    if (
      !(
        dataInfo.info.name !== undefined ||
        dataInfo.info.storeName !== undefined ||
        dataInfo.info.pathName !== undefined ||
        dataInfo.info.title !== undefined ||
        (dataInfo.info.goodsInfo &&
          dataInfo.info.goodsInfo.goodsInfoName !== undefined) ||
        (dataInfo.info.goods && dataInfo.info.goods.goodsName !== undefined) ||
        dataInfo.info.marketingName !== undefined ||
        dataInfo.info.content !== undefined ||
        dataInfo.info.cateName !== undefined
      )
    ) {
      dataInfo = null;
    }

    let dataInfoPC =
      this.state().get('dataInfoPC') &&
      this.state()
        .get('dataInfoPC')
        .toJS();
    if (
      !(
        dataInfoPC.info.name !== undefined ||
        dataInfoPC.info.storeName !== undefined ||
        dataInfoPC.info.pathName !== undefined ||
        dataInfoPC.info.title !== undefined ||
        (dataInfoPC.info.goodsInfo &&
          dataInfoPC.info.goodsInfo.goodsInfoName !== undefined) ||
        (dataInfoPC.info.goods &&
          dataInfoPC.info.goods.goodsName !== undefined) ||
        dataInfoPC.info.marketingName !== undefined ||
        dataInfoPC.info.content !== undefined
      )
    ) {
      dataInfoPC = null;
    }

    let params = {
      ...formData.toJS(),
      relatedLandingPage: dataInfo
        ? JSON.stringify(dataInfo).replace(/\"/g, "'")
        : null,
      pcLandingPage: dataInfoPC
        ? JSON.stringify(dataInfoPC).replace(/\"/g, "'")
        : null,
      sortNumber: 1
    };

    if (this.state().get('isAdd')) {
      result = await webapi.addPopular(params);
    } else {
      delete params.sortNumber;
      result = await webapi.updatePopular(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.popularModal(false);
      this.cleaPopularModal();
    } else {
      message.error(result.res.message);
    }
  };

  //清空数据
  cleaPopularModal = () => {
    this.dispatch('set:state', { field: 'dataInfo', value: { info: {} } });
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    setTimeout(() => {
      this.init({ pageNum, pageSize });
    }, 1000);
  };

  /**
   * 显示新增搜索词框
   */
  presetModal = (isAdd, record) => {
    if (record) {
      this.dispatch('association: editSearchFormData', record);
    }
    this.dispatch('association: presetModal', isAdd);
  };

  /**
   * 显示新增搜索词框
   */
  searchModal = (isAdd) => {
    this.dispatch('association: searchModal', isAdd);
  };

  /**
   * 显示联想词模态框
   */
  associationModal = (isAdd) => {
    this.dispatch('association: associationModal', isAdd);
  };

  /**
   * 显示热搜词框
   */
  popularModal = (isAdd) => {
    this.cleaPopularModal();
    this.dispatch('association: popularModal', isAdd);
  };

  /**
   * 切换落地页的平台
   */
  changePlatform = (platform) => {
    this.dispatch('association: platform', platform);
  };

  /**
   * 显示搜索词修改弹窗
   */
  showEditSearchModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('association: editSearchFormData', formData);
      this.dispatch('association: searchModal', isAdd);
    });
  };

  /**
   * 修改搜索词form信息
   */
  editSearchFormData = (formData: IMap) => {
    this.dispatch('association: editSearchFormData', formData);
  };

  /**
   * 显示联想词弹窗
   */
  showEditAssociationModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('association: editAssociationFormData', formData);
      this.dispatch('association: associationModal', isAdd);
    });
  };

  /**
   * 修改联想词form信息
   */
  editAssociationFormData = (formData: IMap) => {
    this.dispatch('association: editAssociationFormData', formData);
  };

  /**
   * 显示热搜词修改弹窗
   */
  showEditPopularModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('association: editPopularFormData', formData);
      let relatedLandingPage =
        formData.get('relatedLandingPage') &&
        formData
          .get('relatedLandingPage')
          .replace(/\'/g, '\\"')
          .replace(/\\/g, '');
      let dataInfo = JSON.parse(relatedLandingPage)
        ? JSON.parse(relatedLandingPage)
        : { linkKey: 'goodsList', info: {} };

      this.dispatch('set:state', {
        field: 'dataInfo',
        value: dataInfo
      });

      let pcLandingPage = formData.get('pcLandingPage')
        ? JSON.parse(
            formData
              .get('pcLandingPage')
              .replace(/\'/g, '\\"')
              .replace(/\\/g, '')
          )
        : { linkKey: 'goodsList', info: {} };
      this.dispatch('set:state', {
        field: 'dataInfoPC',
        value: pcLandingPage
      });

      this.dispatch('association: popularModal', isAdd);
    });
  };

  /**
   * 修改热搜词form信息
   */
  editPopularFormData = (formData: IMap) => {
    this.dispatch('association: editPopularFormData', formData);
  };

  onDataChange = (field, pathArray, newVal, platFormValueMap) => {
    let param = {
      linkKey: platFormValueMap.linkKey,
      info: null,
      target: platFormValueMap.target,
      type: platFormValueMap.type
    };
    if (platFormValueMap.linkKey === 'goodsList') {
      param.info = {
        skuId: platFormValueMap.info.skuId,
        name: escape(platFormValueMap.info.name)
      };
    } else if (platFormValueMap.linkKey === 'storeList') {
      param.info = {
        storeId: platFormValueMap.info.storeId,
        storeName: escape(platFormValueMap.info.storeName)
      };
    } else if (platFormValueMap.linkKey === 'categoryList') {
      param.info = {
        selectedKeys: platFormValueMap.info.selectedKeys,
        pathName: platFormValueMap.info.pathName,
        cateId: platFormValueMap.info.cataId,
        cateName: platFormValueMap.info.name
      };
    } else if (platFormValueMap.linkKey === 'pageList') {
      param.info = {
        _id: platFormValueMap.info._id,
        title: platFormValueMap.info.title,
        pageCode: platFormValueMap.info.pageCode,
        pageType: platFormValueMap.info.pageType
      };
    } else if (platFormValueMap.linkKey === 'userpageList') {
      param.info = {
        key: platFormValueMap.info.key,
        link: platFormValueMap.info.link,
        title: platFormValueMap.info.title,
        wechatPath: platFormValueMap.info.wechatPath,
        appPath: platFormValueMap.info.appPath
      };
    } else if (platFormValueMap.linkKey === 'promotionList') {
      let cateKey = platFormValueMap.info.cateKey;
      if (cateKey === 'preOrder') {
        param.info = {
          goodsInfo: {
            goodsInfoName:
              platFormValueMap.info.appointmentSaleGoods.goodsInfoVO
                .goodsInfoName
          },
          id: platFormValueMap.info.id,
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          cateKey: cateKey
        };
      } else if (cateKey === 'preSell') {
        param.info = {
          goodsInfo: {
            goodsInfoName:
              platFormValueMap.info.bookingSaleGoods.goodsInfoVO.goodsInfoName
          },
          id: platFormValueMap.info.id,
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          cateKey: cateKey
        };
      } else if (cateKey === 'groupon') {
        param.info = {
          goodsInfo: {
            goodsInfoName: platFormValueMap.info.goodsInfo.goodsInfoName
          },
          grouponActivityId: platFormValueMap.info.grouponActivityId,
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          cateKey: cateKey
        };
      } else if (cateKey === 'flash') {
        param.info = {
          goods: {
            goodsName: platFormValueMap.info.goods.goodsName
          },
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          id: platFormValueMap.info.id,
          cateKey: cateKey
        };
      } else if (cateKey === 'comBuy') {
        param.info = {
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          marketingName: platFormValueMap.info.marketingName,
          marketingId: platFormValueMap.info.marketingId,
          cateKey: cateKey
        };
      } else {
        param.info = {
          marketingName: platFormValueMap.info.marketingName,
          marketingId: platFormValueMap.info.marketingId,
          cateKey: cateKey
        };
      }
    } else if (platFormValueMap.linkKey === 'custom') {
      param.info = {
        content: platFormValueMap.info.content
      };
    } else if (platFormValueMap.linkKey === 'operationClassifyList') {
      param.info = {
        cateId: platFormValueMap.info.cataId,
        cateName: platFormValueMap.info.name
      };
    }

    this.setData(field, param);
  };

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

  /**
   * 获取分页参数
   * @param param0 删除数量, required: false
   */
  fetchPageParams = ({ delNum } = { delNum: 0 }) => {
    // 当前页展示条数
    const pageSize = this.state().get('pageSize') || 10;
    // 总条数
    const totalElements = this.state().get('total') || 0;
    // 当前页码数
    const currentPage = this.state().get('currentPage') || 0;

    // 当前页展示数量
    const currentSize =
      this.state()
        .getIn(['associationList', 'searchAssociationalWordPage', 'content'])
        .count() || 0;
    // 总页数
    const totalPage = Math.ceil(totalElements / pageSize);
    // 是否最后一页
    let last = false;

    if (
      totalElements === 0 ||
      (totalElements > 0 && totalPage === currentPage) ||
      pageSize >= totalElements
    ) {
      last = true;
    }
    if (delNum > 0 && currentSize === delNum) {
      return {
        pageSize,
        pageNum: last && totalPage > 1 ? currentPage - 2 : currentPage - 1
      };
    } else {
      return { pageSize, pageNum: currentPage - 1 };
    }
  };
}
