import { Actor, Action, IMap } from 'plume2';
import { fromJS, List, Map } from 'immutable';
declare type IList = List<any>;

export default class CompanyActor extends Actor {
  defaultState() {
    return {
      randomKey: 1,
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
        storeInfo: {
          //是否重置密码 0 否 1 是
          isResetPwd: false
        },
        contractBrandList: [], //原始的签约品牌，首次加载时获取，对该项不做任何操作
        offlineAccount: [], //结算银行账户
        selfWareHouses: [],
        shareRatio: '', //交易手续费
        settlementCycle: '' //结算周期
      },
      allBrands: [], //所有品牌
      tempBrands: [], //容器
      otherBrands: [{ key: 1, brandName: '', nickName: '' }],
      delBrandIds: [], //存放已签约的而被删除的品牌ID的集合
      allMarkets: [], //平台所有批发市场
      allStores: [] //平台所有商城分类
    };
  }

  /**
   * 设置当前tab页面
   */
  @Action('company: tab: set')
  setTab(state, tab) {
    return state.set('momentTab', tab);
  }

  /**
   * 刷新tab
   */
  @Action('company: tab: key')
  setRandomKey(state) {
    return state.set('randomKey', state.get('randomKey') + 1);
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
   * 存储工商信息单个字段
   * @param state
   * @param param1
   */
  @Action('company: merge: info')
  mergeInfo(state, { field, value }) {
    return state.setIn(['company', 'info', field], value);
  }

  /**
   * 签约分类
   * @param state
   * @param cateList
   * @returns {Map<K, V>}
   */
  @Action('detail:cate')
  cateList(state: IMap, cateList: IList) {
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
   * 平台所有品牌
   * @param state
   * @param brandList
   * @returns {IMap}
   */
  @Action('company:allBrands')
  allBrands(state: IMap, brandList: IList) {
    return state.set('allBrands', brandList);
  }

  /**
   * 平台所有品牌
   * @param state
   * @param brandList
   * @returns {IMap}
   */
  @Action('company:tempBrands')
  tempBrands(state: IMap, brandList: IList) {
    return state.set('tempBrands', brandList);
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
   * 存储商家基本信息单个字段
   * @param state
   * @param param1
   */
  @Action('company: store: merge')
  onChange(state, { field, value }) {
    return state.setIn(['company', 'storeInfo', field], value);
  }

  /**
   * 添加(删除)品牌
   * @param state
   * @param brandObj
   */
  @Action('detail:newBrand')
  addBrand(state, brandArray: IList) {
    return state.setIn(['company', 'brandList'], brandArray);
  }

  /**
   * 添加（删除）自定义品牌
   * @param state
   * @param otherBrandArray
   */
  @Action('detail:addNewBrand')
  addNewBrand(state, otherBrandArray: IList) {
    return state.set('otherBrands', otherBrandArray);
  }

  /**
   * 重置brandList
   * @param state
   * @param brandList
   * @returns {any}
   */
  @Action('detail:updateBrands')
  updateBrands(state: IMap, brandList: IList) {
    return state.setIn(['company', 'brandList'], fromJS(brandList));
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
   * 删除的品牌ID进行存储
   * @param state
   * @param brandIdArray
   */
  @Action('detail:deleteBrand')
  deleteBrand(state, brandIdArray: IList) {
    return state.set('delBrandIds', brandIdArray);
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
      if (v.goodsBrand) {
        v.goodsBrand.contractBrandId = v.contractBrandId;
        v.goodsBrand.authorizePic =
          v.authorizePic &&
          v.authorizePic.split(',').map((v, i) => {
            return Map({ uid: i, size: 1, url: v, status: 'done' });
          });
        brandArray.push(v.goodsBrand);
      } else {
        //待审核的（商家新增的）
        if (v.checkBrand) {
          v.checkBrand.contractBrandId = v.contractBrandId;
          v.checkBrand.authorizePic =
            v.authorizePic &&
            v.authorizePic.split(',').map((v, i) => {
              return Map({ uid: i, size: 1, url: v, status: 'done' });
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

  /**
   * 平台所有批发市场
   * @param state
   * @param marketList
   * @returns {IMap}
   */
  @Action('company:allMarkets')
  allMarkets(state: IMap, marketList: IList) {
    return state.set('allMarkets', marketList);
  }

  /**
   * 平台所有商城分类
   * @param state
   * @param storeList
   * @returns {IMap}
   */
  @Action('company:allStores')
  allStores(state: IMap, storeList: IList) {
    return state.set('allStores', storeList);
  }

  /**
   * 存储分账比例和结算周期
   */
  @Action('company:setshareInfo')
  setshareInfo(state: IMap, obj) {
    return state.setIn(['company', obj.key], fromJS(obj.value));
  }
}
