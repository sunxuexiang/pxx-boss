import { Actor, Action, IMap } from 'plume2';

export default class FreightStoreActor extends Actor {
  defaultState() {
    return {
      // 模板Id
      freightTempId: 0,
      // 模板名称
      freightTempName: '',
      // 地区Ids
      destinationArea: [],
      // 计费规则
      freightType: 0,
      // 不满*元
      satisfyPrice: 0,
      // 运费
      satisfyFreight: 0,
      // 固定运费
      fixedFreight: 0,
      // 已被选中的区域Id
      selectedAreas: [],
      // 是否默认 1: 默认 0: 非默认
      defaultFlag: 0,
      // 发货地区名字
      destinationAreaName: []
    };
  }

  /**
   * 修改指定字段值
   *
   * @param {IMap} state
   * @param {any} { field, value }
   * @returns
   * @memberof FreightStoreActor
   */
  @Action('freight: store: field: value')
  storeFreightFieldsValue(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 初始化店铺运费模板
   * @param state
   * @param param1
   */
  @Action('freight: init')
  init(
    state: IMap,
    {
      freightTempName,
      destinationArea,
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      selectedAreas,
      destinationAreaName,
      freightTempId,
      defaultFlag
    }
  ) {
    return state
      .set('freightTempName', freightTempName)
      .set('destinationArea', destinationArea)
      .set('freightType', freightType)
      .set('satisfyPrice', satisfyPrice)
      .set('satisfyFreight', satisfyFreight)
      .set('fixedFreight', fixedFreight)
      .set('destinationAreaName', destinationAreaName)
      .set('selectedAreas', selectedAreas)
      .set('freightTempId', freightTempId)
      .set('defaultFlag', defaultFlag);
  }
}
