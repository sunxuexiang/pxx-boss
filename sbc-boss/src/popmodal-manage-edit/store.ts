import { Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import momnet from 'moment';
import { Const, QMMethod } from 'qmkit';
import EditActor from './actor/edit-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new EditActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (params?) => {
    const res = await webapi.fetchList({ applicationPageName: params });
    console.log('res', res);
    this.dispatch('modalList:init', res.res);
  };

  setSorLabel = async (params) => {
    console.log('params', params);
    let applicationPageName = this.state().get('pageManagementName');
    let newParams = params.map((v, i) => {
      return {
        applicationPageName: applicationPageName,
        popupId: v.popupId,
        sortNumber: i
      };
    });
    await webapi.sortLabel(newParams);
    console.log('newParams', newParams);
    this.dispatch('modalList:setSort', params);
  };
}
