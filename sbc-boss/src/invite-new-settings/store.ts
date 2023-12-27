import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import Form from './actor/form';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new Form(),
    ];
  }

  init = async () => {
    const {res}:any=await webapi.invitationGetConfig();
    if(res.code===Const.SUCCESS_CODE){
      this.onStateEditNewForm('newCustomersBuyLimit',res.context?.newCustomersBuyLimit);
      this.onStateEditRulesForm('invitationRules',res.context?.invitationRules);
      this.onStateEditNewForm('oldCustomersBuyLimit',res.context?.oldCustomersBuyLimit);
    }else{
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (value) => {
    this.dispatch('state:edit',{key:'isRewardRecorded',value:value});
    // this.init();
  };

  //修改actor里一级变量
  onStateEdit=(key,value)=>{
    this.dispatch('state:edit',{key,value});
  };
  //修改NewForm里一级变量
  onStateEditNewForm=(key,value)=>{
    this.dispatch('state:edit:newForm',{key,value});
  };

  //修改rulesForm里一级变量
  onStateEditRulesForm=(key,value)=>{
    this.dispatch('state:edit:rulesForm',{key,value});
  };

  //修改oldForm里一级变量
  onStateEditOldForm=(key,value)=>{
    this.dispatch('state:edit:oldForm',{key,value});
  };

  refexpensesCostContent = (editor) => {
    this.dispatch('setting: expensesCostContent', editor);
  };


  //保存
  onSave=async()=>{
    let obj={};
    let {isRewardRecorded,newForm,oldForm,rulesForm}=this.state().toJS();
    if(isRewardRecorded==='1'){
      obj=newForm;
    }else if(isRewardRecorded==='2'){
      obj=oldForm;
    }else{
      let invitationRules = this.state().get('invitationRules');
      if (
        invitationRules &&
        invitationRules.getContent &&
        invitationRules.getContentLength(true) > 500
      ) {
        return;
      }
      
      rulesForm.invitationRules = invitationRules.getContent
      ? invitationRules.getContent()
      : '';
      obj=rulesForm;
    }
    // obj=isRewardRecorded==='1'?newForm:isRewardRecorded==='2'?oldForm:isRewardRecorded==='3'?rulesForm:{};
    const {res}:any= await webapi.invitationSaveConfig(obj);
    if(res.code==Const.SUCCESS_CODE){
      message.success('操作成功');
    }else{
      message.error(res.message); 
    }
    
  }
  
}
