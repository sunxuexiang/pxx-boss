import { Action, Actor, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      applicationPageName: [], //应用场景
      beginTime: '', //开始时间
      endTime: '', //结束时间
      popupName: '', //弹窗名称
      popupUrl: [], //图片地址
      radioKey: 0,
      radioTimes: 1,
      launchFrequency: '', //投放频次
      // 上传的logo图片
      images: [],
      jumpPage: '',
      sizeType: 0, //是否全屏展示 0-否 1-是
      //仓库列表
      warehouseList:[],
      //仓库id
      wareId:null,
    };
  }

  constructor() {
    super();
  }

  /**
   * 修改radio状态
   * @param state
   */
  @Action('changeInfo:radioKey')
  changeInfo(state: IMap, value) {
    return state.set('radioKey', value);
  }


     @Action('start-from')
     startForm(state: IMap, {key,value}) {
       return state.set(key, value);
     }

  /**
   *
   * @param state
   */
  @Action('changeInfo:JumpPage')
  changeInfoJumpPage(state: IMap, value) {
    return state.set('jumpPage', value);
  }
  /**
   * 修改频率
   * @param state
   */
  @Action('changeInfo:times')
  changeTimes(state: IMap, value) {
    return state.set('radioTimes', value);
  }
  /**
   * 图片地址
   * @param state
   */
  @Action('changeInfo:images')
  changeUploadFile(state: IMap, value) {
    return state.set('images', value);
  }

  /**
   * 修改应用界面
   * @param state
   */
  @Action('changeInfo:applicationPageName')
  onChangeCheckBox(state: IMap, value) {
    return state.set('applicationPageName', value);
  }
  /**
   * 修改应用界面
   * @param state
   */
  @Action('changeInfo:changeTime')
  onChangeDate(state: IMap, value) {
    return state
      .set('beginTime', value.beginTime)
      .set('endTime', value.endTime);
  }
  /**
   * 修改是否全屏展示
   * @param state
   */
  @Action('changeInfo:isFull')
  changeIsFull(state: IMap, value) {
    return state.set('sizeType', value);
  }
}
