import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import { Const, history } from 'qmkit';

import SettingActor from './actor/setting-actor';

import * as webApi from '../customer-equities/webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // @ts-ignore
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor()];
  }

  init = async () => {
    const storeId = -1 * this.state().get('activeTab');
    const { res } = (await webapi.getHomedeliveryDesc(storeId)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('setting:init', fromJS(res.context.homeDeliveryVO));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 点击按钮---新增/修改 基本信息
   * @param settings
   * @returns {Promise<void>}
   */
  editSetting = async (_settings) => {
    // 指定专线Editor
    // let editor1 = this.state().get('expensesCostContent');
    // let editor2 = this.state().get('regEditor');
    // let editor3 = this.state().get('refExpressToHomePay');
    // let editor4 = this.state().get('regLogisticsContent');
    // let editor5 = this.state().get('regExpressContent');
    // let editor6 = this.state().get('regPickSelfContent');
    // let editor7 = this.state().get('refDeliveryToStore');
    // const maxLen = 500;
    // // 托运部
    // if (editor1.getContentLength(true) > maxLen) {
    //   message.error(`托运部文案最多输入${maxLen}字`);
    //   return;
    // }
    // // 指定专线
    // if (editor2.getContentLength(true) > maxLen) {
    //   message.error(`指定专线最多输入${maxLen}字`);
    //   return;
    // }
    // // 快递到家(到付)
    // if (editor3.getContentLength(true) > maxLen) {
    //   message.error(`快递到家(到付)最多输入${maxLen}字`);
    //   return;
    // }
    // // 快递到家(自费)
    // if (editor4.getContentLength(true) > maxLen) {
    //   message.error(`快递到家(自费)最多输入${maxLen}字`);
    //   return;
    // }
    // // 同城配送
    // if (editor5.getContentLength(true) > maxLen) {
    //   message.error(`同城配送最多输入${maxLen}字`);
    //   return;
    // }
    // // 自提
    // if (editor6 && editor6.getContentLength(true) > maxLen) {
    //   message.error(`自提最多输入${maxLen}字`);
    //   return;
    // }
    // // 配送到店
    // if (editor7.getContentLength(true) > maxLen) {
    //   message.error(`配送到店最多输入${maxLen}字`);
    //   return;
    // }
    // const edit1Content = editor1.getContent();
    // const edit2Content = editor2.getContent();
    // const edit3Content = editor3.getContent();
    // const edit4Content = editor4.getContent();
    // const edit5Content = editor5.getContent();
    // const edit6Content = editor6 ? editor6.getContent() : '';
    // const edit7Content = editor7.getContent();

    // 普通文本
    const edit1Content = _settings.logisticsContent;
    const edit2Content = _settings.specifyLogisticsContent;
    const edit3Content = _settings.expressArrivedContent;
    const edit4Content = _settings.expressContent;
    const edit5Content = _settings.intraCityLogisticsContent;
    const edit6Content = _settings.doorPickContent;
    const edit7Content = _settings.deliveryToStoreContent;

    const param: any = {};
    param.homeDeliveryId = this.state().getIn(['settings', 'homeDeliveryId']);
    param.storeId = this.state().getIn(['settings', 'storeId']);
    // 托运部
    param.logisticsContent = edit1Content;
    // 指定专线
    param.specifyLogisticsContent = edit2Content;
    // 快递到家(到付)
    param.expressArrivedContent = edit3Content;
    // 快递到家(自费)
    param.expressContent = edit4Content;
    // 同城配送
    param.intraCityLogisticsContent = edit5Content;
    // 自提
    param.doorPickContent = edit6Content;
    // 配送到店
    param.deliveryToStoreContent = edit7Content;
    const { res } = await webapi.saveHomedeliveryDesc(param);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
    } else {
      message.error(res.message);
    }
  };

  //**************富文本开始**********//

  refEditor = (editor) => {
    this.dispatch('setting: regEditor', editor);
  };

  setVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (!this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await webApi.getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await webApi.fetchImages({
      pageNum,
      pageSize: 15,
      resourceName: this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseImgs',
            fromJS(imageList.res.context).get('content').slice(0, successCount)
          );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1 }));
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      cateIdList.push(cateId);
      const secondCateList = cateListIm.filter(
        (item) => item.get('cateParentId') == cateId
      ); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(
          secondCateList.map((item) => item.get('cateId')).toJS()
        );
        const thirdCateList = cateListIm.filter(
          (item) =>
            secondCateList.filter(
              (sec) => item.get('cateParentId') == sec.get('cateId')
            ).size > 0
        ); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(
            thirdCateList.map((item) => item.get('cateId')).toJS()
          );
        }
      }
    }
    return cateIdList;
  };
  //**************富文本结束**********//

  refLogisticsContent = (editor) => {
    this.dispatch('setting: regLogisticsContent', editor);
  };

  refexpensesCostContent = (editor) => {
    this.dispatch('setting: expensesCostContent', editor);
  };

  refExpressContent = (editor) => {
    this.dispatch('setting: regExpressContent', editor);
  };

  refPickSelfContent = (editor) => {
    this.dispatch('setting: regPickSelfContent', editor);
  };

  refDeliveryToStore = (editor) => {
    this.dispatch('setting:refDeliveryToStore', editor);
  };

  refExpressToHomePay = (editor) => {
    this.dispatch('setting:refExpressToHomePay', editor);
  };

  changeActiveTab = (key) => {
    this.dispatch('setting:activeTab', key);
  };
}
