import { IOptions, Store } from 'plume2';

import * as webapi from './webapi';
import { Const, history } from 'qmkit';
import workDetailActor from './actor/worker-actor';
import { message } from 'antd';
import { validatorEmoji } from '../../web_modules/qmkit/comment-method';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new workDetailActor()];
  }

  //初始化页面
  init = async (customerId, checkFlag) => {
    await this.initBaseInfo(customerId, checkFlag);
  };

  initBaseInfo = async (customerId, checkFlag) => {
    this.dispatch('edit:checkFlag', checkFlag);
    const {
      res: { context: baseInfo }
    } = await webapi.fetchWorkDetails(customerId);
    if (baseInfo === null) {
      message.error('加载失败');
      return;
    }
    this.dispatch('init:baseInfo', baseInfo.workOrderVO);
    const {
      res: { context: workOrderEdits, code: ReturnCode }
    } = await webapi.fetchWorkDetailsEdit(baseInfo.workOrderVO.workOrderId);
    if (ReturnCode == Const.SUCCESS_CODE) {
      workOrderEdits.workOrderDetailVOList.map((elem, index) => {
        elem['notEditFlag'] = true;
      });
      this.dispatch(
        'add:workOrderDetails',
        workOrderEdits.workOrderDetailVOList
      );
    }
  };

  //增加工单编辑
  addEdit = () => {
    let list = this.state().get('workOrderDetails');
    if (list == null || list.size == 0) {
      list = new Array();
    }
    let data = { dealTime: '', suggestion: '', status: '', notEditFlag: false };
    list.push(data);
    this.dispatch('edit:editFlag', true);
    this.dispatch('add:workOrderDetails', list);
  };

  saveEdit = async () => {
    const list = this.state().get('workOrderDetails');
    const baseInfo = this.state().get('baseInfo');
    const saveParam = list[list.length - 1];
    saveParam['workOrderId'] = baseInfo.workOrderId;
    if (saveParam.notEditFlag === false) {
      if (
        saveParam.suggestion != null &&
        saveParam.suggestion != '' &&
        saveParam.status != null &&
        saveParam.status != ''
      ) {
        const { res } = await webapi.saveWorkDetailsEdit(saveParam);
        if (res.code === Const.SUCCESS_CODE) {
          history.push({
            pathname: '/work-order'
          });
        } else {
          message.error('工单添加失败');
        }
      } else {
        message.error('请输入必填项');
      }
    } else {
      message.error('请输入工单信息');
    }
  };

  editOnChange = (index, value, key) => {
    let list = this.state().get('workOrderDetails');
    switch (key) {
      case 'suggestion':
        list[index].suggestion = value;
        break;
      case 'status':
        list[index].status = value;
        break;
      case 'dealTime':
        list[index].dealTime = value;
        break;
    }
    this.dispatch('add:workOrderDetails', list);
  };
}
