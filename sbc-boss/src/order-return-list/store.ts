import { Store } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { util, Const } from 'qmkit';
import TabActor from './actor/tab-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import LoadingActor from './actor/loading-actor';
import * as webapi from './webapi';
import { Modal } from 'antd';
const { confirm } = Modal;
export default class AppStore extends Store {
  bindActor() {
    return [
      new TabActor(),
      new ListActor(),
      new FormActor(),
      new LoadingActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }
  onWareHousePage = async () => {
    let res1 = await webapi.wareHousePage({ pageNum: 0, pageSize: 10000 });
    if (res1.res.code === Const.SUCCESS_CODE) {
      this.dispatch('start-form', {
        key: 'warehouseList',
        value: fromJS(res1.res.context?.wareHouseVOPage?.content || [])
      });
    } else {
      message.error(res1.res.message);
      return;
    }
  };
  init = async (
    { pageNum, pageSize, flushSelected } = {
      pageNum: 0,
      pageSize: this.state().get('pageSize') || 10,
      flushSelected: true
    }
  ) => {
    this.dispatch('order-return-list:loading:start');
    //获取form数据
    let form = this.state().get('form').toJS();
    const key = this.state().getIn(['tab', 'key']);

    if (key != '0') {
      form['returnFlowState'] = key.split('-')[1];
    }
    if (form.presellFlag === 0) {
      form.presellFlag = false;
    } else if (form.presellFlag === 1) {
      form.presellFlag = true;
    }
    webapi
      .fetchOrderReturnList({ ...form, pageNum, pageSize })
      .then(({ res }) => {
        if (res.code === Const.SUCCESS_CODE) {
          res.context.content.forEach((el) => {
            const iDs = [];
            el.returnItems.concat(el.returnGifts).forEach((child) => {
              if (iDs.indexOf(child.skuId) === -1) {
                iDs.push(child.skuId);
              }
            });
            el.specNumber = iDs.length;
          });
          this.transaction(() => {
            this.dispatch('order-return-list:loading:end');
            this.dispatch('order-return-list:init', {
              flushSelected: flushSelected,
              ...res.context
            });
            this.dispatch(
              'order-return-list:page',
              fromJS({ currentPage: pageNum + 1, pageSize })
            );
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('order-return-list:loading:end');
          }
        }
      });
  };
  onStartForm = (key, value) => {
    this.dispatch('start-form', { key, value });
  };
  onSearchFormChange = (searchFormParams) => {
    this.dispatch('order-return-list:form:field', searchFormParams);
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    if (__DEV__) {
      console.log('params--->', params);
    }
    this.dispatch('order-return-list:form:field', params);
    this.init();
  };

  onTabChange = (key) => {
    this.dispatch('order-return-list:tab:init', key);
    this.init();
  };

  // 驳回／拒绝收货 modal状态改变
  onRejectModalChange = (status) => {
    this.dispatch('order-return-list:reject-modal:change', fromJS(status));
  };

  onRejectModalHide = () => {
    this.dispatch('order-return-list:reject-modal:hide');
  };

  // 填写物流 modal状态改变
  onDeliverModalChange = (status) => {
    this.dispatch('order-return-list:deliver-modal:change', fromJS(status));
  };

  onDeliverModalHide = () => {
    this.dispatch('order-return-list:deliver-modal:hide');
  };

  // 线下退款 modal状态改变
  onRefundModalChange = (status) => {
    let statusList = ['INIT', 'GROUPON', 'AUDIT', 'DELIVERED_PART'];
    if (
      status.mergFlag &&
      statusList.some((item) => item == status.flowState)
    ) {
      let arr = this.payOrderInfo(status.tids || []);
      Promise.all(arr).then((res) => {
        res = res.filter((item) => item.id);
        let t = res.filter((item) => item?.tid?.includes('L'));
        if (t.length && res.length) {
          res.filter((item) => {
            if (item.tid.includes('L')) {
              if (
                (item.returnFlowState === 'RECEIVED' ||
                  (item.returnType == 'REFUND' &&
                    item.returnFlowState === 'AUDIT')) &&
                item.refundStatus === 3
              ) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          });
        }
        if (
          res.every(
            (item) =>
              (item.returnFlowState === 'RECEIVED' ||
                (item.returnType == 'REFUND' &&
                  item.returnFlowState === 'AUDIT')) &&
              item.refundStatus === 3
          )
        ) {
          status.orderInfoList = fromJS(res.filter((item1) => item1.id));
          this.dispatch(
            'order-return-list:refund-modal:change',
            fromJS(status)
          );
        } else {
          if (res.length) {
            confirm({
              title: '操作提示',
              content: `该订单为合并支付订单，订单“${res
                .map((item) => item.tid)
                .join()}”的退款申请商家后台未审核通过，请先审核再来确认退款。`,
              onOk() {},
              onCancel() {}
            });
          } else {
            confirm({
              title: '操作提示',
              content: `该订单为合并支付订单,订单“${t
                .map((item) => item.tid)
                .join()}”的退款申请商家后台未审核通过，请先审核再来确认退款。`,
              onOk() {},
              onCancel() {}
            });
          }
        }
      });
    } else {
      status.mergFlag = false;
      this.dispatch('order-return-list:refund-modal:change', fromJS(status));
    }
  };

  // 订单信息列表
  payOrderInfo = (list) => {
    return list.map((item) => {
      return new Promise(async (resolve, reject) => {
        let { res }: any = await webapi.fetchOrderReturnList({ tid: item });
        if (res.code == Const.SUCCESS_CODE) {
          resolve(
            res.context.content.length
              ? { ...res.context.content[0] }
              : { tid: item }
          );
        } else {
          reject('没有订单信息');
        }
      });
    });
  };

  onRefundModalHide = () => {
    this.dispatch('order-return-list:refund-modal:hide');
  };

  // 线下退款 modal状态改变
  onExportModalChange = (status) => {
    this.dispatch('order-return-list:export-modal:change', fromJS(status));
  };

  onExportModalHide = () => {
    this.dispatch('order-return-list:export-modal:hide');
  };

  // 是否打开弹出框
  updataModalvisible = (blo: boolean) => {
    this.dispatch('order-return-list:modal-visible', blo);
  };
  // 收货物品详情
  updateReturnGoodsList = (obj) => {
    this.dispatch('order-return-list:return-goods-list', obj);
  };
  // 收货的ID
  updateCurrentId = (id) => {
    this.dispatch('order-return-list:return-goods-id', id);
  };
  // 确认收货
  onSupplierReceive = async (id) => {
    const { res } = await webapi.supplierReceive({ rid: id });
    if (res.code === Const.SUCCESS_CODE) {
      this.updateCurrentId('');
      this.updataModalvisible(false);
      this.updateReturnGoodsList([]);
      message.success('收货成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onAudit = (rid: string) => {
    return webapi.audit(rid).then(() => {
      this.init();
    });
  };

  onBatchAudit = (ids: string[]) => {
    return webapi.batchAudit(ids).then(() => {
      message.success('批量审核操作成功');
      this.init();
    });
  };

  onReject = (rid: string, reason: string) => {
    return webapi.reject(rid, reason).then(() => {
      this.init();
    });
  };

  onDeliver = (rid: string, values) => {
    return webapi.deliver(rid, values).then(() => {
      this.init();
    });
  };

  onReceive = (rid: string) => {
    return webapi.receive(rid).then(() => {
      this.init();
    });
  };

  onBatchReceive = (ids: string[]) => {
    return webapi.batchReceive(ids).then(() => {
      this.init();
    });
  };

  onRejectReceive = (rid: string, reason: string) => {
    return webapi.rejectReceive(rid, reason).then(() => {
      this.init();
    });
  };

  onRejectRefund = (rid: string, reason: string) => {
    return webapi.rejectRefund(rid, reason).then(() => {
      this.init();
    });
  };

  onCheckFunAuth = async (url: string, type: string) => {
    return await webapi.checkFunctionAuth(url, type);
  };

  onOnlineRefund = (rid: string) => {
    return webapi.refundOnline(rid).then((result) => {
      const { res } = result;
      const code = res.code;
      const errorInfo = res.message;

      // 提示异常信息
      if (code != Const.SUCCESS_CODE) {
        message.error(errorInfo);
      } else {
        // 退款的回调是异步的，立刻刷新页面可能退单的状态还没有被回调修改。所以先给个提示信息，延迟3秒后再刷新列表
        message.success('操作成功');
      }

      setTimeout(this.init, 3000);
    });
  };

  onOfflineRefund = (rid: string, formData: any) => {
    let { refundModalData } = this.state().toJS();
    if (refundModalData.mergFlag) {
      let tids = refundModalData.orderInfoList.map((item) => item.id);
      return webapi.refundOfflineTids({ tids, ...formData }).then((result) => {
        const { res } = result;
        const code = res.code;
        const errorInfo = res.message;
        // 提示异常信息
        if (code != Const.SUCCESS_CODE) {
          message.error(errorInfo);

          if (code === 'K-040017') {
            throw Error('K-040017');
          }
        } else {
          message.success('操作成功');
        }
        this.init();
      });
    } else {
      return webapi.refundOffline(rid, formData).then((result) => {
        const { res } = result;
        const code = res.code;
        const errorInfo = res.message;
        // 提示异常信息
        if (code != Const.SUCCESS_CODE) {
          message.error(errorInfo);

          if (code === 'K-040017') {
            throw Error('K-040017');
          }
        } else {
          message.success('操作成功');
        }
        this.init();
      });
    }
  };

  /**
   * 关闭退款
   * @param {string} rid
   * @returns {Promise<void>}
   */
  onCloseRefund = (rid: string) => {
    return webapi.closeRefund(rid).then((result) => {
      const { res } = result;
      const code = res.code;
      const errorInfo = res.message;

      if (code != Const.SUCCESS_CODE) {
        message.error(errorInfo);
      } else {
        message.success('操作成功');
      }
      this.init();
    });
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('order-return-list:checkAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('order-return-list:check', {
      index,
      checked
    });
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    let selected = this.state().get('selected');

    if (selected.count() === 0) {
      message.error('请选择要导出的数据');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    let disabled = this.state().getIn(['exportModalData', 'disabled']);
    return this._onExport({ rids: selected.toJS() }, disabled);
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<IAsyncResult<TResult>>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state().get('form').toJS();
    // tab
    const key = this.state().getIn(['tab', 'key']);
    if (key != '0') {
      params['returnFlowState'] = key.split('-')[1];
    }
    let disabled = this.state().getIn(['exportModalData', 'disabled']);
    return this._onExport(params, disabled);
  };

  _onExport = (params: {}, disabled) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          let exportHref;
          if (disabled) {
            exportHref =
              Const.HOST + `/return/export/detail/params/${encrypted}`;
          } else {
            exportHref = Const.HOST + `/return/export/params/${encrypted}`;
          }
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 查询可退金额
   * @param {string} rid
   */
  getCanRefundPrice = async (rid: string) => {
    return await webapi.getCanRefundPrice(rid);
  };

  /**
   * 校验退款单的状态，是否已经在退款处理中
   * @param {string} rid
   * @returns {Promise<IAsyncResult<any>>}
   */
  checkRefundStatus = async (rid: string) => {
    return await webapi.checkRefundStatus(rid);
  };

  /**
   * 查询客户线下账户
   * @returns {Promise<void>}
   */
  queryCustomerOfflineAccount = async (rId: string) => {
    const { res: customerOfflineAccount } =
      await webapi.queryOfflineCustomerAccountByReturnId(rId);
    const { code, context } = customerOfflineAccount;
    if (code != Const.SUCCESS_CODE) {
      message.error('查询线下账户失败');
      return;
    }

    this.dispatch('order-return-list:customer-offline-account', {
      all: `${context.customerAccountName} ${context.customerBankName} ${context.customerAccountNo}`,
      name: context.customerAccountName,
      bank: context.customerBankName,
      no: context.customerAccountNo
    });
  };

  /**
   * 是否导出子单号
   */
  onExportBySonTrade = () => {
    this.dispatch('list:export-modal:son');
  };
}
