import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import SelectedActor from './actor/selected-customer-actor';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import { Const, history } from 'qmkit';

type TList = List<any>;

export default class AppStore extends Store {
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
      new FormActor(),
      new SelectedActor()
    ];
  }

  init = async (
    customerId,
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();
    query['customerId'] = customerId;
    const { res } = await webapi.fetchCustomerChilidList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context.detailResponsePage);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
        this.dispatch('select:init', []);
        this.dispatch('customerId:init', customerId);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init(this.state().get('customerId'), { pageNum: 0, pageSize: 10 });
  };

  onSelect = (list) => {
    //debugger;
    this.dispatch('select:init', list);
  };

  handleSubmit = async () => {
    const selected = this.state().get('selected');
    const customerId = this.state().get('customerId');
    let childCustomerID = [];
    const request = {};
    if (selected.size > 0) {
      selected.forEach((item) => {
        childCustomerID.push(item);
      });
      request['customerIds'] = childCustomerID;
      request['parentId'] = customerId;
    } else {
      message.error('先选择子账号');
      return;
    }
    const { res } = await webapi.bindChildAccount(request);
    if (res.code === Const.SUCCESS_CODE) {
      history.push({
        pathname: '/customer-list'
      });
    } else {
      message.error(res.message);
      const customerId = this.state().get('customerId');
      await this.init(customerId);
      return;
    }
  };
}
