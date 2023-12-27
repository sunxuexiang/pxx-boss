import { IOptions, Store } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';

import { history, Const } from 'qmkit';

import GoodsActor from './actor/goods-actor';
import ModalActor from './actor/modal-actor';

import {
  getBrandList,
  getCateList,
  getGoodsDetail,
  getStoreCateList,
  getStoreInfo,
  getUserLevelList,
  getUserList,
  auditPass,
  auditReject,
  auditForbid,
  getPropsByCateId,
  fetchBossCustomerList
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new GoodsActor(), new ModalActor()];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {};

  /**
   * 商品禁用
   * @returns {Promise<void>}
   */
  handleAuditForbid = async (reason: string) => {
    this.dispatch('goodsActor: saveLoading', true);
    const storeId = this.state().getIn(['goods', 'storeId']);
    const goodsId = this.state().getIn(['goods', 'goodsId']);
    const result: any = await auditForbid(storeId, goodsId, reason);
    if (result.res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.goBack();
    }
    this.dispatch('goodsActor: saveLoading', false);
  };

  modalForbidShow = () => {
    this.dispatch('modal: forbid-visible', true);
  };

  modalForbidConfirm = async (reason: string) => {
    await this.handleAuditForbid(reason);
    this.dispatch('modal: forbid-visible', false);
  };

  modalForbidHide = () => {
    this.dispatch('modal: forbid-visible', false);
  };
}
