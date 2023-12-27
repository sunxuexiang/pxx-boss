import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { message, Modal } from 'antd';
import { history, Const } from 'qmkit';

import CustomerLevelActor from './actor/customer-level-actor';
import EmployeeActor from './actor/employee-actor';
import CustomerEditActor from './actor/customer-edit-actor';
import CustomerAddressListActor from './actor/customer-address-list-actor';
import CustomerAccountListActor from './actor/customer-account-list-actor';
import CustomerInvoiceEditActor from './actor/customer-invoice-edit-actor';
import CustomerAddressEditActor from './actor/customer-address-edit-actor';
import CustomerAccountEditActor from './actor/customer-account-edit-actor';
import HistoryLogisticsCompany from './actor/history-logistics-company-actor';
import config from '../../web_modules/qmkit/config';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new CustomerLevelActor(),
      new EmployeeActor(),
      new CustomerEditActor(),
      new CustomerAccountListActor(),
      new CustomerAccountEditActor(),
      new CustomerInvoiceEditActor(),
      new CustomerAddressListActor(),
      new CustomerAddressEditActor(),
      new HistoryLogisticsCompany()
    ];
  }

  /**
   * 初始化客户信息
   * @param customerId
   */
  initCustomer = async (customerId?: string) => {
    /**
     *  编辑时获取客户详细信息
     */
    const { res: customerInfo } = (await webapi.fetchCustomer(
      customerId
    )) as any;
    //负责业务员
    const { res: employee } = await webapi.fetchAllEmployee();
    // 电商中心员工
    const { res: employees } = await webapi.customerEmployees({
        isHiddenDimission:1,
        departmentIds:['7ffffe8beb0ae7de2746167928a48af6'],
        pageNum:0,
        pageSize:10000
    });
    
    let managerIdIndex=(employees?.context?.content||[]).findIndex(item=>item.employeeId==customerInfo?.customerDetail?.managerId);
    let list=[{
      employeeId:'2c8080815cd3a74a015cd3ae86850001',
      employeeName: 'system'}];
    if(managerIdIndex==-1){
      list.push({
        employeeId: customerInfo?.customerDetail?.managerId,
        employeeName: customerInfo?.customerDetail?.managerName
    });
    }
    //客户等级
    const { res: customerLevel } = await webapi.fetchAllCustomerLevel();
    // const cusId = this.state().get('customerId')
    //客户收货地址信息
    const { res: addressInfo } = await webapi.fetchCustomerAddressList(
      customerId
    );
    let pageNum = 0;
    let pageSize = 10;
    this.queryPage({ customerId, pageNum, pageSize });
    if (addressInfo.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('customerActor: init', fromJS(customerInfo));
        this.dispatch('employee:init', fromJS(employee));
        this.dispatch('housekeeperr:init',fromJS((employees?.context?.content||[]).concat(list)));

        this.dispatch(
          'customerLevel:init',
          fromJS(customerLevel.context.customerLevelVOList)
        );
        this.dispatch(
          'customerAddressListActor: init',
          fromJS(addressInfo.context)
        );
      });
    }
    // 客户账务信息
    this.initInvoice(customerId);
  };

  queryPage = async (
    { customerId, pageNum, pageSize } = {
      customerId: null,
      pageNum: 0,
      pageSize: 10
    }
  ) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.customerId = customerId;

    const { res: pageRes } = await webapi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch(
          'info:setPageData',
          pageRes.context.historyLogisticsCompanyVOPage
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
   * 初始化客户账务信息
   *
   * @param customerId
   * @returns {Promise<void>}
   */
  initAccount = async (customerId?: string) => {
    //客户银行账户信息
    const { res: accountInfo } = await webapi.fetchCustomerAccountList(
      customerId
    );
    this.dispatch('customerAccountListActor: init', fromJS(accountInfo));
  };

  /**
   * 初始化客户账务信息
   *
   * @param customerId
   * @returns {Promise<void>}
   */
  initInvoice = async (customerId?: string) => {
    //客户增专资质信息
    let { res: customerInvoice } = await webapi.fetchCustomerInvoice(
      customerId
    );

    // 获取客户增票资质信息异常，且不是K-0100012（会员增专票信息不存在）异常
    if (
      customerInvoice == null ||
      (customerInvoice['code'] && customerInvoice['code'] != 'K-0100012')
    ) {
      message.error('获取客户增票资质信息异常，请刷新重试');
      return;
    }

    // 会员增专票信息不存在
    if (customerInvoice['code'] && customerInvoice['code'] == 'K-0100012') {
      customerInvoice = {};
    }

    // 如果已经添加了增票资质，则解析图片列表，否则认为还没有添加
    if (customerInvoice['customerInvoiceId']) {
      customerInvoice['businessLicenseImg'] = JSON.parse(
        customerInvoice['businessLicenseImg']
      );
      customerInvoice['taxpayerIdentificationImg'] = JSON.parse(
        customerInvoice['taxpayerIdentificationImg']
      );
    } else {
      customerInvoice['customerId'] = customerId;
    }

    this.dispatch('customerInvoiceActor: init', fromJS(customerInvoice));
  };

  //tab-list 切换
  onTabChange = (index: string) => {
    let customerId = this.state().get('customerId');
    // 客户信息
    if (index == '-1') {
      this.initCustomer(customerId);
    } else if (index == '2') {
      // 客户账务信息
      this.initInvoice(customerId);
    } else if (index == '1') {
      this.initAccount(customerId);
    }

    this.dispatch('customerInvoiceActor:setValue', {
      key: 'tabIndex',
      value: index
    });
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:field', {
            field: v,
            value: value[index] || 0
          });
        });
      });
    } else {
      this.dispatch('form:field', { field, value });
    }
  };

  onFormChangeEdit = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:fieldEdit', {
            field: v,
            value: value[index] || 0
          });
        });
      });
    } else {
      this.dispatch('form:fieldEdit', { field, value });
    }
  };

  updateEnterpriseInfo = ({ field, value }) => {
    this.dispatch('form:updateEnterpriseInfo', { field, value });
  };

  /**
   * 保存客户基本信息
   */
  saveCustomer = (form, type, closeModal) => {
    form.validateFieldsAndScroll(null, async (errs) => {
      if (!errs) {
        const param = this.state()
          .get('customerForm')
          .toJS();
        if (!param.customerAddress && param.provinceId) {
          message.error('请填写详细地址');
          return;
        } else if (param.customerAddress && !param.provinceId) {
          message.error('请先选择所在地区');
          return;
        }

        let customerForm = this.state().get('customerForm');

        const { res } = await webapi.updateCustomer(customerForm);

        if (res.code === Const.SUCCESS_CODE) {
          message.success('操作成功');
          if (type && type === 'modal') {
            closeModal();
          } else {
            //history.push('/customer-list');
            history.goBack();
          }
        } else {
          message.error(res.message);
        }
      } else {
        // this.state().get('refreshCustomerForm')()
      }
    });
  };

  /**
   * 增票资质form
   *
   * @param field
   * @param value
   */
  onInvoiceFormChange = ({ field, value }) => {
    this.dispatch('invoiceForm:field', { field, value });
  };

  /**
   * 设置增票资质页面信息
   */
  setValue = (key, value) => {
    this.dispatch('customerInvoiceActor:setValue', { key: key, value: value });
  };

  /**
   * 保存客户增票资质信息
   */
  saveInvoice = (from) => {
    from.validateFieldsAndScroll(null, async (errs) => {
      if (!errs) {
        // 营业执照复印件
        let businessLicenseImg = [];
        this.state()
          .getIn(['invoiceForm', 'businessLicenseImg'])
          .forEach((v, i) => {
            // 上传成功的图片才保存
            if (v.get('status') == 'done') {
              // v.get('response')不为空，说明是新上传的，否则说明是修改前上传好的
              let url = v.get('response')
                ? v.get('response').get(0)
                : v.get('url');
              businessLicenseImg.push({
                uid: i,
                status: 'done',
                url: url
              });
            }
          });

        // 一般纳税人认证资格复印件
        let taxpayerIdentificationImg = [];
        this.state()
          .getIn(['invoiceForm', 'taxpayerIdentificationImg'])
          .forEach((v, i) => {
            // 上传成功的图片才保存
            if (v.get('status') == 'done') {
              // v.get('response')不为空，说明是新上传的，否则说明是修改前上传好的
              let url = v.get('response')
                ? v.get('response').get(0)
                : v.get('url');
              taxpayerIdentificationImg.push({
                uid: i,
                status: 'done',
                url: url
              });
            }
          });

        let invoiceForm = this.state()
          .get('invoiceForm')
          .toJS();
        invoiceForm.businessLicenseImg = JSON.stringify(businessLicenseImg);
        invoiceForm.taxpayerIdentificationImg = JSON.stringify(
          taxpayerIdentificationImg
        );

        let res;
        invoiceForm['customerId'] = this.state().get('customerId');
        // 增专资质ID存在，说明是修改，否则是新增
        if (invoiceForm.customerInvoiceId) {
          res = await webapi.updateCustomerInvoice(invoiceForm);
        } else {
          res = await webapi.addCustomerInvoice(invoiceForm);
        }

        if (res.res.code === Const.SUCCESS_CODE) {
          message.success('操作成功');
        } else {
          message.error(res.res.message);
        }
      }
    });
    // }
  };

  /** =============客户收货地址============== */

  /**
   * 添加收货地址
   */
  addCustomerAddress = async (address) => {
    const customerId = this.state().get('customerId');
    const { res } = await webapi.addCustomerAddress({
      ...address,
      customerId
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('添加收货地址成功');
      const { res } = await webapi.fetchCustomerAddressList(customerId);
      if (res.code == Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('switchAddressFormVisible', false);
          this.dispatch('customerAddressListActor: init', res.context);
        });
      }
    } else {
      message.error(res.message);
    }
  };

  /**
   * 编辑当前的地址
   */
  onEditAddress = (addressInfo) => {
    this.transaction(() => {
      this.dispatch('addressInfo', addressInfo);
      this.dispatch('switchAddressFormVisible', true);
    });
  };

  /**
   * 清出actor中的收货信息
   */
  clearAddressInfo = () => {
    this.dispatch('addrs:clearInfo');
  };

  /**
   * 删除收货地址
   */
  onDeleteAddress = async (addressId: string) => {
    const customerId = this.state().get('customerId');
    const { res } = await webapi.deleteCustomerAddress(addressId);

    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除收货地址成功');
      const { res } = await webapi.fetchCustomerAddressList(customerId);
      if (res.code == Const.SUCCESS_CODE) {
        this.dispatch('customerAddressListActor: init', res.context);
      }
    } else {
      message.error(res.message);
    }
  };

  /**
   * 编辑收货地址弹框
   * @param result
   */
  switchAddressFormVisible = (result: boolean) => {
    this.transaction(() => {
      this.dispatch('switchAddressFormVisible', result);
    });
    this.dispatch('addrs:clearInfo');
  };
  /**
   * 编辑收货地址
   * @param address
   * @returns {Promise<void>}
   */
  updateCustomerAddress = async (address) => {
    const customerId = this.state().get('customerId');
    const { res } = await webapi.updateCustomerAddress({
      ...address,
      customerId
    });

    if (res.code === Const.SUCCESS_CODE) {
      message.success('更新收货地址成功');
      const { res } = await webapi.fetchCustomerAddressList(customerId);
      if (res.code == Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('switchAddressFormVisible', false);
          this.dispatch('customerAddressListActor: init', res.context);
        });
      }
    } else {
      message.error(res.message);
    }
  };

  /** ******************客户账号******************* **/
  //编辑客户银行账号
  onEditAccount = (addressInfo) => {
    this.transaction(() => {
      this.dispatch('addressInfo', addressInfo);
      this.dispatch('switchAccountFormVisible', true);
    });
  };
  //编辑银行账号弹框
  switchAccountFormVisible = (result: boolean) => {
    this.transaction(() => {
      this.dispatch('account:reset-edit-index');
      this.dispatch('switchAccountFormVisible', result);
    });
  };
  //删除银行账号
  onDeleteAccount = async (accountId) => {
    const customerId = this.state().get('customerId');
    const { res } = await webapi.deleteCustomerAccount(accountId);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除银行账号成功');
      const accRes = await webapi.fetchCustomerAccountList(customerId);
      this.dispatch('customerAccountListActor: init', accRes.res);
    } else {
      message.error(res.message);
    }
  };
  //添加银行账号
  addCustomerAccount = async (account) => {
    const customerId = this.state().get('customerId');
    const { res } = await webapi.addCustomerAccount({
      ...account,
      customerId
    });

    if (res.code === Const.SUCCESS_CODE) {
      message.success('添加银行账号成功');
      const { res } = await webapi.fetchCustomerAccountList(customerId);

      this.transaction(() => {
        this.dispatch('switchAccountFormVisible', false);
        this.dispatch('customerAccountListActor: init', res);
      });
    } else {
      message.error(res.message);
    }
  };
  //修改银行账号
  updateCustomerAccount = async (account) => {
    const customerId = this.state().get('customerId');
    const { res } = await webapi.updateCustomerAccount({
      ...account,
      customerId
    });

    if (res.code === Const.SUCCESS_CODE) {
      message.success('更新银行账户成功');
      const { res } = await webapi.fetchCustomerAccountList(customerId);

      this.transaction(() => {
        this.dispatch('account:reset-edit-index');
        this.dispatch('switchAccountFormVisible', false);
        this.dispatch('customerAccountListActor: init', res);
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改企业信息
   */
  modifyEnterpriseInfo = async () => {
    const customerForm = this.state().get('customerFormEdit');
    const socialCreditCode = customerForm.get('socialCreditCode');
    let businessLicenseUrl = customerForm.get('businessLicenseUrl');
    const images = customerForm.get('businessImages');
    if (images && images.size > 0) {
      if (
        images.get(0) &&
        images.get(0).get('response') &&
        images.get(0).get('response').size > 0
      ) {
        businessLicenseUrl = images
          .get(0)
          .get('response')
          .get(0);
      }
    }
    const customerId = customerForm.get('customerId');
    const { res } = await webapi.validateExist(customerId);
    if (res.code == config.SUCCESS_CODE) {
      if (res.context.existFlag) {
        message.error('该会员有未处理完的工单信息，不可修改');
        return false;
      }
    }

    if (socialCreditCode) {
      //校验社会信用代码
      const { res: validate } = await webapi.verifySocialCode(
        customerForm.get('socialCreditCode'),
        customerForm.get('customerId')
      );
      if (validate.code == 'K-110214') {
        Modal.confirm({
          title: '提示',
          content: '该会员的社会信用代码与其他人重复，确认后将在工单处理？',
          onOk: () => {
            webapi
              .modifyEnterpriseInfo({
                customerId: customerForm.get('customerId'),
                enterpriseName: customerForm.get('enterpriseName'),
                socialCreditCode: customerForm.get('socialCreditCode'),
                businessLicenseUrl: businessLicenseUrl,
                customerRegisterType: customerForm.get('customerRegisterType')
              })
              .then((result) => {
                if (result.res.code === config.SUCCESS_CODE) {
                  message.success('保存成功');
                  this.dispatch('customerActor: initFresh', customerForm);
                  this.enterpriseModalShow(false);
                } else {
                  message.error(result.res.message);
                }
              });
          }
        });
      } else {
        webapi
          .modifyEnterpriseInfo({
            customerId: customerForm.get('customerId'),
            enterpriseName: customerForm.get('enterpriseName'),
            socialCreditCode: customerForm.get('socialCreditCode'),
            businessLicenseUrl: businessLicenseUrl,
            customerRegisterType: customerForm.get('customerRegisterType')
          })
          .then((result) => {
            if (result.res.code === config.SUCCESS_CODE) {
              message.success('保存成功');
              this.dispatch('customerActor: initFresh', customerForm);
              this.enterpriseModalShow(false);
            } else {
              message.error(result.res.message);
            }
          });
      }
    } else {
      webapi
        .modifyEnterpriseInfo({
          customerId: customerForm.get('customerId'),
          enterpriseName: customerForm.get('enterpriseName'),
          socialCreditCode: customerForm.get('socialCreditCode'),
          businessLicenseUrl: businessLicenseUrl,
          customerRegisterType: customerForm.get('customerRegisterType')
        })
        .then((result) => {
          if (result.res.code === config.SUCCESS_CODE) {
            message.success('保存成功');
            this.dispatch('customerActor: initFresh', customerForm);
            this.enterpriseModalShow(false);
          } else {
            message.error(result.res.message);
          }
        });
    }
  };

  /**
   * 验证客户的身份信息
   */
  validateCustomerType = async () => {
    const customerInfo = this.state().get('customerForm');
    const parentId = customerInfo.get('parentId');
    if (parentId) {
      message.error('该账户为子账号，不可编辑');
      return false;
    }
    this.dispatch('customerActor: initEdit', customerInfo);
    this.enterpriseModalShow(true);
  };

  /**
   * 取消修改
   */
  cancelEditEnterprise = async () => {
    const customerInfo = this.state().get('customerForm');
    await this.initCustomer(customerInfo.get('customerId')).then(() => {
      this.enterpriseModalShow(false);
    });
    this.enterpriseModalShow(false);
  };

  /**
   * 解除绑定
   * @param customerId
   */
  releaseBindCustomer = async (customerId) => {
    const _self = this;
    const customerForm = this.state().get('customerForm');
    const customerRelates = customerForm.get('customerRelates');
    Modal.confirm({
      title: '提示',
      content: '您确定要与该会员解除绑定？',
      onOk() {
        //解除绑定
        webapi.releaseBindCustomer(customerId).then((res: any) => {
          if (res.res.code == config.SUCCESS_CODE) {
            if (customerRelates && customerRelates.size > 0) {
              let customerRelatesNew = customerRelates.filter(
                (item) => item.get('customerId') !== customerId
              );
              _self.dispatch('form:field', {
                field: 'customerRelates',
                value: customerRelatesNew
              });
            }
          } else {
            message.warning(res.res.message);
          }
        });
      }
    });
  };

  /**
   * 删除该会员——删除企业信息
   * @param customerId
   */
  deleteEnterpriseCustomer = async () => {
    const customerForm = this.state().get('customerForm');
    const customerRelates = customerForm.get('customerRelates');
    Modal.confirm({
      title: '提示',
      content:
        '您确定要删除该会员的企业信息么？删除后与子账号解除绑定，且为普通用户，请谨慎操作！！！',
      onOk() {
        //解除绑定
        webapi
          .releaseBindCustomer(customerForm.get('customerId'))
          .then((res: any) => {
            if (res.res.code == config.SUCCESS_CODE) {
              if (customerRelates && customerRelates.size > 0) {
                message.warning('操作成功');
                window.location.reload();
              }
            } else {
              message.warning(res.res.message);
            }
          });
      }
    });
  };

  /**
   * 设置企业会员信息修改modal可见
   * @param flag
   */
  enterpriseModalShow = (flag) => {
    this.dispatch('enterprise:modal:show', flag);
  };

  /** ****************************客户增票资质****************************** */
  // //保存
  // addCustomerInvoice = async (invoice) => {
  //   const customerId = this.state().get('customerId')
  //   const {res} = await webapi.addCustomerInvoice(invoice)
  //   if (res.code === Const.SUCCESS_CODE) {
  //     message.success('添加增票资质成功')
  //     const { res } = await webapi.fetchCustomerInvoice(customerId)
  //
  //     this.transaction(() => {
  //       // this.dispatch('switchAccountFormVisible', false)
  //       // this.dispatch('customerAccountListActor: init', res)
  //     })
  //   } else {
  //     message.error(res.message)
  //   }
  // }
  // //修改银行账号
  // updateCustomerInvoice = async (account) => {
  //   const customerId = this.state().get('customerId')
  //   const { res } = await webapi.updateCustomerInvoice(account)
  //
  //   if (res.code === Const.SUCCESS_CODE) {
  //     message.success('更新增票资质成功')
  //     const { res } = await webapi.fetchCustomerInvoice(customerId)
  //
  //     this.transaction(() => {
  //       // this.dispatch('account:reset-edit-index')
  //       // this.dispatch('switchAccountFormVisible', false)
  //       // this.dispatch('customerAccountListActor: init', res)
  //     })
  //   } else {
  //     message.error(res.message)
  //   }
  // }
  //
  // onSave = async (customerForm) => {
  //   //保存
  //   const {res} = await webapi.saveCustomer(customerForm)
  //   if (res.code === Const.SUCCESS_CODE) {
  //     message.info(res.message)
  //     this.dispatch('modal:hide')
  //     this.init()
  //   } else {
  //     message.error(res.message)
  //   }
  // }
}
