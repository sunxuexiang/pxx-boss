import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface MarketingResponse {
  content: Array<any>;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      // 用户账户数据
      userInfo: {
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        //当前的列表数据
        dataList: [],
        //当前页
        current: 1,
        //鲸币余额
        balance: '0',
        //昨日新增鲸币
        addBalance: '0',
        //昨日减少鲸币
        reduceBalance: '0',
        loading: false
      },
      // 企业账户数据
      companyInfo: {
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        //当前的列表数据
        dataList: [],
        //当前页
        current: 1,
        //鲸币余额
        balance: '0',
        //昨日新增鲸币
        addBalance: '0',
        //昨日减少鲸币
        reduceBalance: '0',
        loading: false
      }
    };
  }

  @Action('listActor:initUser')
  initUser(state: IMap, res: MarketingResponse) {
    const { content, total } = res;

    return state.withMutations((state) => {
      state
        .setIn(['userInfo', 'total'], total)
        .setIn(['userInfo', 'dataList'], fromJS(content));
    });
  }

  @Action('listActor:initCompany')
  initCompany(state: IMap, res: MarketingResponse) {
    const { content, total } = res;
    return state.withMutations((state) => {
      state
        .setIn(['companyInfo', 'total'], total)
        .setIn(['companyInfo', 'dataList'], fromJS(content));
    });
  }

  @Action('listActor:initBalance')
  initBalance(state: IMap, { key, balance, addBalance, reduceBalance }) {
    return state.withMutations((state) => {
      state
        .setIn([key, 'balance'], balance)
        .setIn([key, 'addBalance'], addBalance)
        .setIn([key, 'reduceBalance'], reduceBalance);
    });
  }

  @Action('list:current')
  current(state: IMap, page) {
    return state
      .setIn([page.key, 'current'], page.pageNum)
      .setIn([page.key, 'pageSize'], page.pageSize);
  }

  @Action('list:loading')
  loading(state: IMap, data) {
    return state.setIn([data.key, 'loading'], data.loading);
  }
}
