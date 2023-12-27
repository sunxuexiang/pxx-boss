import { Action, Actor, IMap } from 'plume2';
import { List, fromJS, Map } from 'immutable';
declare type IList = List<any>;
export default class DetailActor extends Actor {
  defaultState() {
    return {
      momentTab: '1',
      storeId: null,
      companyInfoId: null,
      company: {
        info: {}, //工商信息
        cateList: [], //签约分类
        brandList: [], //签约品牌
        marketList: [], //签约批发市场
        storeList: [], //签约商城分类
        checkBrand: [], //商家自增品牌
        //商家基本信息
        storeInfo: {},
        offlineAccount: [], //结算银行账户
        accountDays: [], //结算日
        wareHourseIds: []
      },
      checkInfo: {
        //审核信息
        auditState: null, //审核状态
        auditReason: '', //驳回原因
        contractStartDate: '', //签约开始日期
        contractEndDate: '', //签约结束日期
        companyType: null, //商家类型
        constructionBankMerchantNumber: '', //建行商家编号
        shareRatio: '', //交易手续费
        settlementCycle: '' //结算周期
      },
      delBrandIds: [], //存放已签约的而被删除的品牌ID的集合
      sameBrands: [],
      sameModalVisible: false, //相同品牌弹框显示或隐藏
      selfWareHouses: []
    };
  }

  /**
   * 商家工商信息
   */
  @Action('company: info')
  info(state, info) {
    const businessLicence =
      fromJS(info).get('businessLicence') &&
      fromJS(info)
        .get('businessLicence')
        .split(',')
        .map((url, index) => {
          return Map({ uid: index + 1, status: 'done', url });
        });
    const frontIDCard =
      fromJS(info).get('frontIDCard') &&
      fromJS(info)
        .get('frontIDCard')
        .split(',')
        .map((url, index) => {
          return Map({ uid: index + 1, status: 'done', url });
        });
    const backIDCard =
      fromJS(info).get('backIDCard') &&
      fromJS(info)
        .get('backIDCard')
        .split(',')
        .map((url, index) => {
          return Map({ uid: index + 1, status: 'done', url });
        });
    const warehouseImage =
      fromJS(info).get('warehouseImage') &&
      fromJS(info)
        .get('warehouseImage')
        .split(',')
        .map((url, index) => {
          return Map({ uid: index + 1, status: 'done', url });
        });
    const doorImage =
      fromJS(info).get('doorImage') &&
      fromJS(info)
        .get('doorImage')
        .split(',')
        .map((url, index) => {
          return Map({ uid: index + 1, status: 'done', url });
        });
    info = fromJS(info)
      .set('businessLicence', JSON.stringify(businessLicence))
      .set('frontIDCard', JSON.stringify(frontIDCard))
      .set('backIDCard', JSON.stringify(backIDCard))
      .set('warehouseImage', warehouseImage && JSON.stringify(warehouseImage))
      .set('doorImage', doorImage && JSON.stringify(doorImage));

    return state.setIn(['company', 'info'], info);
  }

  /**
   * 设置当前tab页面
   */
  @Action('company: tab: set')
  setTab(state, tab) {
    return state.set('momentTab', tab);
  }

  /**
   * 签约分类
   * @param state
   * @param cateList
   * @returns {Map<K, V>}
   */
  @Action('detail:cate')
  cateList(state: IMap, cateList) {
    let cateArray = cateList.map((v) => {
      v = v.set(
        'cateRate',
        v.get('cateRate') ? v.get('cateRate') : v.get('platformCateRate')
      );
      return v;
    });
    return state.setIn(['company', 'cateList'], cateArray);
  }

  /**
   * 区分平台已有和商家自增
   * @param state
   * @param info
   * @returns {Map<string, V>}
   */
  @Action('detail:twoBrandKinds')
  twoBrandKinds(state: IMap, brandList: IList) {
    //扁平化处理
    let brandArray = new Array();
    let checkBrandArray = new Array();
    brandList.toJS().map((v) => {
      //已审核的（平台已有的）
      if (v.goodsBrand && !v.checkBrand) {
        v.goodsBrand.contractBrandId = v.contractBrandId;
        v.goodsBrand.authorizePic =
          v.authorizePic &&
          v.authorizePic.split(',').map((v, i) => {
            return Map({ uid: i, size: 1, url: v });
          });
        brandArray.push(v.goodsBrand);
      } else {
        //待审核的（商家新增的）
        if (v.checkBrand) {
          v.checkBrand.contractBrandId = v.contractBrandId;
          v.checkBrand.authorizePic =
            v.authorizePic &&
            v.authorizePic.split(',').map((v, i) => {
              return Map({ uid: i, size: 1, url: v });
            });
          checkBrandArray.push(v.checkBrand);
        }
      }
    });
    return state
      .setIn(['company', 'brandList'], fromJS(brandArray))
      .setIn(['company', 'checkBrand'], fromJS(checkBrandArray));
  }

