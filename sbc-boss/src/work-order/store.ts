import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';
import * as webapi from '../work-details/webapi';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    await this.queryPage();
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('info:editSearchFormData', { key: 'status', value: index });
    this.init();
  };

  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);

    // let tabStatus = this.state().get('tabStatus');
    // if (tabStatus === '-1') {
    //   tabStatus = '';
    // }else{
    //
    // }
    let param = this.state()
      .get('searchData')
      .toJS();
    if (
      param.status == '-1' ||
      param.status == null ||
      param.status == undefined
    ) {
      param.status = '';
    }
    if (
      param.accountMergeStatus == '-1' ||
      param.accountMergeStatus == null ||
      param.accountMergeStatus == undefined
    ) {
      param.accountMergeStatus = '';
    }
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    // param.status = tabStatus;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.workOrderVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
        if (param.status == '') {
          this.dispatch('info:editSearchFormData', {
            key: 'status',
            value: '-1'
          });
        }
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
    const param = this.state()
      .get('searchData')
      .toJS();
    // debugger;
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };

  /**
   * 单个删除
   */
  onDelete = async (id) => {
    const { res: delRes } = await webApi.deleteById(id);
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    }
  };

  /**
   * 设置勾选的多个id
   */
  onSelect = (checkedIds) => {
    this.dispatch('info:setCheckedData', fromJS(checkedIds));
  };

  /**
   * 批量删除
   */
  onBatchDelete = async () => {
    const checkedIds = this.state().get('checkedIds');
    const { res: delRes } = await webApi.deleteByIdList(checkedIds.toJS());
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
      this.dispatch('info:setVisible', true);
      this.dispatch('info:setFormData', fromJS({}));
    });
  };

  /**
   * 打开编辑弹框
   */
  onEdit = async (id) => {
    const {
      res: { context: baseInfo }
    } = await webapi.fetchWorkDetails(id);
    if (baseInfo === null) {
      message.error('加载失败');
      return;
    }
    const {
      res: { context: customerStatus }
    } = await webapi.fetchCustomerStatus(
      baseInfo.workOrderVO.customer.customerId
    );
    if (customerStatus === null) {
      message.error('加载失败');
      return;
    }
    this.transaction(() => {
      this.dispatch('info:setMergeAccountDetails', baseInfo.workOrderVO);
      this.dispatch(
        'info:setCustomerStatus',
        customerStatus.mergeAccountBeforeStatusVo
      );
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
    const formData = this.state().get('mergeAccountDetails');
    let result = await webApi.mergeAccount({
      workOrderId: formData.workOrderId,
      parentId: formData.registedCustomerId,
      customerId: formData.approvalCustomerId
    });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeModal();
      this.dispatch('info:setMergeAccountDetails', fromJS({}));
      await this.init();
    } else {
      message.error('操作失败');
    }
  };

  /**
   * 打开导出弹框
   */
  onExportModalShow = (exportModalData) => {
    this.dispatch(
      'info:exportModalShow',
      fromJS({
        ...exportModalData,
        visible: true,
        exportByParams: this.onExportByParams,
        exportByIds: this.onExportByIds
      })
    );
  };

  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };

  /**
   * 按勾选的信息进行导出
   */
  onExportByIds = () => {
    const checkedIds = this.state()
      .get('checkedIds')
      .toJS();

    if (checkedIds.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }

    return this._onExport({ workOrderIdList: checkedIds });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const searchParams = this.state()
      .get('searchData')
      .toJS();
    return this._onExport(searchParams);
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = window.token;
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref = Const.HOST + `/workorder/export/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve();
      }, 500);
    });
  };
}
