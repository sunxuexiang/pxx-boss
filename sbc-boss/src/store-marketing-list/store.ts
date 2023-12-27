import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor(), new LoadingActor(), new FormActor()];
  }

  getStoreList = async () => {
    const { res } = await webapi.fetchAllStore();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('form:list', fromJS(res.context || []));
    } else {
      message.error(res.message);
    }
  };

  init = async (
    { pageNum, pageSize } = {
      pageNum: 0,
      pageSize: this.state().get('pageSize') || 10
    }
  ) => {
    this.dispatch('loading:start');
    const query = this.state().get('form').toJS();
    if (query.marketingSubType === '-1') {
      query.marketingSubType = null;
    }

    const { res } = await webapi.fetchList({ ...query, pageNum, pageSize });

    if (res.code === Const.SUCCESS_CODE) {
      const wareHouseVOPage =
        JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
      res.context.content.forEach((el) => {
        wareHouseVOPage.forEach((ware) => {
          if (el.wareId == ware.wareId) {
            el.wareName = ware.wareName;
          } else {
            return;
          }
        });
      });

      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', {
          pageNum: pageNum && pageNum + 1,
          pageSize: pageSize
        });
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:field', { field: 'queryTab', value: index });
    const pageNum = sessionStorage.getItem('pageNum');
    let pageSize = this.state().get('pageSize');
    this.init({ pageNum: pageNum ? Number(pageNum) : 0, pageSize });
    sessionStorage.removeItem('pageNum');
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init();
  };

  onTermination = async (marketingId) => {
    const { res } = await webapi.onTermination(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };
}