  /**
   * 签约品牌
   * @param state
   * @param brandList
   * @returns {Map<K, V>}
   */
  @Action('detail:brand')
  brandList(state: IMap, brandList: IList) {
    //扁平化处理
    let brandArray = new Array();
    //已审核，品牌不存在平台和商家自增之分
    brandList.toJS().map((v) => {
      if (v.goodsBrand) {
        v.goodsBrand.authorizePic = v.authorizePic;
        brandArray.push(v.goodsBrand);
      }
    });
    return state.setIn(['company', 'brandList'], fromJS(brandArray));
  }

  /**
   * 商家基本信息
   */
  @Action('store: info')
  storeInfo(state: IMap, info) {
    return state
      .setIn(['company', 'storeInfo'], fromJS(info))
      .set('storeId', fromJS(info).get('storeId'))
      .set('companyInfoId', fromJS(info).get('companyInfoId'));
  }

  /**
   * 相同品牌的进行组装
   * @param state
   * @param sameBrands
   * @returns {IMap}
   */
  @Action('detail:sameBrands')
  sameBrands(state: IMap, sameBrands) {
    let sameBrandsArray = new Array();
    sameBrands.map((v) => {
      //表示自定义的品牌与平台品牌重复
      if (v.checkBrand && v.goodsBrand) {
        v.checkBrand.authorizePic = v.authorizePic;
        v.checkBrand.source = '商家';
        v.goodsBrand.source = '平台';
        v.checkBrand.brandName = v.checkBrand.name;
        sameBrandsArray.push(v.checkBrand, v.goodsBrand);
      }
    });
    return state.set('sameBrands', fromJS(sameBrandsArray));
  }

  /**
   *  显示（隐藏）存在相同品牌的提示框
   * @param state
   * @returns {IMap}
   */
  @Action('detail:sameModal')
  sameModal(state: IMap) {
    return state.set('sameModalVisible', true);
  }

  /**
   * 审核信息字段填充
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('detail:supplier:check')
  checkInfo(state: IMap, { field, value }) {
    return state.setIn(['checkInfo', field], value);
  }

  /**
   * 结算银行账户
   * @param state
   * @param account
   * @returns {Map<K, V>}
   */
  @Action('company:account')
  initAccount(state: IMap, account) {
    return state.setIn(['company', 'offlineAccount'], fromJS(account));
  }

  /**
   * 结算日
   * @param state
   * @param accountDay
   * @returns {Map<K, V>}
   */
  @Action('company:accountDay')
  initAccountDay(state: IMap, accountDay) {
    return state.setIn(
      ['company', 'accountDays'],
      fromJS(
        accountDay.get('accountDay')
          ? accountDay.get('accountDay').split(',')
          : []
      )
    );
  }

  /**
   * 银行列表
   * @param state
   * @param account
   * @returns {Map<K, V>}
   */
  @Action('company: warehouses')
  initWareHouses(state: IMap, wareHouses) {
    return state.set('selfWareHouses', fromJS(wareHouses));
  }

  /**
   * 设置选中的分仓
   * @param state
   * @param companyType
   */
  @Action('company: setChooseWareHouse')
  setChooseWareHouse(state: IMap, wareHouseIds) {
    return state.setIn(['company', 'wareHourseIds'], wareHouseIds);
  }

  /**
   * 签约批发市场
   * @param state
   * @param marketList
   * @returns {Map<K, V>}
   */
  @Action('detail:market')
  marketList(state: IMap, marketList: IList) {
    return state.setIn(['company', 'marketList'], marketList);
  }

  /**
   * 签约商城分类
   * @param state
   * @param storeList
   * @returns {Map<K, V>}
   */
  @Action('detail:store')
  storeList(state: IMap, storeList: IList) {
    return state.setIn(['company', 'storeList'], storeList);
  }
}
