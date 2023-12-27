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
* 修改商品图片
*/
  editImages1 = (images: IList) => {

    this.dispatch('imageActor: editImages1', images);
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

  init = async (wareId,activityId) => {
    if (activityId) {
      await this.editInit(wareId,activityId);
    }
  };

  /**
   * 编辑初始化
   */
  editInit = async (wareId,advertisingId) => {
    // 1.查询活动详情
    const { res } = await webapi.getActivityDetail({
      wareId:wareId,
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
        name: '左侧图',
        size: 1,
        status: 'done',
        url: homeacTive.advertisingConfigList[0].advertisingImage
      }])
      let images1 = fromJS([{
        uid: 1,
        name: '右侧图',
        size: 1,
        status: 'done',
        url: homeacTive.advertisingConfigList[1].advertisingImage
      }])
      this.editImages(images);
      this.editImages1(images1);
      activity.advertisingId = homeacTive.advertisingId;
      activity.advertisingName = homeacTive.advertisingName;
      activity.advertisingType = homeacTive.advertisingType;
      activity.sortNum = homeacTive.sortNum;
      activity.imageUrl = homeacTive.advertisingConfigList[0].advertisingImage;
      activity.imageUrl1 = homeacTive.advertisingConfigList[1].advertisingImage;
      activity.wareId=homeacTive.wareId||wareId
      // activity.jumpLink = homeacTive.advertisingConfigList[0].jumpLink;
      // activity.jumpLink1 = homeacTive.advertisingConfigList[1].jumpLink;
      activity.selectedRows = [];
      activity.selectedRows1 = [];
      activity.jumpLink = {};
      activity.jumpLink1 = {};
      activity.jumpLink.isSuit = homeacTive.advertisingConfigList[0].isSuit ? homeacTive.advertisingConfigList[0].isSuit : 0
      if (homeacTive.advertisingConfigList[0].moFangAdvertisingName) {
        activity.jumpLink = {
          isSuit: homeacTive.advertisingConfigList[0].isSuit,
          title: homeacTive.advertisingConfigList[0].moFangAdvertisingName,
          pageCode: homeacTive.advertisingConfigList[0].moFangPageCode
        }
        activity.selectedRows.push(activity.jumpLink);
      }
      activity.jumpLink1.isSuit1 = homeacTive.advertisingConfigList[1].isSuit ? homeacTive.advertisingConfigList[1].isSuit : 0
      if (homeacTive.advertisingConfigList[1].moFangAdvertisingName) {
        activity.jumpLink1 = {
          isSuit1: homeacTive.advertisingConfigList[1].isSuit,
          title: homeacTive.advertisingConfigList[1].moFangAdvertisingName,
          pageCode: homeacTive.advertisingConfigList[1].moFangPageCode
        }
        activity.selectedRows1.push(activity.jumpLink1)
      }
      activity.advertisingConfigList = homeacTive.advertisingConfigList;
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
    let imageList1 = this.state()
      .get('images1')
      .toJS();
    if (imageList.length <= 0) {
      message.error('请上传分栏左侧图');
      return
    }
    if (imageList1.length <= 0) {
      message.error('请上传分栏右侧图');
      return
    }
    // console.log(activity, 'activityactivity', imageList);
    // if (!activity.jumpLink.title && activity.jumpLink.isSuit == 0) {
    //   message.error('请设置左侧图跳转链接');
    //   return
    // }
    // if (!activity.jumpLink1.title && activity.jumpLink1.isSuit1 == 0) {
    //   message.error('请设置右侧图跳转链接');
    //   return
    // }

    // 2.格式化数据
    let params = {} as any;
    params.advertisingName = activity.advertisingName;
    params.sortNum = activity.sortNum;
    params.advertisingType = 1;
    params.wareId=activity.wareId;
    // 3.提交
    let res = null;
    if (activity.advertisingId) {
      params.advertisingId = activity.advertisingId;
      params.advertisingConfigList = [{
        advertisingImage: imageList[0] ? imageList[0].response ? imageList[0].response[0] : imageList[0].url : '',
        jumpLink: '',
        isSuit: activity.jumpLink.isSuit ? activity.jumpLink.isSuit : 0,
        advertisingId: activity.advertisingConfigList[0].advertisingId,
        advertisingConfigId: activity.advertisingConfigList[0].advertisingId,
        moFangAdvertisingName: activity.jumpLink.title,
        moFangPageCode: activity.jumpLink.pageCode
      }];
      params.advertisingConfigList.push({
        advertisingImage: imageList1[0] ? imageList1[0].response ? imageList1[0].response[0] : imageList1[0].url : '',
        jumpLink: '',
        advertisingId: activity.advertisingConfigList[1].advertisingId,
        advertisingConfigId: activity.advertisingConfigList[1].advertisingId,
        moFangAdvertisingName: activity.jumpLink1.title,
        isSuit: activity.jumpLink1.isSuit1 ? activity.jumpLink1.isSuit1 : 0,
        moFangPageCode: activity.jumpLink1.pageCode
      })
      res = await webapi.modifyCouponActivity(params);
    } else {
      params.advertisingConfigList = [{
        advertisingImage: imageList[0] ? imageList[0].response ? imageList[0].response[0] : imageList[0].url : '',
        jumpLink: '',
        moFangAdvertisingName: activity.jumpLink.title,
        isSuit: activity.jumpLink.isSuit ? activity.jumpLink.isSuit : 0,
        moFangPageCode: activity.jumpLink.pageCode
      }];
      params.advertisingConfigList.push({
        advertisingImage: imageList1[0] ? imageList1[0].response ? imageList1[0].response[0] : imageList1[0].url : '',
        jumpLink: '',
        moFangAdvertisingName: activity.jumpLink1.title,
        isSuit: activity.jumpLink1.isSuit1 ? activity.jumpLink1.isSuit1 : 0,
        moFangPageCode: activity.jumpLink1.pageCode
      })
      res = await webapi.addCouponActivity(params);
    }
    res = res.res;
    if (res.code == Const.SUCCESS_CODE) {
      message.success(activity.advertisingId ? '修改成功' : '保存成功');
      history.push({
        pathname: '/pagehome-adtt',
        state: { wareId: activity.wareId }
      });
    } else {
      message.error(res.message);
    }
  };
}
