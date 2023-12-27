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
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor()];
  }

  init = async () => {
    const result: any = await Promise.all([
      webapi.fetchhomeDeliverySetting({ settingKey: 'BALANCEEXPLAIN' }),
      webapi.fetchhomeDeliverySetting({ settingKey: 'WITHDRAWDEPOSITEXPLAIN' })
    ]);
    if (
      result[0].res.code == Const.SUCCESS_CODE &&
      result[1].res.code == Const.SUCCESS_CODE
    ) {
      const res1 = result[0].res.context.response[0];
      const res2 = result[1].res.context.response[0];
      let obj = {
        expensesCostContent: res1.settingValue,
        content: res2.settingValue,
        list: result[0].res.context.response.concat(
          result[1].res.context.response
        )
        // expensesCostContentMent:  res.context.response[2].settingKey == 'BALANCEAGREEMENT' ? res.context.response[2].settingValue : res.context.response[1].settingValue,
      };
      this.dispatch('setting:init', fromJS(obj));
    } else if (result[0].res.code != Const.SUCCESS_CODE) {
      message.error(result[0].res.message);
    } else if (result[1].res.code != Const.SUCCESS_CODE) {
      message.error(result[1].res.message);
    }
  };

  /**
   * 点击按钮---新增/修改  基本信息
   * @param settings
   * @returns {Promise<void>}
   */
  editSetting = async (settings) => {
    let editor = this.state().get('regEditor');
    if (editor && editor.getContent && editor.getContentLength(true) > 500) {
      return;
    }

    let expensesCostContent = this.state().get('expensesCostContent');
    if (
      expensesCostContent &&
      expensesCostContent.getContent &&
      expensesCostContent.getContentLength(true) > 500
    ) {
      return;
    }
    let expensesCostContentMent = this.state().get('expensesCostContentMent');
    if (
      expensesCostContentMent &&
      expensesCostContentMent.getContent &&
      expensesCostContentMent.getContentLength(true) > 500
    ) {
      return;
    }

    // settings.homeDeliveryId = this.state().getIn([
    //   'settings',
    //   'homeDeliveryId'
    // ]);
    // settings.content = editor.getContent ? editor.getContent() : '';
    // settings.expensesCostContent = expensesCostContent.getContent
    //   ? expensesCostContent.getContent()
    //   : '';
    let walletSetting = [];
    if (this.state().get('settings')) {
      this.state()
        .get('settings')
        .toJS()
        .list.forEach((element) => {
          if (element.settingKey == 'BALANCEEXPLAIN') {
            element.settingValue = expensesCostContent.getContent
              ? expensesCostContent.getContent()
              : '';
            // element.type = element.settingKey;
            // delete element.settingValue;
            // delete element.settingKey;
            walletSetting.push(element);
          } else if (element.settingKey == 'WITHDRAWDEPOSITEXPLAIN') {
            element.settingValue = editor.getContent ? editor.getContent() : '';
            walletSetting.push(element);
          } else if (element.settingKey == 'BALANCEAGREEMENT') {
            element.settingValue = expensesCostContentMent.getContent
              ? expensesCostContentMent.getContent()
              : '';
            walletSetting.push(element);
          }
        });
    }

    const { res } = await webapi.editHomeDeliverySetting({
      response: walletSetting
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
      this.init();
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
  refexpensesCostContentMent = (editor) => {
    this.dispatch('setting: expensesCostContentMent', editor);
  };

  refExpressContent = (editor) => {
    this.dispatch('setting: regExpressContent', editor);
  };

  refPickSelfContent = (editor) => {
    this.dispatch('setting: regPickSelfContent', editor);
  };
}
