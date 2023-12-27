import { Actor, Action, IMap } from 'plume2';

export default class CustomerEditActor extends Actor {
  //数据源
  defaultState() {
    return {
      customerForm: {
        // 会员详细信息标识
        customerDetailId: '',
        // 会员ID
        customerId: '',
        //客户名称
        customerName: '',
        // 省
        provinceId: '',
        // 市
        cityId: '',
        // 区
        areaId: '',
        //详细地址
        customerAddress: '',
        //联系人姓名
        contactName: '',
        //联系人标签
        customerTag: '',
        //联系方式
        contactPhone: '',
        //账户名
        customerAccount: '',
        //会员等级
        customerLevelId: '',
        //负责业务员
        employeeId: '',
        //负责白鲸管家
        managerId:'',
        //企业信息
        enterpriseInfo: {},
        //会员注册类型
        customerRegisterType: '',
        //喜吖吖 企业购会员审核状态  0：无状态 1：待审核 2：已审核 3：审核未通过
        enterpriseStatusXyy: '',
        //营业执照地址
        businessLicenseUrl: '',
        //营业执照的地址——图片上传的结构
        businessImages: '',
        //统一社会信用代码
        socialCreditCode: '',
        //企业名称
        enterpriseName: '',
        //父Id
        parentId: '',
        // 标星
        beaconStar: null,
        // 操作人
        updatePersonName: null,
        //关联子账号
        customerRelates: []
      },
      customerFormEdit: {
        // 会员详细信息标识
        customerDetailId: '',
        // 会员ID
        customerId: '',
        //客户名称
        customerName: '',
        // 省
        provinceId: '',
        // 市
        cityId: '',
        // 区
        areaId: '',
        //详细地址
        customerAddress: '',
        //联系人姓名
        contactName: '',
        //联系人标签
        customerTag: '',
        //联系方式
        contactPhone: '',
        //账户名
        customerAccount: '',
        //会员等级
        customerLevelId: '',
        //负责业务员
        employeeId: '',
        //企业信息
        enterpriseInfo: {},
        //会员注册类型
        customerRegisterType: '',
        //喜吖吖 企业购会员审核状态  0：无状态 1：待审核 2：已审核 3：审核未通过
        enterpriseStatusXyy: '',
        //营业执照地址
        businessLicenseUrl: '',
        //营业执照的地址——图片上传的结构
        businessImages: '',
        //统一社会信用代码
        socialCreditCode: '',
        //企业名称
        enterpriseName: '',
        //父Id
        parentId: '',
        //关联子账号
        customerRelates: []
      },
      customerId: '',
      customerBean: {
        //审核状态
        checkState: '',
        //驳回理由
        rejectReason: '',
        //客户状态
        customerStatus: '',
        //禁用理由
        forbidReason: '',
        //客户类型
        customerType: '',
        //商家名称
        supplierName: '',
        //企业信息
        enterpriseInfo: {}
      },
      enterpriseModalVisible: false
    };
  }

  constructor() {
    super();
  }

