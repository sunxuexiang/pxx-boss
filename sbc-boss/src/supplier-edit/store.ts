import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { fromJS, Map } from 'immutable';

import ModalActor from './actor/modal-actor';
import CompanyActor from './actor/company-actor';
import * as webApi from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new ModalActor(), new CompanyActor()];
  }

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  /**
   * 查询商家基本信息
   */
  init = async (id) => {
    const { res } = await webApi.fetchStoreInfo(id);
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
      if (info.shareRatio) {
        this.shareInfoChange('shareRatio', info.shareRatio);
      }
      if (info.settlementCycle) {
        this.shareInfoChange('settlementCycle', info.settlementCycle);
      }
      if (info.constructionBankMerchantNumber) {
        this.shareInfoChange(
          'constructionBankMerchantNumber',
          info.constructionBankMerchantNumber
        );
      }
      this.dispatch('store: info', info);
      this.dispatch('company: store: merge', {
        field: 'isResetPwd',
        value: false
      });
    }
    await this.fetchAllSelfWareHouse();
  };

  /**
   * 修改商家基本信息字段
   */
  onChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId', 'townId'].forEach((v, index) => {
          this.dispatch('company: store: merge', {
            field: v,
            value: value[index] || 0
          });
        });
      });
    } else {
      this.dispatch('company: store: merge', { field, value });
    }
  };

  /**
   *
   * @param storeInfo
   * @returns {Promise<void>}
   */
  onSaveStoreInfo = async (storeInfo) => {
    const { res } = await webApi.saveStoreInfo(storeInfo);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('保存成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 品牌弹窗
   */
  brandModal = async () => {
    this.dispatch('modalActor: brandModal');
    //加载所有品牌
    const { res } = await webApi.getAllBrands({
      likeBrandName: ''
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('company:allBrands', fromJS(res.context));
      this.dispatch('company:tempBrands', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示类目弹窗
   */
  sortModal = async () => {
    const sortsVisible = this.state().get('sortsVisible');
    const storeId = this.state().get('storeId');
    const { res: cateList } = await webApi.getCateList(storeId);
    console.log(sortsVisible, 'sortsVisible');
    if (!sortsVisible) {
      const list = fromJS(cateList.context).map((info) => {
        if (!info.get('qualificationPics')) {
          info = info.set('qualificationPics', '');
        }
        const qualificationPics =
          info.get('qualificationPics') &&
          info
            .get('qualificationPics')
            .split(',')
            .map((url, index) => {
              return Map({ uid: index + 1, status: 'done', url });
            });
        info = info.set('qualificationPics', JSON.stringify(qualificationPics));
        return info;
      });
      console.log(list.toJS(), 'list');
      this.dispatch('modal: cates', list);
      const { res: cates } = await webApi.fetchAllCates();
      this.dispatch('modal: AllCates', fromJS(cates.context));
    }
    this.transaction(() => {
      this.dispatch('modal: cate: delete', fromJS([]));
      this.dispatch('modalActor: sortModal');
      this.dispatch('detail:cate', fromJS(cateList.context));
    });
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
        this.initAccount(this.state().get('companyInfoId'));
        break;
    }
  };

  /**
   * 工商信息初始化
   */
  infoInit = async (id) => {
    const { res } = (await webApi.findOne(id)) as any;
    this.dispatch('company: info', res.context);
  };

  /**
   * 修改工商信息字段
   */
  mergeInfo = ({ field, value }) => {
    this.dispatch('company: merge: info', { field, value });
  };

  /**
   * 保存工商信息
   */
  saveCompanyInfo = async (info) => {
    const businessLicence =
      info.get('businessLicence') && JSON.parse(info.get('businessLicence'));
    const frontIDCard =
      info.get('frontIDCard') && JSON.parse(info.get('frontIDCard'));
    const backIDCard =
      info.get('backIDCard') && JSON.parse(info.get('backIDCard'));
    const warehouseImage =
      info.get('warehouseImage') && JSON.parse(info.get('warehouseImage'));
    const doorImage =
      info.get('doorImage') && JSON.parse(info.get('doorImage'));
    info = info
      .set(
        'businessLicence',
        (businessLicence
          ? businessLicence.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'frontIDCard',
        (frontIDCard
          ? frontIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'backIDCard',
        (backIDCard
          ? backIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'warehouseImage',
        (warehouseImage
          ? warehouseImage.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'doorImage',
        (doorImage ? doorImage.map((b) => b.thumbUrl || b.url) : []).toString()
      );
    const { res } = await webApi.saveCompanyInfo(info);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('company: tab: key');
      this.setTab('2');
      message.success('保存成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 从平台库里添加品牌
   * @param brand
   */
  addBrand = async (id: number, name: string) => {
    const oldBrandList = this.state().get('company').toJS().brandList;
    // if (oldBrandList.length >= 50) {
    //   message.error('您最多只能签约50个品牌');
    //   return;
    // } else {
    //获取平台的品牌详情
    const { res } = await webApi.fetchBrandInfo(id);
    const brandObj = {
      brandId: id,
      brandName: name,
      nickName: res.context.nickName,
      logo: res.context.logo,
      authorizePic: ''
    };
    //不存在，则push
    const brandArray = this.state().get('company').toJS().brandList;
    let count = 0;
    brandArray.map((v) => {
      if (v.brandId == brandObj.brandId) {
        count++;
      }
    });
    if (count == 0) {
      brandArray.push(brandObj);
    }
    this.dispatch('detail:newBrand', fromJS(brandArray));
    // }
  };

  /**
   * 获取签约信息
   */
  fetchSignInfo = async (id) => {
    const companyId = this.state().get('companyInfoId');
    const storeId = this.state().get('storeId');
    const { res } = (await webApi.findOne(companyId)) as any;
    this.dispatch('company: info', res.context);
    //获取签约分类和品牌分类
    const { res: cateList } = await webApi.getCateList(id);
    const { res: brandList } = await webApi.getBrandList(id);
    const { res: marketList } = await webApi.getMarketList({
      pageNum: 0,
      pageSize: 10000,
      storeId,
      relationType: 2
    });
    const { res: storeList } = await webApi.getMarketList({
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
      this.transaction(() => {
        this.dispatch('detail:cate', fromJS(cateList.context));
        this.dispatch('detail:twoBrandKinds', fromJS(brandList.context));
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
  };

  /**
   * 删除品牌
   */
  deleteBrand = async (contractBrandId: string, brandId: string) => {
    const brandList = this.state().get('company').get('brandList').toJS();
    //已删除的id集合
    let deleteBrandIdArray = this.state().get('delBrandIds').toJS();
    //只剩一条时，不给删除
    if (brandList.length == 1) {
      message.error('签约品牌不能为空');
      return;
    } else {
      //contractBrandId为真时，将ID存储
      if (contractBrandId) {
        const brandArray = brandList.filter(
          (v) => v.contractBrandId != contractBrandId
        );
        //当删除了已签约品牌时，所做的删除要存放
        deleteBrandIdArray.push(contractBrandId);
        this.transaction(() => {
          this.dispatch('detail:deleteBrand', fromJS(deleteBrandIdArray));
          this.dispatch('detail:updateBrands', fromJS(brandArray));
        });
      } else {
        //从平台库里添加的又进行了删除,无需保存删除的ID
        const brandArray = brandList.filter((v) => v.brandId != brandId);
        this.dispatch('detail:updateBrands', fromJS(brandArray));
      }
    }
  };

  /**
   * 新增自定义品牌
   */
  addNewOtherBrand = () => {
    const otherBrands = this.state().get('otherBrands').toJS();
    otherBrands.push({ key: otherBrands.length + 1 });
    this.dispatch('detail:addNewBrand', fromJS(otherBrands));
  };

  /**
   * 删除自定义品牌
   */
  deleteOtherBrand = () => {
    //将末尾对象删除，以免造成key值的混乱
    const otherBrands = this.state().get('otherBrands').toJS();
    //大于一条的时候才给删除
    if (otherBrands.length > 1) {
      const newOtherBrands = otherBrands.filter(
        (v) => v.key != otherBrands.length
      );
      this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
    }
  };

  /**
   * 添加自定义品牌输入框事件
   */
  onBrandInputChange = ({ ...params }) => {
    const otherBrands = this.state().get('otherBrands').toJS();
    const newOtherBrands = new Array();
    otherBrands.map((v) => {
      if (v.key == params.id) {
        if (params.value == 'brandName') {
          newOtherBrands.push({
            key: v.key,
            brandName: params.value,
            nickName: v.nickName
          });
        } else {
          newOtherBrands.push({
            key: v.key,
            brandName: v.brandName,
            nickName: params.value
          });
        }
      } else {
        newOtherBrands.push(v);
      }
    });
    this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
  };

  /**
   * 保存品牌编辑
   */
  renewBrands = async () => {
    const storeId = this.state().get('storeId');
    const delBrandIds = this.state().get('delBrandIds').toJS();
    const brandList = this.state().get('company').get('brandList').toJS();
    let brandSaveRequests = new Array();
    brandList.map((v) => {
      let brandUrl = new Array();
      if (v.authorizePic) {
        v.authorizePic.map((item) => {
          if (item) {
            if (item.url) {
              brandUrl.push(item.url);
            } else {
              brandUrl.push(item.response[0]);
            }
          }
        });
      }
      v.authorizePic = brandUrl.join(',');
      brandSaveRequests.push(v);
    });
    const { res } = await webApi.updateBrands({
      storeId: storeId,
      delBrandIds: delBrandIds,
      brandSaveRequests: brandList
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功!');
    } else {
      message.error(res.message);
    }
    this.dispatch('modalActor: brandModal');
    //重新获取
    this.fetchSignInfo(this.state().get('storeId'));
  };

  /**
   * 删除分类
   */
  delCate = async (cateId) => {
    const cates = this.state()
      .get('cates')
      .filter((c) => c.get('cateId') != cateId);
    if (cates.count() <= 0) {
      message.error('请至少选择一种签约分类');
      return;
    }
    // 欲删除的分类信息
    const info = this.state()
      .get('cates')
      .filter((f) => f.get('contractCateId'))
      .find((c) => c.get('cateId') == cateId);
    const storeId = this.state().get('storeId');

    const delIds = this.state().get('delCateIds');
    if (info) {
      const { res } = await webApi.checkExsit({ storeId, cateId });
      if (res.code != Const.SUCCESS_CODE) {
        message.error(res.message);
        return;
      }
      this.dispatch('modal: cate: delete', delIds.concat(fromJS([cateId])));
    }
    this.dispatch('modal: cates', cates);
  };

  /**
   * 新增分类
   */
  addCate = (cateId) => {
    const cateSize = this.state().get('cateSize');
    if (cateSize >= 200) {
      message.error('最多可签约200个类目');
      return;
    }
    // 一级分类集合
    const firstLevel = this.state().get('allCates');
    // 二级分类集合
    const secondLevel = firstLevel.flatMap((f) => f.get('goodsCateList'));
    // 三级分类集合
    const thirdLevel = secondLevel.flatMap((f) => f.get('goodsCateList'));
    // 三级分类
    const third = thirdLevel.find((c) => c.get('cateId') == cateId);
    // 当前需要新增的三级分类
    let infos = [];
    if (third) {
      infos = [third];
    }
    // 已存在的分类Id
    const filterIds = this.state()
      .get('cates')
      .map((c) => c.get('cateId'));

    infos = infos
      .map((info) => {
        // 二级分类
        const secondLevelInfo = secondLevel.find(
          (f) => f.get('cateId') == info.get('cateParentId')
        );
        // 一级分类
        const firstLevelInfo = firstLevel.find(
          (f) => f.get('cateId') == secondLevelInfo.get('cateParentId')
        );
        // 设置后台返回的格式类型
        info = info
          .set(
            'parentGoodCateNames',
            firstLevelInfo.get('cateName') +
              '/' +
              secondLevelInfo.get('cateName')
          )
          .set('platformCateRate', info.get('cateRate'))
          .set('cateRate', '');
        return info;
      })
      .filter((f) => filterIds.every((i) => i != f.get('cateId')));
    this.dispatch('modal: cates', this.state().get('cates').concat(infos));
  };

  /**
   * 修改折扣率
   */
  changeRate = ({ rate, cateId }) => {
    const cates = this.state()
      .get('cates')
      .map((c) => {
        if (c.get('cateId') == cateId) {
          c = c.set('cateRate', rate);
        }
        return c;
      });
    this.dispatch('modal: cates', cates);
  };

  /**
   * 修改图片
   */
  changeImg = ({ imgs, cateId }) => {
    const cates = this.state()
      .get('cates')
      .map((c) => {
        if (c.get('cateId') == cateId) {
          c = c.set('qualificationPics', imgs);
        }
        return c;
      });
    this.dispatch('modal: cates', cates);
  };

  /**
   * 保存
   */
  save = async () => {
    const storeId = this.state().get('storeId');
    const delCateIds = this.state().get('delCateIds');
    const cates = this.state()
      .get('cates')
      .map((info) => {
        const qualificationPics =
          info.get('qualificationPics') &&
          JSON.parse(info.get('qualificationPics'));
        info = info.set(
          'qualificationPics',
          (qualificationPics
            ? qualificationPics.map((b) => b.thumbUrl || b.url)
            : []
          ).toString()
        );
        return info;
      });
    const { res } = await webApi.saveSignCate({
      storeId,
      delCateIds,
      cateSaveRequests: cates
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功!');
      this.sortModal();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 上传品牌授权文件
   * @param imgs
   * @param brandId
   */
  changeBrandImg = ({ brandId, contractBrandId, imgs }) => {
    let brandList;
    //修改商家原来的品牌
    if (contractBrandId) {
      brandList = this.state()
        .get('company')
        .get('brandList')
        .map((v) => {
          if (v.get('contractBrandId') == contractBrandId) {
            v = v.set(
              'authorizePic',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    } else {
      //从平台库新增的品牌
      brandList = this.state()
        .get('company')
        .get('brandList')
        .map((v) => {
          if (v.get('brandId') == brandId) {
            v = v.set(
              'authorizePic',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    }
    this.dispatch('detail:updateBrands', brandList);
  };

  /**
   * 财务信息初始化
   * @param id
   * @returns {Promise<void>}
   */
  initAccount = async (companyInfoId) => {
    const { res: account } = await webApi.fetchAccountList(companyInfoId);
    this.transaction(() => {
      this.dispatch('company:account', account.context);
    });
  };

  /**
   * 修改签约日期和类型
   * @returns {Promise<void>}
   */
  renewStore = async () => {
    const brandList = this.state().get('company').get('brandList').toJS();
    const otherBrands = this.state().get('otherBrands').toJS();
    const endDate = this.state()
      .get('company')
      .get('storeInfo')
      .get('contractEndDate');
    const cateList = this.state().get('company').get('cateList');
    if (cateList.toJS().length < 1) {
      message.error('请至少选择一种签约分类');
    } else if (brandList.length + otherBrands.length < 1) {
      message.error('请至少选择一种签约品牌');
    } else if (!endDate) {
      message.error('请选择签约有效期');
    } else {
      const { res } = await webApi.renewStore({
        storeId: this.state().get('storeId'),
        contractStartDate: this.state()
          .get('company')
          .get('storeInfo')
          .get('contractStartDate'),
        contractEndDate: this.state()
          .get('company')
          .get('storeInfo')
          .get('contractEndDate'),
        companyType: this.state()
          .get('company')
          .get('storeInfo')
          .get('companyType')
      });
      if (res.code == Const.SUCCESS_CODE) {
        message.success('保存成功！');
      }
    }
  };

  /**
   * 品牌名称检索
   * @param value
   * @returns {Promise<void>}
   */
  filterBrandName = async (value: string) => {
    const { res } = await webApi.getAllBrands({
      likeBrandName: value
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('company:allBrands', fromJS(res.context));
    }
  };

  /**
   * 获取自营商家的所有仓库
   */
  fetchAllSelfWareHouse = async () => {
    const { res: wareHouses } = await webApi.fetchAllSelfWareHouse();
    if (wareHouses.code == Const.SUCCESS_CODE) {
      this.dispatch('company: warehouses', wareHouses.context.wareHouseVOList);
      this.dispatch(
        'company: setChooseWareHouse',
        wareHouses.context.chooseWareIds
      );
    }
  };

  /**
   * 显示批发市场/商城分类弹窗
   */
  checkboxModal = async (modalType) => {
    let checkBoxDefaultVal = [];
    if (modalType === 0) {
      let allMarkets = this.state().get('allMarkets').toJS();
      if (allMarkets.length === 0) {
        const { res } = await webApi.getAllMarkets({
          pageNum: 0,
          pageSize: 10000
        });
        if (res && res.code === Const.SUCCESS_CODE && res.context) {
          allMarkets = res.context.content || [];
          this.dispatch('company:allMarkets', fromJS(allMarkets));
        }
      }
      const marketList = this.state().get('company').toJS().marketList;
      marketList.forEach((item) => {
        checkBoxDefaultVal.push(Number(item.relationValue));
      });
    } else {
      let allStores = this.state().get('allStores').toJS();
      if (allStores.length === 0) {
        const { res } = await webApi.getAllStores({
          pageNum: 0,
          pageSize: 10000
        });
        if (res && res.code === Const.SUCCESS_CODE && res.context) {
          allStores = res.context.content || [];
          this.dispatch('company:allStores', fromJS(allStores));
        }
      }
      const storeList = this.state().get('company').toJS().storeList;
      storeList.forEach((item) => {
        checkBoxDefaultVal.push(Number(item.relationValue));
      });
    }
    this.transaction(() => {
      this.dispatch('modal: updateDefaultVal', fromJS(checkBoxDefaultVal));
      this.dispatch('modalActor: checkboxModal');
      this.dispatch('modalActor: modalType', modalType);
    });
  };

  /**
   * 关闭批发市场/商城分类弹窗
   */
  closeCheckboxModal = () => {
    this.dispatch('modalActor: checkboxModal');
  };

  /**
   * 保存批发市场/商城分类弹窗
   */
  saveCheckbox = (modalType, values, callback) => {
    let newList;
    if (modalType === 0) {
      let allMarkets = this.state().get('allMarkets').toJS();
      newList = allMarkets
        .filter((item) => values.includes(item.marketId))
        .map((item) => {
          return {
            relationName: item.marketName,
            relationValue: item.marketId
          };
        });
    } else {
      let allStores = this.state().get('allStores').toJS();
      newList = allStores
        .filter((item) => values.includes(item.id))
        .map((item) => {
          return {
            relationName: item.tabName,
            relationValue: item.id
          };
        });
    }
    this.saveMarket(newList, modalType === 0 ? 2 : 1, true, callback);
  };

  /**
   * 保存商家签约的批发市场和商城分类
   */
  saveMarket = async (list, relationType, isClose, callback?) => {
    const storeId = this.state().get('storeId');
    const params = {
      storeId,
      relationType,
      contactRelationList: list
    };
    this.dispatch('modal: checkBoxLoading', true);
    const { res } = await webApi.companyMallSave(params);
    this.dispatch('modal: checkBoxLoading', false);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功!');
      this.transaction(() => {
        this.dispatch(
          relationType === 2 ? 'detail:market' : 'detail:store',
          fromJS(list)
        );
        if (isClose) {
          callback();
          this.dispatch('modalActor: checkboxModal');
        }
      });
    }
  };

  /**
   * 删除批发市场
   */
  delMarket = (rowInfo) => {
    const marketList = this.state().get('company').toJS().marketList;
    const newList = marketList.filter(
      (item) => item.relationValue !== rowInfo.relationValue
    );
    this.saveMarket(newList, 2, false);
  };

  /**
   * 删除商城分类
   */
  delStore = (rowInfo) => {
    const storeList = this.state().get('company').toJS().storeList;
    const newList = storeList.filter(
      (item) => item.relationValue !== rowInfo.relationValue
    );
    this.saveMarket(newList, 1, false);
  };

  /**
   * 存储分账比例和结算周期
   */
  shareInfoChange = (key, value) => {
    this.dispatch('company:setshareInfo', { key, value });
  };

  /**
   * 保存分账比例和结算周期
   */
  saveshareInfo = async () => {
    const storeId = this.state().get('storeId');
    const company = this.state().get('company');
    const params = {
      storeId,
      constructionBankMerchantNumber: company.get(
        'constructionBankMerchantNumber'
      ),
      shareRatio: Number(company.get('shareRatio').toString()),
      settlementCycle: Number(company.get('settlementCycle').toString())
    };
    const { res } = await webApi.saveshareInfo(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('保存成功!');
    } else {
      message.error(res.message);
    }
  };

  //保存商家权限
  saveAuth = async () => {
    const pileState = this.state()
      .get('company')
      .get('storeInfo')
      .get('pileState');
    const jingBiState = this.state()
      .get('company')
      .get('storeInfo')
      .get('jingBiState');
    const presellState = this.state()
      .get('company')
      .get('storeInfo')
      .get('presellState');
    const storeId = this.state().get('storeId');
    const params = {
      storeId,
      pileState,
      jingBiState,
      presellState
    };
    const { res } = await webApi.updatePileState(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('保存成功!');
    } else {
      message.error(res.message);
    }
  };
}
