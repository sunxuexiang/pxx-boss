import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';

interface IStoreEvaluateResponse {
  content: Array<any>;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      // 已签署合同列表数据
      contract: {
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        //当前的客户列表
        dataList: [],
        //当前页
        currentPage: 1,
        loading: false
      },
      // 未签署合同列表数据
      waitList: {
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        //当前的客户列表
        dataList: [],
        //当前页
        currentPage: 1,
        loading: false
      },
      // 合同模板列表数据
      template: {
        personList: [],
        companyList: [],
        loading: false
      },
      // 控制pdf弹窗的显示
      visible: false,
      // pdf弹窗title
      pdfTitle: '',
      //招商经理列表
      managerList: []
    };
  }

  @Action('listActor:init')
  init(state: IMap, obj: { type: String; res: IStoreEvaluateResponse }) {
    const { content, total } = obj.res;
    return state.withMutations((state) => {
      state
        .setIn([obj.type, 'total'], total)
        .setIn([obj.type, 'dataList'], fromJS(content));
    });
  }

  @Action('listActor:tempInit')
  tempInit(state: IMap, { key, dataList }: { key: string; dataList: IList }) {
    return state.setIn(['template', key], dataList);
  }

  @Action('list:currentPage')
  currentPage(state: IMap, obj: { type: String; current }) {
    return state.setIn([obj.type, 'currentPage'], obj.current);
  }

  @Action('list:loading')
  loading(state: IMap, obj: { type: String; loading: boolean }) {
    return state.setIn([obj.type, 'loading'], obj.loading);
  }

  @Action('list:visible')
  visible(state: IMap, visible: boolean) {
    return state.set('visible', visible);
  }

  @Action('list:pdfTitle')
  pdfTitle(state: IMap, pdfTitle: string) {
    return state.set('pdfTitle', pdfTitle);
  }

  @Action('list:managerList')
  managerList(state: IMap, managerList: IList) {
    return state.set('managerList', managerList);
  }
}
