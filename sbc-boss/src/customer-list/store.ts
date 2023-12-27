import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import SelectedActor from './actor/selected-customer-actor';
import EmployeeActor from './actor/employee-actor';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import EditActor from './actor/edit-actor';
import CustomerLevelActor from './actor/customer-level-actor';
import VisibleActor from './actor/visible-actor';
import RejectActor from './actor/reject-actor';
import ForbidActor from './actor/forbid-actor';
import ImportActor from './actor/import-actor';
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
      new SelectedActor(),
      new EmployeeActor(),
      new CustomerLevelActor(),
      new EditActor(),
      new VisibleActor(),
      new RejectActor(),
      new ForbidActor(),
      new ImportActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();
    if (query.checkState === '-1') {
      query.checkState = '';
    }
    //过滤空值字段
    const filterParams = {};
    for (let key in query) {
      if (query[key]) {
        filterParams[key] = query[key];
      }
    }
    const { res } = await webapi.fetchCustomerList({
      ...filterParams,
      pageNum,
      pageSize
    });
    const { res: resLevel } = await webapi.fetchAllCustomerLevel();
    const { res: myself } = (await webapi.fetchMyselfInfo()) as any;
    let empArr;
    let housekeeperArr;
    // 是业务员 且 不是主账号,则筛选框中只展示当前登录人
    if (myself.context.isEmployee == 0 && myself.context.isMasterAccount == 0) {
      empArr = [
        {
          employeeId: myself.context.employeeId,
          employeeName: myself.context.employeeName
        }
      ];
      housekeeperArr = [
        {
          employeeId: myself.context.employeeId,
          employeeName: myself.context.employeeName
        }
      ];
    } else {
      const { res: resEmployee } = await webapi.fetchAllEmployee();
      empArr = resEmployee;
      const { res: housekeeper } = await webapi.customerEmployees({
        isHiddenDimission: 1,
        departmentIds: ['7ffffe8beb0ae7de2746167928a48af6'],
        pageNum: 0,
        pageSize: 10000
      });
      housekeeperArr = housekeeper;
    }

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
        this.dispatch('employee:init', fromJS(empArr));
        this.dispatch(
          'housekeeperr:init',
          fromJS(
            (housekeeperArr?.context?.content || []).concat([
              {
                employeeId: '2c8080815cd3a74a015cd3ae86850001',
                employeeName: 'system'
              }
            ])
          )
        );
        this.dispatch(
          'customerLevel:init',
          fromJS(resLevel.context.customerLevelVOList)
        );
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:checkState', index);
    this.init();
  };

  // 是否直播
  onchangeStartLive = async (customerId, isLive) => {
    const { res } = await webapi.modifyIsLive({ customerId, isLive });
    if (res.code == Const.SUCCESS_CODE) {
      this.init();
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };

  ChangeviFlag = async (customerId, vipFlag) => {
    const { res } = await webapi.fetchVipflag({ customerId, vipFlag });
    console.log(res, '222222222');
    this.init();
  };

  onErrSetTable = (data) => {
    this.dispatch('import: reason', data);
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    console.log(field, value);
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
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 新增
   */
  onAdd = async () => {
    const { res } = await webapi.checkFunctionAuth('/customer', 'POST');
    if (!res.context) {
      message.error('此功能您没有权限访问');
      return;
    }
    this.dispatch('modal:show');
  };

  jumpToInput = async (customerId) => {
    const { res } = await webapi.checkMegerFlag(customerId);
    if (res.code === Const.SUCCESS_CODE) {
      if (res.context.mergeAccountFlag) {
        history.push(`/customer-child-list/${customerId}`);
      } else {
        message.error('该账号存在未处理完成的工单');
      }
    } else {
      message.error(res.message);
    }
  };

  //取消
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  importModalShow = (blo) => {
    this.dispatch('import: importModal', blo);
  };

  onSave = async (customerForm) => {
    if (this.state().get('onSubmit')) {
      this.dispatch('modal:submit', false);
      //保存
      const { res } = await webapi.saveCustomer(customerForm);
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message);
        this.dispatch('modal:hide');
        this.init();
      } else {
        this.dispatch('modal:submit', true);
        message.error(res.message);
      }
    }
  };
  /**
   * 批量删除
   * @returns {Promise<void>}
   */
  onBatchDelete = async () => {
    const selected = this.state().get('selected') as TList;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    const { res } = await webapi.batchDelete(selected.toJS());
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 单个删除
   * @param customerId
   * @returns {Promise<void>}
   */
  onDelete = async (customerId) => {
    const { res } = await webapi.batchDelete([customerId]);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
  /**
   * 批量禁用或启用会员
   * @param customerId
   * @returns {Promise<void>}
   */
  onBatchAudit = async (customerStatus) => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }

    const { res } = await webapi.batchAudit(
      customerStatus,
      selected.toJS(),
      null
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 禁用或启用会员
   * @param customerId
   * @returns {Promise<void>}
   */
  onCheckStatus = async (customerId, customerStatus, forbidReason) => {
    const { res } = await webapi.batchAudit(
      customerStatus,
      [customerId],
      forbidReason
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  //审核客户状态，审核/驳回
  onCustomerStatus = async (customerId, checkState, rejectReason) => {
    const { res } = await webapi.updateCheckState(
      checkState,
      customerId,
      rejectReason
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 根据客户Id查询所属商家名称
   *
   * @param customerId
   * @returns {Promise<void>}
   */
  getSupplierNameByCustomerId = async (customerId) => {
    const { res } = await webapi.getSupplierNameByCustomerId(customerId);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('list:supplierNameMap', {
        customerId: customerId,
        supplierName: res.context
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 控制驳回窗口显示
   * @param visible
   */
  setRejectModalVisible = (customerId, visible) => {
    this.transaction(() => {
      this.dispatch('reject:setRejectCustomerId', customerId);
      this.dispatch('reject:setRejectModalVisible', visible);
    });
  };
  /**
   * 控制禁用窗口显示
   * @param visible
   */
  setForbidModalVisible = (customerId, visible) => {
    this.transaction(() => {
      this.dispatch('forbid:setForbidCustomerId', customerId);
      this.dispatch('forbid:setForbidModalVisible', visible);
    });
  };

  /**
   * 判断用户是否拥有crm权限
   */
  getCRMConfig = async () => {
    const {
      res: {
        context: { crmFlag }
      }
    } = await webapi.getCrmConfig();

    this.dispatch('setCRMFlag', crmFlag);
  };
}
