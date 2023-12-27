import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface MarketingResponse {
  content: Array<any>;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的列表数据
      dataList: [],
      //当前页
      current: 1,
      loading: false,
      // 账户数据
      accountInfo: {
        //账户名称
        accountName: '',
        //账户名
        accountNumber: '',
        //账户余额
        accountBlance: ''
      },
      form: null
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: MarketingResponse) {
    const { content, total } = res;

    return state.withMutations((state) => {
      state.set('total', total).set('dataList', fromJS(content));
    });
  }

  @Action('listActor:accountInfo')
  accountInfo(state: IMap, params) {
    return state.set('accountInfo', params);
  }

  @Action('list:page')
  page(state: IMap, page) {
    return state.set('current', page.pageNum).set('pageSize', page.pageSize);
  }

  @Action('list:loading')
  loading(state: IMap, loading) {
    return state.set('loading', loading);
  }

  @Action('form:update')
  changeField(state: IMap, form) {
    return state.set('form', form);
  }
}
