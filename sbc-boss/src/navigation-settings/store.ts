import { IOptions, Store } from 'plume2';
import sensitiveActor from './actor/sensitive-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import { List } from 'immutable';
import { IMap } from 'typings/globalType';

import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new sensitiveActor()];
  }

  /**
   * 初始化列表信息
   * @param {any} pageParams
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<void>}
   */
  init = async () => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchSensitiveWordsList();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('list:init', res.context.navigationConfigVOList);
      // this.dispatch('sensitiveActor:select', List());
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };
  /**
   * 修改查询条件
   * @param searchParam
   */
  onFormChange = (likeSensitiveWords) => {
    this.dispatch('sensitiveActor: editSearchData', likeSensitiveWords);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async () => {
    this.init();
  };

  /**
   * 复选框选中设置值
   * @param list
   */
  onSelect = (list) => {
    this.dispatch('sensitiveActor:select', list);
  };
  /**
   * 打开添加的弹窗
   */
  onAdd = () => {
    this.dispatch('edit:init', fromJS({}));
    this.dispatch('modal:show');
  };
  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('modal:hide');
  };

  /**
   * 修改添加/编辑的表单信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('sensitiveActor: editFormData', formData);
  };

  /**
   * 取消编辑
   */
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };
  /**
   * 调整到编辑modal
   * @param {string} id
   */
  onEdit = async (id: Number) => {
    const sensitiveWords = this.state()
      .get('dataList')
      .find((v) => v.get('sensitiveId') == id);
    this.transaction(() => {
      this.dispatch('edit:init', sensitiveWords);
      this.dispatch('modal:show');
    });
  };
  /**
   * 保存
   * @returns {Promise<void>}
   */
  onSave = async (name: string[]) => {
    const formData = this.state()
      .get('dataList')
      .toJS();
    name.map((item, index) => {
      if (item.length > 0) {
        formData[index].navName = item;
      }
    });
    const result = await webapi.editSensitiveWords({
      navigationConfig: formData
    });

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      return true;
    } else {
      message.error(result.res.message);
      return false;
    }
  };
  setBusinessBanner = (data) => {
    const dataList = this.state()
      .get('dataList')
      .toJS();
    const result = dataList.map((item) => {
      if (item.id === data.id) {
        return {
          ...item,
          iconShow: data.iconShow,
          iconClick: data.iconClick
        };
      } else {
        return item;
      }
    });
    this.dispatch('list:init', result);
  };

  /**
   * 页面刷新
   */
  refresh = () => {
    this.dispatch('modal:hide');
    this.dispatch('sensitiveActor: editFormData', { sensitiveWords: '' });
    this.init();
  };
}