  /**
   * 修改客户信息
   * @param state
   * @param data
   */
  @Action('customerActor: init')
  init(state: IMap, customer) {
    console.log(customer.getIn(['customerDetail', 'beaconStar']),'8888');
    
    return state
      .setIn(['customerId'], customer.getIn(['customerId']))
      .setIn(['customerBean', 'checkState'], customer.getIn(['checkState']))
      .setIn(
        ['customerBean', 'rejectReason'],
        customer.getIn(['customerDetail', 'rejectReason'])
      )
      .setIn(
        ['customerBean', 'customerStatus'],
        customer.getIn(['customerDetail', 'customerStatus'])
      )
      .setIn(
        ['customerBean', 'forbidReason'],
        customer.getIn(['customerDetail', 'forbidReason'])
      )
      .setIn(['customerBean', 'customerType'], customer.getIn(['customerType']))
      .setIn(['customerBean', 'supplierName'], customer.getIn(['supplierName']))
      .setIn(['customerForm', 'beaconStar'],  customer.getIn(['customerDetail', 'beaconStar']))
      .setIn(['customerForm', 'updatePersonName'],  customer.getIn(['customerDetail', 'updatePersonName']))

      .setIn(
        ['customerBean', 'isDistributor'],
        customer.getIn(['customerDetail', 'isDistributor'])
      )
      .setIn(
        ['customerForm', 'customerDetailId'],
        customer.getIn(['customerDetail', 'customerDetailId'])
      )
      .setIn(
        ['customerForm', 'customerId'],
        customer.getIn(['customerDetail', 'customerId'])
      )
      .setIn(
        ['customerForm', 'customerName'],
        customer.getIn(['customerDetail', 'customerName'])
      )
      .setIn(
        ['customerForm', 'provinceId'],
        customer.getIn(['customerDetail', 'provinceId'])
      )
      .setIn(
        ['customerForm', 'cityId'],
        customer.getIn(['customerDetail', 'cityId'])
      )
      .setIn(
        ['customerForm', 'areaId'],
        customer.getIn(['customerDetail', 'areaId'])
      )
      .setIn(
        ['customerForm', 'customerAddress'],
        customer.getIn(['customerDetail', 'customerAddress'])
      )
      .setIn(
        ['customerForm', 'contactName'],
        customer.getIn(['customerDetail', 'contactName'])
      )
      .setIn(['customerForm', 'customerTag'], customer.getIn(['customerTag']))
      .setIn(
        ['customerForm', 'contactPhone'],
        customer.getIn(['customerDetail', 'contactPhone'])
      )
      .setIn(
        ['customerForm', 'customerAccount'],
        customer.getIn(['customerAccount'])
      )
      .setIn(
        ['customerForm', 'customerLevelId'],
        customer.getIn(['customerLevelId'])
      )
      .setIn(
        ['customerForm', 'employeeId'],
        customer.getIn(['customerDetail', 'employeeId'])
      )
      .setIn(
        ['customerForm', 'enterpriseCheckState'],
        customer.getIn(['enterpriseCheckState'])
      )
      .setIn(
        ['customerForm', 'customerRegisterType'],
        customer.getIn(['customerRegisterType'])
      )
      .setIn(
        ['customerForm', 'enterpriseName'],
        customer.getIn(['enterpriseName'])
      )
      .setIn(
        ['customerForm', 'enterpriseInfo'],
        customer.getIn(['enterpriseInfo'])
      )
      .setIn(
        ['customerForm', 'businessLicenseUrl'],
        customer.getIn(['businessLicenseUrl'])
      )
      .setIn(
        ['customerForm', 'socialCreditCode'],
        customer.getIn(['socialCreditCode'])
      )
      .setIn(
        ['customerForm', 'enterpriseStatusXyy'],
        customer.getIn(['enterpriseStatusXyy'])
      ) .setIn(
        ['customerForm', 'enterpriseStatusXyy'],
        customer.getIn(['enterpriseStatusXyy'])
      ).setIn(
        ['customerForm', 'managerId'],
        customer.getIn(['customerDetail', 'managerId'])||'2c8080815cd3a74a015cd3ae86850001'
      )
      .setIn(
        ['customerForm', 'customerRelates'],
        customer.get('childCustomers')
      );
  }

  @Action('customerActor: initFresh')
  initFresh(state: IMap, customer) {
    return state.set('customerForm', customer);
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['customerForm', field], value);
  }

  @Action('customerActor: initEdit')
  initEdit(state: IMap, customer) {
    return state.set('customerFormEdit', customer);
  }

  @Action('form:fieldEdit')
  changeFieldEdit(state: IMap, { field, value }) {
    return state.setIn(['customerFormEdit', field], value);
  }

  @Action('form:updateEnterpriseInfo')
  updateEnterpriseInfo(state: IMap, { field, value }) {
    return state.setIn(['customerForm', 'enterpriseInfo', field], value);
  }

  @Action('form:setCustomerRelates')
  setCustomerRelates(state: IMap, customerRelates) {
    console.log(
      'form:setCustomerRelates=====>' + JSON.stringify(customerRelates)
    );
    return state.set('customerRelates', customerRelates);
  }

  @Action('enterprise:modal:show')
  enterpriseModalShow(state, flag) {
    return state.set('enterpriseModalVisible', flag);
  }
}
