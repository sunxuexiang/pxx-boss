/**
 * Created by feitingting on 2017/11/13.
 */
import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import moment from 'moment';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import DetailActor from './actor/detail-actor';
import ModalActor from './actor/modal-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new DetailActor(), new ModalActor()];
  }

  init = async (id) => {
    const { res } = await webapi.fetchStoreInfo(id);
    if (res.code == Const.SUCCESS_CODE) {
      const info = res.context;
      if (info.returnGoodsAddress) {
        info.receiveName = info.returnGoodsAddress.receiveName || '';
        info.receivePhone = info.returnGoodsAddress.receivePhone || '';
        info.detailAddress = info.returnGoodsAddress.detailAddress || '';
        info.returnArea = [
          info.returnGoodsAddress.provinceId.toString(),
          info.returnGoodsAddress.cityId.toString(),
          info.returnGoodsAddress.areaId.toString(),
          info.returnGoodsAddress.townId?.toString() || ''
        ];
      }
      this.dispatch('store: info', info);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 设置当前tab页面
   */
  setTab = (tab) => {
    this.dispatch('company: tab: set', tab);
    switch (tab) {
      case '1':
        this.init(this.state().get('storeId'));
        break;
      case '2':
        this.infoInit(this.state().get('companyInfoId'));
        break;
      case '3':
        this.fetchSignInfo(this.state().get('storeId'));
        break;
      case '4':
        this.initAccount(
          this.state().get('storeId'),
          this.state().get('companyInfoId')
        );
        break;
    }
  };

  /**
   * 工商信息初始化
   */
  infoInit = async (id) => {
    const { res } = (await webapi.findOne(id)) as any;
    this.dispatch('company: info', res.context);
  };

  /**
   * 获取签约信息
   */
  fetchSignInfo = async (id) => {
    const { res } = (await webapi.findOne(
      this.state().get('companyInfoId')
    )) as any;
    this.dispatch('company: info', res.context);
    const storeId = this.state().get('storeId');
    //获取签约分类和品牌分类
    const { res: cateList } = await webapi.getCateList(id);
    const { res: brandList } = await webapi.getBrandList(id);
    const { res: marketList } = await webapi.getMarketList({
      pageNum: 0,
      pageSize: 10000,
      storeId,
      relationType: 2
    });
    const { res: storeList } = await webapi.getMarketList({
      pageNum: 0,
      pageSize: 10000,
      storeId,
      relationType: 1
    });
    if (
      cateList.code == Const.SUCCESS_CODE &&
      brandList.code == Const.SUCCESS_CODE &&
      marketList.code == Const.SUCCESS_CODE &&
      storeList.code == Const.SUCCESS_CODE
    ) {
      //审核已通过，只存在平台品牌一种
      if (this.state().get('company').get('auditState') == 1) {
        this.transaction(() => {
          this.dispatch('detail:cate', fromJS(cateList.context));
          this.dispatch('detail:brand', fromJS(brandList.context));
        });
      } else {
        //审核未通过,区分平台品牌和商家自增两种
        this.transaction(() => {
          this.dispatch('detail:cate', fromJS(cateList.context));
          this.dispatch('detail:twoBrandKinds', fromJS(brandList.context));
        });
      }
      this.transaction(() => {
        this.dispatch(
          'detail:market',
          fromJS(marketList.context ? marketList.context.content : [])
        );
        this.dispatch(
          'detail:store',
          fromJS(storeList.context ? storeList.context.content : [])
        );
      });
    } else {
      message.error(cateList.message);
    }
    await this.fetchAllSelfWareHouse();
  };

  /**
   * 商家弹窗
   */
  supplierModal = async () => {
    this.dispatch('modalActor: supplierModal');
  };

  /**
   * 驳回弹窗
   */
  dismissedModal = async () => {
    this.dispatch('modalActor: dismissedModal');
  };

  /**
   * 审核商家
   */
  acceptSupplier = async () => {
    //店铺ID
    const storeId = this.state().get('storeId');
    //查看商家品牌与店铺品牌有无重复
    const { res: sameBrands } = await webapi.getSameBrands(storeId);
    //无重复时，进行下一步审核，有重复时，弹出提示框，并填充数据
    if (sameBrands.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('detail:sameBrands', sameBrands.context);
      });
      if (this.state().get('sameBrands').toJS().length > 0) {
        //如有重复的，弹出提示框
        this.dispatch('modalActor:tipsModal');
      } else {
        //直接审核
        await this.agreeSupplier();
      }
    } else {
      message.error(sameBrands.message);
    }
    //关闭弹框
    this.supplierModal();
  };

  /**
   * 审核商家
   * @returns {Promise<void>}
   */
  agreeSupplier = async () => {
    //审核信息对象
    const checkInfo = this.state().get('checkInfo');
    //店铺ID
    const storeId = this.state().get('storeId');
    const { res } = await webapi.rejectSupplier({
      //店铺ID
      storeId: storeId,
      auditState: 1,
      companyType: checkInfo.get('companyType'),
      constructionBankMerchantNumber: checkInfo
        .get('constructionBankMerchantNumber')
        .toString(),
      shareRatio: Number(checkInfo.get('shareRatio').toString()),
      settlementCycle: Number(checkInfo.get('settlementCycle').toString()),
      // companyType: 2,
      contractStartDate: moment(new Date())
        .format('YYYY-MM-DD 00:00:00')
        .toString(),
      contractEndDate: checkInfo.get('contractEndDate')
    });
    if (res.code == Const.SUCCESS_CODE) {
      //初始化
      this.init(storeId);
      message.success('审核成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取审核信息
   * @param field
   * @param value
   */
  supplierCheckInfo = ({ field, value }) => {
    this.dispatch('detail:supplier:check', { field, value });
  };

  /**
   * 驳回商家
   * @returns {Promise<void>}
   */
  dissMissSupplier = async () => {
    //审核信息对象
    const checkInfo = this.state().get('checkInfo');
    //店铺ID
    const storeId = this.state().get('storeId');
    const { res } = await webapi.rejectSupplier({
      //店铺ID
      storeId: storeId,
      auditState: checkInfo.get('auditState'),
      auditReason: checkInfo.get('auditReason')
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.init(storeId);
      message.success('驳回成功！');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 提示弹框
   */
  tipsModal = () => {
    this.dispatch('modalActor:tipsModal');
    //若为驳回关闭，弹出驳回弹框
    if (this.state().get('checkInfo').get('auditState') == 2) {
      this.dismissedModal();
    } else {
      //若为审核关闭
      this.acceptSupplier();
    }
  };

  /**
   * 关闭弹框
   */
  closeTipsModal = () => {
    this.dispatch('modalActor:tipsModal');
  };

  /**
   * 财务信息初始化
   * @param id
   * @returns {Promise<void>}
   */
  initAccount = async (id, companyInfoId) => {
    const { res } = await webapi.fetchAccountDay(id);
    const { res: account } = await webapi.fetchAccountList(companyInfoId);
    if (res.code == Const.SUCCESS_CODE && account.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('company:accountDay', fromJS(res.context));
        this.dispatch('company:account', account.context);
      });
    } else {
      message.error(res.message + ' ' + account.message);
    }
  };

  /**
   * 关联品牌
   */
  brandRelevance = async () => {
    const { res } = await webapi.brandRelevance(this.state().get('storeId'));
    if (res.code == Const.SUCCESS_CODE) {
      //直接审核
      await this.agreeSupplier();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取自营商家的所有仓库
   */
  fetchAllSelfWareHouse = async () => {
    const { res: wareHouses } = await webapi.fetchAllSelfWareHouse();
    if (wareHouses.code == Const.SUCCESS_CODE) {
      this.dispatch('company: warehouses', wareHouses.context.wareHouseVOList);
      this.dispatch(
        'company: setChooseWareHouse',
        wareHouses.context.chooseWareIds
      );
    }
  };
}
