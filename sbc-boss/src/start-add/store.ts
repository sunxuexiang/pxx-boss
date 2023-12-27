import { Store } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const, history } from 'qmkit';
import { message, Modal } from 'antd';
import { IList } from 'typings/globalType';

import * as webapi from './webapi';
import RegisteredActor from './actor/registered-actor';
import ImageActor from './actor/image-actor';

const info = Modal.info;

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new RegisteredActor(),
    new ImageActor()
    ];
  }

  /**
 * 设置form参数
 */
  editSettings = (field, value) => {
    console.log(field, value, 'field, valuefield, value');

    this.dispatch('setting:editSettings', { field, value });
  };

  /**
   * 修改表单信息
   */
  changeFormField = (params) => {
    this.dispatch('change: form: field', fromJS(params));
  };
  /**
 * 修改商品图片
 */
  editImages = (images: IList) => {
    console.log(images, 'imagesimages');

    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  changeCouponTotalCount = (index, totalCount) => {
    this.dispatch('change: coupon: total: count', { index, totalCount });
  };

  /**
   * 批量选择优惠券
   */
  onChosenCoupons = (coupons) => {
    this.dispatch('choose: coupons', fromJS(coupons));
  };

  /**
   * 删除优惠券
   */
  onDelCoupon = (couponId) => {
    this.dispatch('del: coupon', couponId);
  };

  init = async (activityId) => {
    if (activityId) {
      await this.editInit(activityId);
    }
  };

  /**
   * 编辑初始化
   */
  editInit = async (advertisingId) => {
    // 1.查询活动详情
    const { res } = await webapi.getActivityDetail({
      advertisingId: advertisingId
    });
    console.log(res.context, '789456789');

    if (res.code == Const.SUCCESS_CODE) {
      let activity = {} as any;
      const homeacTive = res.context;

      // 2.格式化数据
      // 2.1.基础信息
      // 商品图片
      let images = fromJS([{
        uid: 1,
        name: '通栏图',
        size: 1,
        status: 'done',
        url: homeacTive.imageUrl
      }])
      this.editImages(images);
      activity.imageUrl = homeacTive.imageUrl
      activity.advertisingId = homeacTive.advertisingId;
      activity.advertisingName = homeacTive.advertisingName;
      activity.effectDate = homeacTive.effectDate;
      activity.allSubjectColor = homeacTive.backgroundColor;
      activity.tiem = homeacTive.effectType;
      activity.status = homeacTive.status;

      activity.selectedRows = [];
      activity.jumpLink = {}
      activity.jumpLink.isSuit = homeacTive.linkFlag ? homeacTive.linkFlag : 0
      if (homeacTive.mofangName) {
        activity.jumpLink = {
          isSuit: homeacTive.linkFlag,
          title: homeacTive.mofangName,
          pageCode: homeacTive.mofangCode
        }
        activity.selectedRows.push(activity.jumpLink)
      }
      // activity.advertisingConfigList = homeacTive.advertisingConfigList;
      // 3.设置状态
      this.dispatch('edit: init', fromJS(activity));
    }
  };

  /**
   * 新增/编辑优惠券
   */
  save = async () => {
    // 1.从state中获取数据
    let activity = this.state()
      .get('activity')
      .toJS();
    let imageList = this.state()
      .get('images')
      .toJS();
    if (imageList.length <= 0) {
      message.error('请上传通栏图片');
      return
    }
    if (activity.allSubjectColor == '#eee') {
      message.error('设置启动页背景色号');
      return
    }
    console.log(activity, 'activityactivity', imageList);

    if (activity.jumpLink.isSuit) {
      if (!activity.jumpLink.pageCode) {
        message.error('请设置跳转链接');
        return
      }
    }
    // return
    // 2.格式化数据
    let params = {} as any;
    params.advertisingName = activity.advertisingName;
    params.backgroundColor = activity.allSubjectColor;
    params.effectType = activity.tiem;
    params.linkFlag = activity.jumpLink.isSuit ? activity.jumpLink.isSuit : 0;

    if (activity.tiem == 1) {
      params.effectDate = activity.effectDate;
    }
    params.imageUrl = imageList[0] ? imageList[0].response ? imageList[0].response[0] : imageList[0].url : '';

    params.mofangName = activity.jumpLink.title ? activity.jumpLink.title : '';
    params.mofangCode = activity.jumpLink.pageCode ? activity.jumpLink.pageCode : '';
    params.status = activity.status;
    // 3.提交
    let res = null;
    if (activity.advertisingId) {
      params.advertisingId = activity.advertisingId;
      res = await webapi.modifyCouponActivity(params);
    } else {
      res = await webapi.addCouponActivity(params);
    }
    res = res.res;
    if (res.code == Const.SUCCESS_CODE) {
      message.success(activity.advertisingId ? '修改成功' : '保存成功');
      history.push({
        pathname: '/start-up'
      });
    } else {
      message.error(res.message);
    }
  };
}
