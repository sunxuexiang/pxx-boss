import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
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
    await this.pageLive();
  };
// 删除
  onDelete = async (id) => {
    const { res: pageRes } = await webApi.deleteById(id);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.init();
    } else {
      message.error(pageRes.message);
    }
  };
  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context);
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
    let searchDataParamTm = this.state().get('searchData');
    console.log(this.state().get('searchData').toJS());
    await this.queryPage();
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 打开添加弹窗
   */
  onAdd = () => {
    this.transaction(() => {
      this.dispatch('info:setVisible', true);
      this.dispatch('info:setFormData', fromJS({hostType:0,workingState:1,couponCateIds:fromJS([])}));
    });
  };
  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };

  onFormBut = (keys, value) => {
    this.dispatch('form-set', { keys, value });
  };

  // 查询分页直播账号
  pageLive = async () => {
    const res = await webApi.pageLive();
    const { code, context } = res.res as any;
    if (code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'couponCates',
        value: context.detailResponseList
      });
    }
  };
  // 新增
  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    let formData = this.state().get('formData').toJS();
    // 处理直播账号列表数据
    // let accounts = [];
    // formData.couponCateIds.map((item, index) => {
    //   formData.couponCateNames.map((item1, index1) => {
    //     let info = {
    //       customerAccount: item1,
    //       customerId: item
    //     }
    //     accounts.push(info);
    //   });
    // });
    let result;
    if (formData.hostId) {
      let oData = {
        hostName: formData.hostName,//主播姓名
        hostType: formData.hostType,//主播类型 0 官方 1入驻
        contactPhone: formData.contactPhone,//联系方式
        workingState: formData.workingState,//在职状态 0 离职 1 在职
        accounts: formData.accounts,//直播账号
        accountName: formData.accountName,//运营账号
        hostId:formData.hostId,
      }
      result = await webApi.hostModify(oData);
    } else {
      let oData = {
        hostName: formData.hostName,//主播姓名
        hostType: formData.hostType,//主播类型 0 官方 1入驻
        contactPhone: formData.contactPhone,//联系方式
        workingState: formData.workingState,//在职状态 0 离职 1 在职
        accounts: formData.accounts,//直播账号
        accountName: formData.accountName,//运营账号
      }
      result = await webApi.hostAdd(oData);
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
  // 编辑
  onEdit = async (rowInfo) =>{
    console.log(rowInfo);
    rowInfo.couponCateIds = rowInfo.customerId.split(',');
    rowInfo.couponCateNames = rowInfo.customerAccount.split(',');
    rowInfo.accounts=rowInfo.couponCateIds.map((item,i)=>{
      return {
        customerId:item,
        customerAccount:rowInfo.couponCateNames[i]
      }
    });
    this.dispatch('info:setFormData', fromJS(rowInfo));
    this.dispatch('info:setVisible', true);
    // this.transaction(() => {
     
      
    // });
  };
  // 重新启用
  onVisible = async (id) =>{
    const { res: pageRes } = await webApi.hostEnable(id);
    if (pageRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(pageRes.message);
    }
  };
}
