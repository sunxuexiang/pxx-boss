import { Store } from 'plume2';
import ListActor from './actor/list-actor';

import * as webapi from './webapi';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import ViewActor from './actor/view-actor';
import { fromJS } from 'immutable';
import RefuseActor from './actor/refuse-actor';
import { Const } from 'qmkit';
import { Modal } from 'antd';
const { confirm } = Modal;
export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new VisibleActor(),
      new EditActor(),
      new RefuseActor(),
      new ViewActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (param?) => {
    this.dispatch('loading:start');
    param = this.state()
      .get('searchForm')
      .merge(fromJS(param))
      .toJS();
    Promise.all([
      webapi.fetchRefundOrderList(param),
      webapi.offlineAccounts()
    ]).then((res) => {
      if (res[0].res.code != Const.SUCCESS_CODE) {
        message.error(res[0].res.message);
      }
      if (res[1].res.code != Const.SUCCESS_CODE) {
        message.error(res[1].res.message);
      }
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res[0].res.context);
        this.dispatch('offlineAccounts', res[1].res.context);
        this.dispatch('current', param && param.pageNum + 1);
      });
    });
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async () => {
    const param = this.state()
      .get('searchForm')
      .toJS();

    this.init(param);
    this.dispatch('current', 1);
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.confirm();
    this.messageByResult(res);
  };

  onDestory = async (returnOrderCode) => {
    const { res } = await webapi.destory(returnOrderCode);
    this.messageByResult(res);
  };

  onCreateRefund = async (
    customerId,
    refundId,
    returnOrderCode,
    returnPrice,
    activityType,
    mergFlag,tids
  ) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/return/refund/*/online',
      'POST'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }
    
    if(mergFlag){//合并支付的订单
      // let arr=this.payOrderInfo(tids||[]);
      let {res}:any=await webapi.refundOrderList({tids});
      if(res.code==Const.SUCCESS_CODE){
          if((res.context?.data||[]).every(item=>(item.platform === 'CUSTOMER'&&item.activityType==0&& item.refundStatus === 3 ))){
            if(activityType == '2') {
              await this.th_queryCustomerOfflineAccount(returnOrderCode,activityType);
            }else {
              await this.queryCustomerOfflineAccount(returnOrderCode);
            }
          const res1 = await webapi.fetchAccountsByCustomerId(customerId);
          this.dispatch('customerAccounts', fromJS(res1.res));
          this.dispatch('refundId', refundId);
          this.dispatch('offlineAccount:customerId', customerId);
          this.dispatch('returnOrderCode', returnOrderCode);
          this.dispatch('edit:returnAmount', returnPrice);
          this.dispatch('mergFlag', mergFlag);  
          this.dispatch('orderInfoList', fromJS(res.context?.data||[]));  
          this.dispatch('modal:show');
        }else{
          confirm({
            title: '操作提示',
            content: `该订单为合并支付订单，订单“${(tids||[]).join()}”的退款申请商家后台未审核通过，请先审核再来确认退款。`,
            onOk() { },
            onCancel() {},
          });
        }
      }else{
        message.error(res.message);
      }
      // Promise.all(arr).then(async(res)=>{
      //   if(res.every(item=>(item.platform === 'CUSTOMER'&&item.activityType==0&& item.refundStatus === 3 ))){
      //     const { res } = await webapi.fetchAccountsByCustomerId(customerId);
      //     this.dispatch('customerAccounts', fromJS(res));
      //     this.dispatch('refundId', refundId);
      //     this.dispatch('offlineAccount:customerId', customerId);
      //     this.dispatch('returnOrderCode', returnOrderCode);
      //     this.dispatch('edit:returnAmount', returnPrice);
      //     this.dispatch('mergFlag', mergFlag);  
      //     this.dispatch('orderInfoList', fromJS(res));  
      //     this.dispatch('modal:show');
      //   }else{
      //     confirm({
      //       title: '操作提示',
      //       content: `该订单为合并支付订单，订单“${res.map(item=>item.tid).join()}”的退款申请商家后台未审核通过，请先审核再来确认退款。`,
      //       onOk() { },
      //       onCancel() {},
      //     });
      //   }
      // });
    }else{//单个订单
      if(activityType == '2') {
        await this.th_queryCustomerOfflineAccount(returnOrderCode,activityType);
      }else {
        await this.queryCustomerOfflineAccount(returnOrderCode);
      }

      const { res } = await webapi.fetchAccountsByCustomerId(customerId);
      this.dispatch('customerAccounts', fromJS(res));
      this.dispatch('refundId', refundId);
      this.dispatch('offlineAccount:customerId', customerId);
      this.dispatch('returnOrderCode', returnOrderCode);
      this.dispatch('edit:returnAmount', returnPrice);
      this.dispatch('modal:show');
    }

    
  };

  // // 订单信息列表
  // payOrderInfo=(list)=>{
  //   return  list.map(item=>{
  //       return new Promise(async(resolve,reject)=>{
  //         let {res}:any=await webapi.refundOrderList({item});
  //         if(res.code==Const.SUCCESS_CODE){
  //           resolve({...res.context[0]});
  //         }else{
  //           reject('没有订单信息')
  //         }
  //       })
  //     })
  // };

  /**
   * 在线支付退款
   * @param returnOrderCode
   * @returns {Promise<void>}
   */
  onCreateOnlineRefund = async (returnOrderCode,activityType) => {
    console.log(activityType,'activityTypeactivityType');
    let res;
    if(activityType == '2') {
       res= await webapi.th_refundOnline(returnOrderCode);
    }else {
      res = await webapi.refundOnline(returnOrderCode);
    }
    this.messageByResult(res.res);
    // 考虑网关延迟
    setTimeout(() => {
      this.onSearch();
    }, 3000);
  };

  onCancel = async () => {
    this.dispatch('modal:hide');
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  }

  /**
   * 保存
   * @param refundForm
   * @returns {Promise<void>}
   */
  onSave = async (refundForm) => {
    refundForm.createTime = refundForm.createTime.format(Const.DATE_FORMAT);
    refundForm.offlineAccountId = refundForm.accountId;
    refundForm.customerId = this.state().get('refundOfflineCustomerId');
    if(this.state().get('mergFlag')){
      refundForm.tids=this.state().get('orderInfoList').toJS()[0].tids;
    }
    //保存
   if(this.state().toJS().activityType == '2') {
    webapi
    .th_refundOffline(this.state().get('returnOrderCode'), refundForm)
    .then((result) => {
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
      this.dispatch('modal:hide');
      this.init();
    });
   }else {
    webapi
    .refundOffline(this.state().get('returnOrderCode'), refundForm)
    .then((result) => {
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

      this.dispatch('modal:hide');

      this.init();
    });
   }
  };

  /**
   * 选中的账户id
   * @param accountId
   */
  onSelectAccountId = (accountId: string) => {
    this.dispatch('offlineAccount:selectedAccountId', accountId);
  };

  /**
   * 显示拒绝退款弹窗
   */
  onCreateRefuse = async (refundId: string) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/refundOrders/refuse',
      'PUT'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    this.dispatch('refuse:refundId', refundId);
    this.dispatch('refuse:show');
  };

  /**
   * 隐藏拒绝退款
   */
  onCancelRefuse = () => {
    this.dispatch('refuse:hide');
  };

  /**
   * 拒绝原因
   * @param reason
   */
  onChangeReason = (reason: string) => {
    this.dispatch('refuseReason', reason);
  };

  /**
   * 添加拒绝退款
   * @returns {Promise<void>}
   */
  saveRefuse = async () => {
    const refuseForm = this.state()
      .get('refuseForm')
      .toJS();
    const { res } = await webapi.saveRefuse(refuseForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.transaction(() => {
        this.dispatch('refuse:hide');
        this.dispatch('current', 1);
        this.init();
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 校验退款单的状态，是否已经在退款处理中
   * @param {string} rid
   * @returns {Promise<IAsyncResult<any>>}
   */
  checkRefundStatus = async (rid: string) => {
    return await webapi.checkRefundStatus(rid);
  };

  // 囤货
  th_checkRefundStatus = async (rid: string) => {
    return await webapi.th_checkRefundStatus(rid);
  };

  /**
   * 查询客户线下账户
   * @returns {Promise<void>}
   */
  queryCustomerOfflineAccount = async (rId: string) => {
    const {
      res: customerOfflineAccount
    } = await webapi.queryOfflineCustomerAccountByReturnId(rId);
    const { code, context } = customerOfflineAccount;
    if (code != Const.SUCCESS_CODE) {
      message.error('查询线下账户失败');
      return;
    }
    const account = context as any;

    this.dispatch('offlineAccount:customer-offline-account', {
      all: `${account.customerAccountName} ${account.customerBankName} ${
        account.customerAccountNo
        }`,
      name: account.customerAccountName,
      bank: account.customerBankName,
      no: account.customerAccountNo
    });
  };

  th_queryCustomerOfflineAccount = async (rId: string,activityType:any) =>  {
    const {
      res: customerOfflineAccount
    } = await webapi.th_queryOfflineCustomerAccountByReturnId(rId);
    const { code, context } = customerOfflineAccount;
    if (code != Const.SUCCESS_CODE) {
      message.error('查询线下账户失败');
      return;
    }
    const account = context as any;

    this.dispatch('offlineAccount:customer-offline-account', {
      all: `${account.customerAccountName} ${account.customerBankName} ${
        account.customerAccountNo
        }`,
        activityType,
      name: account.customerAccountName,
      bank: account.customerBankName,
      no: account.customerAccountNo
    });
  };

  /**
   * 查看
   * @param {string} id
   */
  onView = (id: string) => {
    const refund = this.state()
      .get('dataList')
      .find((refund) => refund.get('refundId') == id);

    this.transaction(() => {
      this.dispatch('refund:refundView', refund);
      this.dispatch('viewModal:show');
    });
  };

  /**
   * 隐藏视图
   */
  onViewHide = () => {
    this.dispatch('viewModal:hide');
  };
}
