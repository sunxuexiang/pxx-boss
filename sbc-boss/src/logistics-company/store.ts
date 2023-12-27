import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = (marketId?) => {
    if (marketId) {
      this.transaction(() => {
        this.dispatch('info:setMarketId', marketId);
        this.queryPage();
      });
    } else {
      this.queryPage();
    }
  };

  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    const marketId = this.state().get('marketId');
    this.dispatch('info:setLoading', true);
    const param = this.state().get('searchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.marketId = marketId;
    const { res: pageRes } = await webapi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch(
          'info:setPageData',
          pageRes.context.logisticsCompanyVOPage
        );
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async (searchData) => {
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };

  /**
   * 单个删除
   */
  onDelete = async (id) => {
    const { res: delRes } = await webapi.deleteById(id);
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
    }
  };

  /**
   * 打开添加弹窗
   */
  onAdd = () => {
    this.transaction(() => {
      this.dispatch('info:setVisible', { visible: true, editFlag: false });
      this.dispatch('info:setFormData', fromJS({}));
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
      this.dispatch('info:setVisible', { visible: true, editFlag: true });
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
    this.dispatch('info:setVisible', { visible: false, editFlag: false });
  };

  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state().get('formData').toJS();
    const marketId = this.state().get('marketId');
    formData.marketId = marketId;
    let result;
    if (formData.id) {
      result = await webapi.modify(formData);
    } else {
      result = await webapi.add(formData);
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
}
