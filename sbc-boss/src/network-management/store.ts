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
  init = async () => {
    await this.queryPage();
  };

  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state().get('searchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webapi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch(
          'info:setPageData',
          pageRes.context
        );
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
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
   * 修改状态
   */
  onState = async (networkIds,state) => {
    const { res: delRes } =state?await webapi.startNetWork({networkIds}):await webapi.netWorkDelete({networkIds});
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
    }
  };





  /**
   * 设置勾选的多个id
   */
  onSelect = (checkedIds) => {
    this.dispatch('info:setCheckedData', fromJS(checkedIds));
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
    let editData = this.state().get('dataList').find((v) => v.get('networkId') == id);
    editData=editData.set('addressName',editData.get('provinceName')+editData.get('cityName')+editData.get('areaName')+(editData.get('townName')||''));
    editData=editData.set('addressList',editData.get('town')?[
      editData.get('province'),
      editData.get('city'),
      editData.get('area'),
      editData.get('town')
    ]:[
      editData.get('province'),
      editData.get('city'),
      editData.get('area'),
    ]); 
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
   * "contacts":"刘草测试的",
 "networkName":"网点名字",
 "phone":"13627475508",
 "landline":"1999999999",
 "networkAddress":"湖南省衡阳县西渡镇高丰小区",
 "province":"430000",
 "distance":"10000"
   */
  onSave = async () => {
    const formData = this.state().get('formData').toJS();
    formData.networkAddress=formData.networkAddress?formData.networkAddress:(formData.addressName+formData.specificAdress);
    let result;
    if (formData.netWorkId) {
      result = await webapi.modify(formData);
    } else {
      result = await webapi.add({...formData,distance:10000});
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


  changeArea = (value, label) => {
    this.dispatch('areas: changeArea', { value, label });
  };

  changeCityArea = (value) => {
    
    this.dispatch('areas: changeCityArea', value);
  };



  /**
   * 批量删除
   */
   onBatchDelete = async () => {
    const checkedIds = this.state().get('checkedIds');
    const { res: delRes } = await webapi.deleteByIdList(checkedIds.toJS());
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
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

    return this._onExport({ idList: checkedIds });
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
          const exportHref =
            Const.HOST + `/logisticscompany/export/${encrypted}`;
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
