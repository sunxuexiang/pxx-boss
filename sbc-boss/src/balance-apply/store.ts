import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const, util } from 'qmkit';
import { message } from 'antd';
// import moment from 'moment';
import * as webapi from './webapi';
import CouponListActor from './actor/coupon-list-actor';
// import { T } from 'antd/lib/upload/utils';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponListActor()];
  }

  receivableBut = async () => {
    // let receivableList=this.state().get('receivableList');
    // if(receivableList.size){ return}
    let { res } = (await webapi.fetchAllOfflineAccounts()) as any;
    this.dispatch('actor: field', {
      key: 'receivableList',
      value: fromJS(res)
    });
    // if (res.code == Const.SUCCESS_CODE) {
    // }else{
    //   message.error(res.message);
    // }
  };

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state()
      .get('searchForm')
      .toJS();
    let extractStatus = this.state().get('extractStatus');
    if (extractStatus == '0') {
      extractStatus = null;
    }
    const { res } = await webapi.couponList({
      ...query,
      extractStatus,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    if (res.context?.ticketsFormQueryPage) {
      // res.context.ticketsFormQueryPage.content.forEach(element => {
      //   element.auditTime = element.auditTime ? element.auditTime.slice(0, -4) : '-';
      //   element.applyTime = element.applyTime ? element.applyTime.slice(0, -4) : '-';
      // });
      this.dispatch('selectedRowKeys: set', fromJS([]));
      this.dispatch('TextArearmak', '');
      this.dispatch('init', {
        couponList: res.context.ticketsFormQueryPage?.content,
        total: res.context.ticketsFormQueryPage?.totalElements,
        pageNum: pageNum + 1
      });
    }
  };

  /**
   * 客服审核
   */
  serviceVisibleBut = debounce(() => {
    this.customerReview();
  }, 500);

  customerReview = async () => {
    let { formId } = this.state()
      .get('pageRow')
      .toJS();
    let { forms } = this.state().toJS();
    let formObj = { ...forms, formIds: [formId] };
    let { res } =
      forms.type == 1
        ? await webapi.ticketsFormAdopt(formObj)
        : await webapi.ticketsFormReject({ ...formObj, extractStatus: 4 });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
      message.success('操作成功');
      this.onActorFiledChange('isServiceVisible', false);
    }
  };

  /**
   * 财务审核
   */

  // 打开和关闭修改凭证  false/true
  setVoucherVisible = (key) => {
    this.dispatch('voucherModalVisible', key);
  };

  financialVisibleBut = debounce(() => {
    this.financialReview();
  }, 500);

  financialReview = async () => {
    let { formId } = this.state()
      .get('pageRow')
      .toJS();
    let obj = this.state()
      .get('forms')
      .toJS();
    if (obj.type == 2) {
      obj.extractStatus = 4;
    } else if (obj.type == 3) {
      obj.extractStatus = 5;
    }
    if (obj?.images?.length) {
      obj.ticketsFormPaymentVoucherImgList = [...obj.images];
      delete obj['images'];
    } else {
      obj.ticketsFormPaymentVoucherImgList = [];
    }
    let { res } =
      obj.type == 1
        ? await webapi.ticketsFormRechargeAdopt({ ...obj, formIds: [formId] })
        : await webapi.ticketsFormReject({ ...obj, formIds: [formId] });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      this.setButtonLoading(false);
    } else {
      this.init();
      message.success('操作成功');
      this.onActorFiledChange('isFinancialVisible', false);
      this.setButtonLoading(false);
    }
  };

  // 修改凭证
  updataImgSubmit = async (imgList) => {
    let { formId } = this.state()
      .get('pageRow')
      .toJS();
    let { res } = await webapi.updateImgAfterReject({
      ticketsFormPaymentVoucherImgList: [...imgList],
      formIds: [formId]
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
      message.success(res.message);
      this.setVoucherVisible(false);
    }
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.dispatch('selectedRowKeys: set', '');
    this.onSelect([]);
    this.init();
  };

  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('search:form: field', { key, value });
  };

  // onSelect = (list) => {
  //   this.dispatch('select:init', list);
  // };

  onActorFiledChange = (key, value) => {
    this.dispatch('actor: field', { key, value });
  };

  /**
   * 设置勾选的多个id
   */
  onSelect = (checkedIds) => {
    this.dispatch('selectedRowKeys: set', fromJS(checkedIds));
  };

  /**
   * 打开导出弹框
   */
  onExportModalShow = (exportModalData) => {
    this.dispatch(
      'info:exportModalShow',
      fromJS({
        ...exportModalData,
        visible: true,
        exportByParams: this.onExportByParams,
        exportByIds: this.onExportByIds,
        exportByAll: this.onExportByAll
      })
    );
  };

  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };

  // 按钮的loading的开关
  setButtonLoading = (blo) => {
    this.dispatch('button: loading', blo);
  };

  /**
   * 按全部导出
   */
  onExportByAll = () => {
    const extractStatus = this.state().get('extractStatus');
    return this._onExport({
      extractStatus: extractStatus == 0 ? null : extractStatus
    });
  };

  /**
   * 按勾选的信息进行导出
   */
  onExportByIds = () => {
    const checkedIds = this.state()
      .get('selectedRowKeys')
      .toJS();
    const extractStatus = this.state().get('extractStatus');
    if (checkedIds.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }
    return this._onExport({
      stockoutIdList: checkedIds,
      extractStatus: extractStatus == 0 ? null : extractStatus
    });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const extractStatus = this.state().get('extractStatus');
    const searchParams = this.state()
      .get('searchForm')
      .toJS();
    return this._onExport({
      ...searchParams,
      extractStatus: extractStatus == 0 ? null : extractStatus
    });
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = (window as any).token || '';
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref =
            Const.HOST + `/ticketsForm/ticketsFormAllListExport/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve(null);
      }, 500);
    });
  };

  // /**
  //  * 删除优惠券
  //  */
  // deleteCoupon = async (id) => {
  //   const { res } = await webapi.deleteCoupon(id);
  //   if (res.code != Const.SUCCESS_CODE) {
  //     message.error(res.message);
  //     return;
  //   }
  //   message.success('删除成功');
  //   //刷新页面
  //   this.init();
  // };
  // isVisibleBut = (is, row) => {
  //   console.log(row, '123456');
  //   if (is == true) {
  //     this.dispatch('modal:isVisible', { is: is, item: { ...row } });
  //     return;
  //   }
  //   this.dispatch('modal:isVisible', { is: is, item: {} });
  // };

  // /**
  //  * 复制优惠券
  //  */
  // copyCoupon = async (id) => {
  //   const { res } = await webapi.copyCoupon(id);
  //   if (res.code != Const.SUCCESS_CODE) {
  //     message.error(res.message);
  //     return;
  //   }
  //   message.success('复制成功');
  //   //刷新页面
  //   this.init();
  // };
}

function debounce(func, wait = 500) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
