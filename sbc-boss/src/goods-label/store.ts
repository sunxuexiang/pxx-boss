import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';
import update from 'immutability-helper';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    await this.queryList();
  };

  /**
   * 查询列表数据
   */
  queryList = async () => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    const { res: listRes } = await webApi.getList(param);
    if (listRes.code === Const.SUCCESS_CODE) {
      let list = listRes.context.goodsLabelVOList;
      if (param.name) {
        list = list.filter((label) => label.name.indexOf(param.name) > -1);
      }
      if (param.visible && param.visible !== '-1') {
        list = list.filter((label) => Boolean(label.visible) == param.visible);
      }
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置列表数据
        this.dispatch('info:setPageData', list);
      });
    } else {
      message.error(listRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询列表数据
   */
  onSearch = async (searchData) => {
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryList();
  };

  /**
   * 单个删除
   */
  onDelete = async (id) => {
    const { res: delRes } = await webApi.deleteById(id);
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryList();
    }
  };

  /**
   * 打开添加弹窗
   */
  onAdd = () => {
    this.transaction(() => {
      this.dispatch('info:setVisible', true);
      this.dispatch('info:setFormData', fromJS({ image: '' }));
    });
  };

  /**
   * 打开编辑弹框
   */
  onEdit = async (id) => {
    const editData = this.state()
      .get('dataList')
      .find((v) => v.get('id') == id);
    this.transaction(() => {
      this.dispatch('info:setFormData', editData);
      this.dispatch('info:setVisible', true);
    });
  };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormData = (data) => {
    this.dispatch('info:editFormData', data);
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };

  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state().get('formData');
    let result;
    if (formData.get('id')) {
      result = await webApi.modify(formData);
    } else {
      let param = {
        storeId: null,
        image: formData.get('image'),
        name: formData.get('name'),
        visible: formData.get('visible') || 0
      };
      result = await webApi.add(param);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeModal();
      this.dispatch('info:setFormData', fromJS({}));
      await this.init();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let dataList = this.state()
      .get('dataList')
      .toJS();
    //拖拽排序
    const dragRow = dataList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(dataList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    let labelIdList = [];
    for (let index in sortList) {
      labelIdList.push({ ...sortList[index], sort: index });
    }
    const { res } = (await webApi.dragSort({
      goodsLabels: labelIdList
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 刷新
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 0);
  };

  /**
   * 单个启用/禁用
   */
  onVisible = async (item) => {
    const param = {
      ...item,
      visible: item.visible === 1 ? 0 : 1
    };
    const { res: delRes } = await webApi.modify(param);
    if (delRes.code === Const.SUCCESS_CODE) {
      const tips = item.visible === 0 ? '启用成功' : '禁用成功';
      message.success(tips);
      await this.queryList();
    }
  };
}
