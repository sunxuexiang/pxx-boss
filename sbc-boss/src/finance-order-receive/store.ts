import { Store } from 'plume2';
import ListActor from './actor/list-actor';
import * as webapi from './webapi';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import ViewActor from './actor/view-actor';
import { fromJS } from 'immutable';
import momnet from 'moment';
import { Const, QMMethod } from 'qmkit';
import { isOpacityEffect } from 'html2canvas/dist/types/render/effects';

export default class AppStore extends Store {
  //btn加载
  btnLoading = false;

  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new VisibleActor(),
      new EditActor(),
      new ViewActor(),
      new FormActor()
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
    const searchForm = this.state().get('searchForm').merge(fromJS(param));
    const { res } = await webapi.fetchPayOrderList(searchForm.toJS());

    this.transaction(() => {
      this.btnLoading = false;
      this.dispatch('loading:end');
      this.dispatch('list:init', res);
      this.dispatch('current', param && param.pageNum + 1);
      this.dispatch('select:init', []);
    });
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = QMMethod.onceFunc(async () => {
    const param = this.state().get('searchForm').toJS();

    const { res } = await webapi.fetchPayOrderList(param);

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', res);
      this.dispatch('current', 1);
    });
  }, 1000);

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 批量
   */
  onBatchConfirm = async () => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/confirm',
      'POST'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    let selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择订单');
      return;
    }
    selected = this.state()
      .get('dataList')
      .filter(
        (data) =>
          selected.includes(data.get('payOrderId')) &&
          data.get('payOrderStatus') == 2
      )
      .map((data) => data.get('payOrderId'));
    if (selected.count() <= 0) {
      this.successMsgThenInit();
      return;
    }

    const { res } = await webapi.confirm(selected.toJS());
    this.messageByResult(res);
  };

  /**
   * 显示驳回弹框
   */
  showRejectModal = (tids,mergFlag) => {
    if(mergFlag){
      let arr=this.payOrderInfo(tids);
      Promise.all(arr).then(res=>{
        this.dispatch('form:order:info:list',fromJS(res));
        this.dispatch('order:list:reject:show');
      });
    }else{
      this.dispatch('order:list:reject:show');
      this.dispatch('form:order:info:list',fromJS([]));
    }
  };
  /**
   * 显示确认弹框
   */
  showcomfigModal = (tids,mergFlag) => {
    if(mergFlag){
      let arr=this.payOrderInfo(tids);
      Promise.all(arr).then(res=>{
        this.dispatch('form:order:info:list',fromJS(res));
        this.dispatch('order:list:comfig:show');
      });
    }else{
      this.dispatch('order:list:comfig:show');
      this.dispatch('form:order:info:list',fromJS([]));
    }
  };
  
  /**
   *关闭确认弹框
   */
  hidecomfigModal = () => {
    this.dispatch('order:list:comfig:hide');
  };

  /**
   *关闭驳回弹框
   */
  hideRejectModal = () => {
    this.dispatch('order:list:reject:hide');
  };
  

  onAudit_cart = async (tid: string, audit: string, reason?: string) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    if (!this.btnLoading) {
      this.btnLoading = true;
      //set loading true
      // this.dispatch('detail-actor:setButtonLoading', true)

      const { res } = await webapi.auditcart_(tid, audit, reason);
      this.hideRejectModal();
      if (res.code == Const.SUCCESS_CODE) {
        message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
        this.init();
      } else {
        message.error(
          res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败')
        );
        this.btnLoading = false;
        //set loading false
        // this.dispatch('detail-actor:setButtonLoading', false)
      }
    }
  };

  onAudit = async (tid: string, audit: string, reason?: string,mergFlag?:boolean) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    if (!this.btnLoading) {
      this.btnLoading = true;
       // true为合并订单支付有散批普通零售
      if(mergFlag){
        let {orderInfoList}=this.state().toJS();
        if(orderInfoList.every((item)=>item.activityType=='0')){
          // 都是状态是0的情况下
          let obj={
            ids:orderInfoList.map(item=>item.orderCode),
            auditState:audit,
            reason:reason,
            financialFlag:true
          };
          let {res}= await webapi.auditIds(obj);
          this.hideRejectModal();
          if (res.code == Const.SUCCESS_CODE) {
            message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
            this.init();
          } else {
            message.error(
              res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败')
             );
            this.btnLoading = false;
          };

        }else{

          //以下是合并订单是（activityType不同类型请求不同接口）因为activityType都是0所以暂不考虑
          let ids = (orderInfoList||[]).map(item=>{
            return {tid:item.orderCode,audit:audit,reason:reason,financialFlag:true,activityType:item.activityType}
          });
          let arr=this.apiAudit(ids);
          Promise.all(arr).then(async(res1)=>{
            this.hideRejectModal();
            let res=res1[0];
            if (res.code == Const.SUCCESS_CODE) {
              message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
              this.init();
            } else {
              message.error(
                res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败')
              );
              this.btnLoading = false;
            }
          });

        }
        return
      }else{

        const { res } = await webapi.audit(tid, audit, reason);
        this.hideRejectModal();
        if (res.code == Const.SUCCESS_CODE) {
          message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
          this.init();
        } else {
          message.error(
            res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败')
          );
          this.btnLoading = false;
          //set loading false
          // this.dispatch('detail-actor:setButtonLoading', false)
        }

      }
    }
  };

   

  onNewAudit = async (tid: string, audit: string, reason?: string) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    if (!this.btnLoading) {
      this.btnLoading = true;
      //set loading true
      // this.dispatch('detail-actor:setButtonLoading', true)

      const { res } = await webapi.newAudit(tid, audit, reason);
      this.hideRejectModal();
      if (res.code == Const.SUCCESS_CODE) {
        message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
        this.init();
      } else {
        message.error(
          res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败')
        );
        this.btnLoading = false;
        //set loading false
        // this.dispatch('detail-actor:setButtonLoading', false)
      }
    }
  };

  // 合并订单确认请求的操作
  apiAudit=(list)=>{
    return  list.map(item=>{
        return new Promise(async(resolve,reject)=>{
          let res;
          if (item.activityType == '0') {
            res = await webapi.auditcart_(item.tid, item.audit, item.reason);
          } else if(item.activityType == '3'){
            res = await webapi.newAudit(item.tid, item.audit, item.reason);
          }else {
            res = await webapi.audit(item.tid, item.audit, item.reason);
          }
          if(res.res){
            resolve({...res});
          }else{
            reject('没有订单信息')
          }
        })
      })
  };
  
  //修改订单信息实付金额
  onOrderInfoList=(index,key,value)=>{
    let list=this.state().get('orderInfoList').toJS();
    list[index][key]=value;
    this.dispatch('form:order:info:list',fromJS(list));
  };

  /**
   * 批量作废
   * @returns {Promise<void>}
   */
  onBatchDestory = async () => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/payOrder/destory',
      'PUT'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择订单');
      return;
    }
    const orderIds = this.state()
      .get('dataList')
      .filter((data) => selected.includes(data.get('payOrderId')))
      .map((data) => data.get('orderCode'));

    for (let orderId of orderIds) {
      const { res: verifyRes } = await webapi.verifyAfterProcessing(orderId);

      if (
        verifyRes.code === Const.SUCCESS_CODE &&
        verifyRes.context.length > 0
      ) {
        message.error('订单已申请退货，不能作废收款记录');
        return;
      }
    }

    const { res } = await webapi.destory(selected.toJS());
    this.messageByResult(res);
  };

  onConfirm = async (id, activityType,realPay?,mergFlag?) => {
    
    await this.dispatch('loading:start');
    
    if(mergFlag){
      // true为合并订单支付有散批普通零售
      
      let {orderInfoList}=this.state().toJS();
      let ids = (orderInfoList||[]).map(item=>{
        return {payOrderId:item.payOrderId,realPay:item.commenasdt,activityType:item.activityType}
      });

      if(orderInfoList.every((item)=>item.activityType=='0')){
        var { res } = await webapi.confirmIds(ids);
        await this.messageByResult(res);
        await this.transaction(() => {
          this.dispatch('loading:end');
        });
      }else{
        //以下是合并订单是（activityType不同类型请求不同接口）因为activityType都是0所以暂不考虑
        let arr=this.apiConfirm(ids);
        Promise.all(arr).then(async(res1)=>{
          await this.messageByResult(res1[0].res);
          await this.transaction(() => {
            this.dispatch('loading:end');
          });
        });

      }
      return
    }
    
    if (activityType == '2') {
      var { res } = await webapi.th_confirm(id, realPay);
    } else if(activityType == '3'){
      var { res } = await webapi.newOfflineConfirm(id, realPay) ;
    }else {
      var { res } = await webapi.confirm(id, realPay);
    }
    await this.messageByResult(res);
    await this.transaction(() => {
      this.dispatch('loading:end');
    });
  };

  // 合并订单确认请求的操作
  apiConfirm=(list)=>{
    return  list.map(item=>{
        return new Promise(async(resolve,reject)=>{
          let res;
          if (item.activityType == '2') {
            res = await webapi.th_confirm(item.payOrderId, item.realPay);
          } else if(item.activityType == '3'){
            res = await webapi.newOfflineConfirm(item.payOrderId, item.realPay);
          }else {
            res = await webapi.confirm(item.payOrderId, item.realPay);
          }
          if(res.res){
            resolve({...res});
          }else{
            reject('没有订单信息')
          }
        })
      })
  };


  onDestory = async (id) => {
    let ids = [];
    ids.push(id);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(
      this.state()
        .get('dataList')
        .find((data) => data.get('payOrderId') === id)
        .get('orderCode')
    );
    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('订单已申请退货，不能作废收款记录');
      return;
    }
    const { res } = await webapi.destory(ids);
    this.messageByResult(res);
  };

  onCreateReceivable = async (payOrderId,tids,mergFlag) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/receivable',
      'POST'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }
    const { res } = await webapi.offlineAccounts();
    this.dispatch('offlineAccount', fromJS(res));
    if(!mergFlag){
      this.dispatch('offlineAccount:payOrderId', payOrderId);
      this.dispatch('form:order:info:list',fromJS([]));
      this.dispatch('modal:show');
      return
    };
    
    let arr=this.payOrderInfo(tids);
    Promise.all(arr).then(res=>{
      this.dispatch('form:order:info:list',fromJS(res));
      this.dispatch('offlineAccount:payOrderId', res.map(item=>item.payOrderId).join());
      this.dispatch('modal:show');
    });

  };

  // 订单信息列表
  payOrderInfo=(list)=>{
    return  list.map(item=>{
        return new Promise(async(resolve,reject)=>{
          let {res}:any=await webapi.fetchPayOrderList({orderCode:item});
          if(res.payOrderResponses){
            resolve({...res.payOrderResponses[0]});
          }else{
            reject('没有订单信息')
          }
        })
      })
  };

  onCancel = async () => {
    this.dispatch('modal:hide');
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  }

  /**
   * 保存
   * @param receivableForm
   * @returns {Promise<void>}
   */
  onSave = async (receivableForm) => {
    receivableForm.payOrderIds = this.state().get('payOrderId')?this.state().get('payOrderId').split(','):[];
    receivableForm.createTime = momnet(receivableForm.createTime)
      .format('YYYY-MM-DD')
      .toString();
    //保存
    const { res } = await webapi.addReceivable(receivableForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.dispatch('modal:hide');
      this.init({});
    } else {
      message.error(res.message);
    }
  };

  /**
   * 操作成功提示
   */
  successMsgThenInit = () => {
    message.success('操作成功');
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 查看
   * @param {string} id
   */
  onView = (id: string) => {
    const receive = this.state()
      .get('dataList')
      .find((receive) => receive.get('payOrderId') == id);

    this.transaction(() => {
      this.dispatch('receive:receiveView', receive);
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
