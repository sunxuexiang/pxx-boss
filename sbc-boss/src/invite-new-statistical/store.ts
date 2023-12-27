import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import { message } from 'antd';
import SearchActor from './actor/search-actor';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';
import ExportActor from './actor/export-actor';
import { keyBy } from 'lodash';

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
      new ListActor(),
      new LoadingActor(),
      new SearchActor(),
      new ExportActor()
    ];
  }

  init = async () => {
    const pageNum = 0;
    const pageSize = 10;
    if (this.state().get('loading')) {
      this.dispatch('loading:start');
    }
    const query = this.state().get('searchParams')
      .toJS();
    this.searchCache = query;
    const { res } = await webapi.fetchInviteNewRecordList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('invite:new:currentPage', pageNum + 1);
        this.dispatch('invite:new:init', res.context);
      });
    } else {
      if (this.state().get('loading')) {
        this.dispatch('loading:end');
      }
      message.error(res.message);
    }
  };


  /**
   * 点击搜索，都是从第一页开始
   */
  onSearch = () => {
    this.init();
  };


  onInviteNewSearchParams=(key,value)=>{
    this.dispatch('invite:new:searchParams',{field:key,value})
  }

  closeModal=()=>{
    this.dispatch('invite:new',{key:'customerAccount',value:''});
    this.dispatch('invite:new',{key:'detailsVisible',value:false});
  }


  onDetails=(row)=>{
    this.dispatch('invite:new',{key:'inviteeAccount',value:row?.customerAccount});
    this.dispatch('invite:new',{key:'detailsVisible',value:true});
    this.onSearchDis();
  };
  onSearchDis=async()=>{
    const {customerAccount,inviteeAccount}=this.state().toJS();
    let {res}=await webapi.invitationCustomerPage({customerAccount,inviteeAccount});
    if(res.code===Const.SUCCESS_CODE){
      this.dispatch('invite:new',{key:'detailsList',value:fromJS(res.context.list)});
    }else{
      message.error(res.message)
    }
  };

  onInviteNew=(key,value)=>{
    this.dispatch('invite:new',{key,value})
  };





  /**
   * 选中
   */
  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要导出的邀新记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    let params = this.state()
      .get('searchParams')
      .toJS();

    // 入账状态
    const key = params.isRewardRecorded;
    if (key === '1') {
      params.isRewardRecorded = 'YES';
    } else if (key === '0') {
      params.isRewardRecorded = 'NO';
    }
    return this._onExport({
      recordIdList: selected.toJS(),
      isRewardRecorded: params.isRewardRecorded
    });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.searchCache;

    // 入账状态
    const key = params.isRewardRecorded;
    if (key === '1') {
      params.isRewardRecorded = 'YES';
    } else if (key === '0') {
      params.isRewardRecorded = 'NO';
    }
    params = QMMethod.trimValueDeep(params);
    return this._onExport(params);
  };

  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref =
            Const.HOST + `/distribution-invite-new/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  onFormChange = () => {};
}
