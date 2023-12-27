const routes = [
  //首页
  { path: '/', exact: true, asyncComponent: () => import('./home') },
  {
    path: '/rmf-model',
    exact: true,
    asyncComponent: () => import('./crm/rmf-model')
  },
  {
    path: '/operational-planning/:planId',
    exact: true,
    asyncComponent: () => import('./crm/operational-planning')
  },
  //新增人群运行计划
  {
    path: '/add-crowd-operations/:id?/:ifModify?',
    exact: true,
    asyncComponent: () => import('./crm/add-crowd-operations')
  },

  {
    path: '/app-push',
    exact: true,
    asyncComponent: () => import('./sms/app-push')
  },
  {
    path: '/station-message',
    exact: true,
    asyncComponent: () => import('./sms/station-message')
  },
  //短信
  {
    path: '/sms-reach',
    exact: true,
    asyncComponent: () => import('./sms/sms-reach')
  },
  //短信
  {
    path: '/sms-template/:type/:id?',
    exact: true,
    asyncComponent: () => import('./sms/sms-template')
  },
  {
    path: '/app-monitor',
    asyncComponent: () => import('./app-monitor')
  },
  //短信
  {
    path: '/add-signature/:id?',
    exact: true,
    asyncComponent: () => import('./sms/add-signature')
  },
  //会员标签
  {
    path: '/custom-tag',
    exact: true,
    asyncComponent: () => import('./crm/custom-tag')
  },
  // RFM模型调参
  {
    path: '/rmf-config',
    exact: true,
    asyncComponent: () => import('./crm/rmf-config')
  },
  // 会员分群
  {
    path: '/customer-group',
    exact: true,
    asyncComponent: () => import('./crm/customer-group')
  },
  // 运营计划
  {
    path: '/customer-plan-list',
    exact: true,
    asyncComponent: () => import('./crm/customer-plan-list')
  },
  //分销记录
  {
    path: '/distribution-record/:customerId?/:customerAccount?',
    exact: true,
    asyncComponent: () => import('./distribution-record')
  },
  //订单列表
  {
    path: '/order-list',
    exact: true,
    asyncComponent: () => import('./order-list')
  },
  //囤货订单列表
  {
    path: '/th_order-list',
    exact: true,
    asyncComponent: () => import('./th_order-list')
  },

  // 打印
  {
    path: '/dd_order-detail-print/:tid',
    exact: true,
    asyncComponent: () => import('./dd_order-detail-print')
  },
  // 囤货打印
  {
    path: '/th_order-detail-print/:tid',
    exact: true,
    asyncComponent: () => import('./th_order-detail-print')
  },
  //订单-详情
  {
    path: '/order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail')
  },
  //囤货订单-详情
  {
    path: '/th_order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./th_order-detail')
  },
  //订单-退单列表
  {
    path: '/order-return-list',
    exact: true,
    asyncComponent: () => import('./order-return-list')
  },
  {
    path: '/recharge-list',
    exact: true,
    asyncComponent: () => import('./recharge-list')
  },
  //囤货订单-退单列表
  {
    path: '/th_order-return-list',
    exact: true,
    asyncComponent: () => import('./th_order-return-list')
  },
  // {
  //   path: '/app-monitor',
  //   exact: true,
  //   asyncComponent: () => import('./app-monitor')
  // },
  //订单-订单管理-退单详情
  {
    path: '/order-return-detail/:rid',
    exact: true,
    asyncComponent: () => import('./order-return-detail')
  },
  //囤货订单-订单管理-退单详情
  {
    path: '/th_order-return-detail/:rid',
    exact: true,
    asyncComponent: () => import('./th_order-return-detail')
  },
  //财务-收款账户
  {
    path: '/finance-account-receivable',
    asyncComponent: () => import('./finance-account-receivable')
  },
  //财务-付款账户
  {
    path: '/finance-account-payment',
    asyncComponent: () => import('./finance-account-payment')
  },
  //订单收款
  {
    path: '/finance-order-receive',
    asyncComponent: () => import('./finance-order-receive')
  },
  //退单退款
  {
    path: '/finance-refund',
    asyncComponent: () => import('./finance-refund')
  },
  //收款详情
  {
    path: '/finance-receive-detail',
    asyncComponent: () => import('./finance-receive-detail')
  },
  //退款明细
  {
    path: '/finance-refund-detail',
    asyncComponent: () => import('./finance-refund-detail')
  },
  //增值税资质审核
  {
    path: '/finance-val-added-tax',
    asyncComponent: () => import('./finance-val-added-tax')
  },
  //订单开票
  {
    path: '/finance-order-ticket',
    asyncComponent: () => import('./finance-order-ticket')
  },
  // 员工列表
  {
    path: '/employee-list',
    asyncComponent: () => import('./employee-list')
  },
  // 员工导入
  {
    path: '/employee-import',
    asyncComponent: () => import('./employee-import')
  },
  // 部门管理
  {
    path: '/department-mangement',
    asyncComponent: () => import('./department-mangement')
  },
  // 部门导入
  {
    path: '/department-import',
    asyncComponent: () => import('./department-import')
  },
  // 角色列表
  {
    path: '/role-list',
    asyncComponent: () => import('./role-list')
  },
  // 权限管理
  {
    path: '/authority-manage',
    asyncComponent: () => import('./authority-manage')
  },
  // 权限分配
  {
    path: '/authority-allocating/:roleInfoId/:roleName',
    asyncComponent: () => import('./authority-allocating')
  },
  // 商品缺货记录
  {
    path: '/goods-outStock-list',
    asyncComponent: () => import('./goods-outStock-list')
  },
  // 商品品牌
  {
    path: '/goods-brand',
    asyncComponent: () => import('./goods-brand')
  },
  // 商品类目品牌排序
  {
    path: '/goods-cate-brand',
    asyncComponent: () => import('./goods-cate-brand')
  },
  // 商品分类
  { path: '/goods-cate', asyncComponent: () => import('./goods-cate') },
  // 设置推荐类目
  {
    path: '/goods-recomcate',
    asyncComponent: () => import('./goods-recomcate')
  },
  //商品分类导入
  {
    path: '/goods-cate-import',
    asyncComponent: () => import('./goods-cate-import')
  }, // 商品属性
  {
    path: '/goods-prop/:cid',
    exact: true,
    asyncComponent: () => import('./goods-prop')
  },
  //商品列表
  { path: '/goods-list', asyncComponent: () => import('./goods-list') },
  //零售商品列表
  { path: '/ls_goods-list', asyncComponent: () => import('./ls_goods-list') },
  //散批商品列表
  { path: '/bd_goods-list', asyncComponent: () => import('./bd_goods-list') },
  //商品推荐
  {
    path: '/goods-recommend',
    asyncComponent: () => import('./goods-recommend')
  },
  // 客户列表
  {
    path: '/customer-list',
    asyncComponent: () => import('./customer-list')
  },
  // 客户列表
  {
    path: '/customer-child-list/:customerId',
    asyncComponent: () => import('./customer-child-list')
  },
  // 客户导入
  {
    path: '/customer-import',
    asyncComponent: () => import('./customer-import')
  },
  // 客户成长值
  {
    path: '/customer-grow-value/:customerId/:enterpriseCustomer?',
    asyncComponent: () => import('./customer-grow-value')
  },
  // 客户等级
  {
    path: '/customer-grade',
    asyncComponent: () => import('./customer-grade')
  },
  {
    path: '/customer-equities',
    exact: true,
    asyncComponent: () => import('./customer-equities')
  },
  // 客户详情
  {
    path: '/customer-detail/:customerId/:vipflg',
    asyncComponent: () => import('./crm/customer-detail')
  },
  // crm版客户详情
  {
    path: '/crm-customer-detail/:customerId',
    asyncComponent: () => import('./crm/customer-detail')
  },
  // 客户等级
  {
    path: '/customer-level',
    asyncComponent: () => import('./customer-level')
  },
  // 成长值设置
  {
    path: '/growth-value-setting',
    asyncComponent: () => import('./growth-value-setting')
  },
  // 满系图标
  {
    path: '/full-system-Icon',
    asyncComponent: () => import('./full-system-Icon')
  },
  // 积分设置
  {
    path: '/points-setting',
    asyncComponent: () => import('./points-setting')
  },
  // 首页设置
  {
    path: '/home-page-settings',
    asyncComponent: () => import('./home-page-setting')
  },

  // 基本设置
  {
    path: '/basic-setting',
    asyncComponent: () => import('./basic-setting')
  },
  // 配送文案
  {
    path: '/home-delivery-setting',
    asyncComponent: () => import('./home-delivery-setting')
  },
  // 招商页设置
  {
    path: '/business-setting',
    asyncComponent: () => import('./business-setting')
  },
  // 公司设置
  {
    path: '/company-information',
    asyncComponent: () => import('./company-information')
  },
  //轮播管理
  {
    path: '/banner-admin',
    asyncComponent: () => import('./banner-admin')
  },

  //页面管理
  {
    path: '/page-manage/weixin',
    asyncComponent: () => import('./page-manage')
  },
  //页面投放
  {
    path: '/page-manage-drop/:pageCode/:pageId/:pageType/:platform',
    asyncComponent: () => import('./page-manage-drop')
  },
  //模板管理
  {
    path: '/template-manage/weixin',
    asyncComponent: () => import('./template-manage')
  },
  //页面管理
  {
    path: '/page-manage/pc',
    asyncComponent: () => import('./page-manage')
  },
  //模板管理
  {
    path: '/template-manage/pc',
    asyncComponent: () => import('./template-manage')
  },
  // 图片库
  {
    path: '/picture-store',
    asyncComponent: () => import('./picture-store')
  },
  // 视频库
  {
    path: '/video-store',
    asyncComponent: () => import('./video-store')
  },
  // 图片分类
  {
    path: '/picture-cate',
    asyncComponent: () => import('./picture-cate')
  },
  // 素材分类
  {
    path: '/resource-cate',
    asyncComponent: () => import('./resource-cate')
  },
  // 邮箱接口
  { path: '/mail-port', asyncComponent: () => import('./mail-port') },
  // ERP接口
  { path: '/erp-port', asyncComponent: () => import('./erp-port') },
  // 邮箱接口
  {
    path: '/picture-port',
    asyncComponent: () => import('./picture-port')
  },
  // 对象存储
  {
    path: '/resource-port',
    asyncComponent: () => import('./resource-port')
  },
  // 物流接口
  {
    path: '/express-port',
    asyncComponent: () => import('./express-port')
  },
  // 账号管理
  {
    path: '/account-manage',
    asyncComponent: () => import('./account-manage')
  },
  // 物流公司管理
  {
    path: '/logistics-manage',
    asyncComponent: () => import('./logistics-manage')
  },

  {
    path: '/logistics-company',
    asyncComponent: () => import('./logistics-company')
  },
  // 物流公司设置
  {
    path: '/logistics-company-setting',
    asyncComponent: () => import('./logistics-company-setting')
  },
  {
    path: '/logistics-company-import',
    asyncComponent: () => import('./logistics-company-import')
  },
  //网点管理
  {
    path: '/network-management',
    asyncComponent: () => import('./network-management')
  },
  //商家列表
  {
    path: '/supplier-list',
    asyncComponent: () => import('./supplier-list')
  },
  //供应商列表
  {
    path: '/supplier-list-provider',
    asyncComponent: () => import('./supplier-list-provider')
  },
  //导航设置
  {
    path: '/navigation-settings',
    asyncComponent: () => import('./navigation-settings')
  },
  //首页广告列表
  {
    path: '/pagehome-adtt',
    asyncComponent: () => import('./pagehome-adtt')
  },
  {
    path: '/start-up',
    asyncComponent: () => import('./start-up')
  },
  {
    path: '/start-add/:advertisingId?',
    asyncComponent: () => import('./start-add')
  },
  //新增轮播图推荐位表
  {
    path: '/pagehome-swit/:wareId?/:advertisingId?',
    asyncComponent: () => import('./pagehome-swit')
  },
  //新增分栏推荐位表
  {
    path: '/pageclass-addtl/:wareId?/:advertisingId?',
    asyncComponent: () => import('./pageclass-addtl')
  },
  //新增通栏推荐位表
  {
    path: '/pagehome-addtl/:wareId?/:advertisingId?',
    asyncComponent: () => import('./pagehome-addtl')
  },
  {
    path: '/goods-label',
    asyncComponent: () => import('./goods-label')
  },
  //商家编辑
  {
    path: '/supplier-edit/:sid',
    asyncComponent: () => import('./supplier-edit')
  },
  //商家详情
  {
    path: '/supplier-detail/:sid',
    asyncComponent: () => import('./supplier-detail')
  },
  //订单设置
  {
    path: '/order-setting',
    asyncComponent: () => import('./order-setting')
  },
  //打包设置
  {
    path: '/pack',
    asyncComponent: () => import('./pack')
  },
  //大于小于1千克设置
  {
    path: '/greater',
    asyncComponent: () => import('./greater')
  },
  //审核管理
  {
    path: '/check-manage',
    asyncComponent: () => import('./check-manage')
  },
  //操作日志
  {
    path: '/operation-log',
    asyncComponent: () => import('./operation-log')
  },
  //商品详情
  {
    path: '/goods-detail/:gid/:pageNum',
    asyncComponent: () => import('./goods-detail')
  },
  //商品详情
  {
    path: '/ls_goods-detail/:gid/:pageNum',
    asyncComponent: () => import('./ls_goods-detail')
  },
  //第三方商家商品详情
  {
    path: '/goods-detail-third/:gid/:pageNum',
    asyncComponent: () => import('./goods-detail-third')
  },
  //散批商品详情
  {
    path: '/bd_goods-detail/:gid/:pageNum',
    asyncComponent: () => import('./bd_goods-detail')
  },
  //散批首页banner设置
  {
    path: '/bd-banner',
    asyncComponent: () => import('./bd-banner')
  },
  //散批首页商品推荐
  {
    path: '/bd-recommendation',
    asyncComponent: () => import('./bd-recommendation')
  },
  //供应商商品详情
  {
    path: '/goods-detail-provider/:gid',
    asyncComponent: () => import('./goods-detail-provider')
  },
  //商品SKU详情
  {
    path: '/goods-sku-detail/:pid',
    asyncComponent: () => import('./goods-sku-detail')
  },
  //商品SKU详情
  {
    path: '/ls_goods-sku-detail/:pid',
    asyncComponent: () => import('./ls_goods-sku-detail')
  },
  //散批商品SKU详情
  {
    path: '/bd_goods-sku-detail/:pid',
    asyncComponent: () => import('./bd_goods-sku-detail')
  },
  //供应商商品SKU详情
  {
    path: '/goods-sku-detail-provider/:pid',
    asyncComponent: () => import('./goods-sku-detail-provider')
  },
  //待审核商品列表对应的商品详情
  {
    path: '/goods-check-detail/:gid',
    asyncComponent: () => import('./goods-detail')
  },
  //供应商待审核商品列表对应的商品详情
  {
    path: '/goods-check-detail-provider/:gid',
    asyncComponent: () => import('./goods-detail-provider')
  },
  //待审核商品列表对应的商品SKU详情
  {
    path: '/goods-sku-check-detail/:pid',
    asyncComponent: () => import('./goods-sku-detail')
  },
  //供应商待审核商品列表对应的商品SKU详情
  {
    path: '/goods-sku-check-detail-provider/:pid',
    asyncComponent: () => import('./goods-sku-detail-provider')
  },
  //商家收款账户
  {
    path: '/supplier-account',
    asyncComponent: () => import('./supplier-account')
  },
  {
    path: '/account_money',
    asyncComponent: () => import('./account_money')
  },
  // 调账明细
  {
    path: '/account-adj',
    asyncComponent: () => import('./account-adj')
  },
  //余额明细
  {
    path: '/account-detail',
    asyncComponent: () => import('./account-detail')
  },
  //余额申请
  {
    path: '/balance-apply',
    asyncComponent: () => import('./balance-apply')
  },
  //余额说明
  {
    path: '/balance-instructions',
    asyncComponent: () => import('./balance-instructions')
  },
  //散批首页广告位管理
  {
    path: '/batch-advertising',
    asyncComponent: () => import('./batch-advertising')
  },
  //散批推荐类目
  {
    path: '/batch-recommend',
    asyncComponent: () => import('./batch-recommend')
  },
  //散批三级类目排序
  {
    path: '/batch-category-three',
    asyncComponent: () => import('./batch-category-three')
  },
  //散批三级类目排序商品排序
  {
    path: '/batch-category-three-goods/:id?',
    asyncComponent: () => import('./batch-category-three-goods')
  },
  //散批爆款时刻
  {
    path: '/batch-style-moment',
    asyncComponent: () => import('./batch-style-moment')
  },
  //散批爆款时刻详情
  {
    path: '/batch-style-moment-dis/:type/:id?',
    asyncComponent: () => import('./batch-style-moment-dis')
  },
  //散批二级类目排序
  {
    path: '/batch-category-two',
    asyncComponent: () => import('./batch-category-two')
  },
  //散批推荐类目
  {
    path: '/batch-Surprise',
    asyncComponent: () => import('./batch-Surprise')
  },
  //散批首页广告位管理添加
  {
    path: '/batch-advertising-dis/:adTyle/:type/:id?',
    asyncComponent: () => import('./batch-advertising-dis')
  },
  //商品审核
  {
    path: '/goods-check',
    asyncComponent: () => import('./goods-check')
  },
  //确认账号
  {
    path: '/confirm-account/:tid',
    asyncComponent: () => import('./confirm-account')
  },
  //查询明细
  {
    path: '/query-details',
    asyncComponent: () => import('./query-details')
  },
  //资金管理-财务对账
  {
    path: '/finance-manage-check',
    asyncComponent: () => import('./finance-manage-check')
  },
  //资金管理-会员提现管理
  {
    path: '/customer-draw-cash',
    asyncComponent: () => import('./customer-draw-cash')
  },
  //对账明细
  {
    path: '/reconciliation-details',
    asyncComponent: () => import('./reconciliation-details')
  },
  //商家结算
  {
    path: '/finance-manage-settle',
    asyncComponent: () => import('./finance-manage-settle')
  },
  //供应商结算
  {
    path: '/finance-manage-provider-settle',
    asyncComponent: () => import('./finance-manage-provider-settle')
  },
  //供应商结算明细
  {
    path: '/billing-provider-details/:settleId',
    asyncComponent: () => import('./billing-provider-details')
  },
  //结算明细
  {
    path: '/billing-details/:settleId',
    asyncComponent: () => import('./billing-details')
  },
  //对账明细
  {
    path: '/finance-manage-refund/:sid/:kind',
    asyncComponent: () => import('./finance-manage-refund')
  },
  //流量统计
  {
    path: '/flow-statistics',
    asyncComponent: () => import('./flow-statistics')
  },
  //交易统计
  {
    path: '/trade-statistics',
    asyncComponent: () => import('./trade-statistics')
  },
  //商品统计
  {
    path: '/goods-statistics',
    asyncComponent: () => import('./goods-statistics')
  },
  //客户统计
  {
    path: '/customer-statistics',
    asyncComponent: () => import('./customer-statistics')
  },
  //业务员统计
  {
    path: '/employee-statistics',
    asyncComponent: () => import('./employee-statistics')
  },
  //报表下载
  {
    path: '/download-report',
    asyncComponent: () => import('./download-report')
  },
  //新增商品库商品
  {
    path: '/goods-library-add',
    asyncComponent: () => import('./goods-library-detail')
  },
  //编辑商品库商品
  {
    path: '/goods-library-detail/:goodsId',
    asyncComponent: () => import('./goods-library-detail')
  },
  //编辑商品库商品
  {
    path: '/goods-library-provider-detail/:goodsId',
    asyncComponent: () => import('./goods-library-provider-detail')
  },
  //商品库列表
  {
    path: '/goods-library-list',
    asyncComponent: () => import('./goods-library-list')
  },
  //供应商商品库列表
  {
    path: '/goods-library-provider-list',
    asyncComponent: () => import('./goods-library-provider-list')
  },
  //编辑商品库商品sku
  {
    path: '/goods-library-sku-editor/:goodsId',
    asyncComponent: () => import('./goods-library-sku-editor')
  },
  //商品库商品导入
  {
    path: '/goods-library-import',
    asyncComponent: () => import('./goods-library-import')
  },

  //在线客服
  {
    path: '/online-service',
    asyncComponent: () => import('./online-service')
  },
  // IM设置
  {
    path: '/im-setting-index',
    asyncComponent: () => import('./online-service/im-setting-index')
  },
  //登录接口
  {
    path: '/login-interface',
    asyncComponent: () => import('./login-interface')
  },
  //分享接口
  {
    path: '/share-interface',
    asyncComponent: () => import('./share-interface')
  },
  //邮箱接口
  {
    path: '/email-interface',
    asyncComponent: () => import('./email-interface')
  },
  //小程序接口
  {
    path: '/mini-interface',
    asyncComponent: () => import('./mini-interface')
  },
  // 优惠券列表
  {
    path: '/coupon-list',
    asyncComponent: () => import('./coupon-list')
  },
  // 优惠券详情
  {
    path: '/coupon-detail/:cid',
    asyncComponent: () => import('./coupon-detail')
  },
  // 营销中心
  {
    path: '/marketing-center',
    asyncComponent: () => import('./marketing-center')
  },
  //创建/编辑指定商品赠券
  {
    path: '/coupon-goods-add/:activityId?',
    asyncComponent: () => import('./coupon-goods-add')
  },
  // 营销中心 - 创建优惠券
  {
    path: '/coupon-add',
    asyncComponent: () => import('./coupon')
  },
  // 营销中心 - 编辑优惠券
  {
    path: '/coupon-edit/:cid',
    asyncComponent: () => import('./coupon')
  },
  //优惠券分类
  {
    path: '/coupon-cate',
    asyncComponent: () => import('./coupon-cate')
  },
  // 优惠券活动
  {
    path: '/coupon-activity-list',
    asyncComponent: () => import('./coupon-activity-list')
  },
  // 优惠券活动详情
  {
    path: '/coupon-activity-detail/:id/:type',
    asyncComponent: () => import('./coupon-activity-detail')
  },
  // 返鲸币活动
  {
    path: '/jinbi-return-list',
    asyncComponent: () => import('./jinbi-return-list')
  },
  // 返鲸币活动详情
  {
    path: '/jinbi-return-details/:activityId/:pageNum?',
    asyncComponent: () => import('./jinbi-return-details')
  },
  // 报表下载
  {
    path: '/report',
    asyncComponent: () => import('./report')
  },
  // 创建/编辑全场赠券活动
  {
    path: '/coupon-activity-all-present/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/all-present')
  },
  //创建/编辑注册赠券活动
  {
    path: '/coupon-activity-registered/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/registered')
  },
  //创建/编辑企业购注册赠券活动
  {
    path: '/coupon-activity-registered-qyg/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/registered-qyg')
  },
  //创建/编辑指定赠券活动
  {
    path: '/coupon-activity-specify/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/specify')
  },
  // 整点秒杀
  {
    path: '/flash-sale',
    exact: true,
    asyncComponent: () => import('./flash-sale')
  },
  // 积分商品列表
  {
    path: '/points-goods-list',
    exact: true,
    asyncComponent: () => import('./points-goods-list')
  },
  // 添加积分商品
  {
    path: '/points-goods-add',
    exact: true,
    asyncComponent: () => import('./points-goods-add')
  },
  // 积分商品导入
  {
    path: '/points-goods-import',
    exact: true,
    asyncComponent: () => import('./points-goods-import')
  },
  // 添加积分优惠券
  {
    path: '/points-coupon-add',
    exact: true,
    asyncComponent: () => import('./points-coupon-add')
  },
  // 关于我们
  {
    path: '/about-us',
    asyncComponent: () => import('./about-us')
  },
  //APP分享
  {
    path: '/app-share',
    asyncComponent: () => import('./app-share')
  },
  // APP检测升级更新
  {
    path: '/upgrade-setting',
    asyncComponent: () => import('./upgrade-setting')
  },
  // IOS APP检测升级更新
  {
    path: '/IOS_tesing',
    asyncComponent: () => import('./IOS_tesing')
  },
  //会员资金
  {
    path: '/customer-funds',
    asyncComponent: () => import('./customer-funds')
  },
  //余额明细
  {
    path: '/customer-funds-detail/:customerId',
    exact: true,
    asyncComponent: () => import('./customer-funds-detail')
  },
  //新增编辑商品分销素材
  {
    path: '/distribution-goods-matter/:id?',
    asyncComponent: () => import('./distribution-goods-matter')
  },
  //商品分销素材列表
  {
    path: '/distribution-goods-matter-list',
    asyncComponent: () => import('./distribution-goods-matter-list')
  },
  {
    path: '/distribution-goods-matter-list-new',
    asyncComponent: () => import('./distribution-goods-matter-list-new')
  },
  {
    path: '/distribution-goods-matter-add',
    asyncComponent: () => import('./distribution-goods-matter-add')
  },
  //邀新设置
  {
    path: '/invite-new-settings',
    asyncComponent: () => import('./invite-new-settings')
  },
  //邀新统计
  {
    path: '/invite-new-statistical',
    asyncComponent: () => import('./invite-new-statistical')
  },
  //邀新记录
  {
    path: '/invite-new-record/:customerId?/:customerAccount?',
    asyncComponent: () => import('./invite-new-record')
  },
  // 分销设置
  {
    path: '/distribution-setting',
    asyncComponent: () => import('./distribution-setting')
  },
  //分销员
  {
    path: '/distribution-customer',
    asyncComponent: () => import('./distribution-customer')
  },
  //分销佣金
  {
    path: '/distribution-commission',
    asyncComponent: () => import('./distribution-commission')
  },
  //分销商品
  {
    path: '/distribution-goods-list',
    asyncComponent: () => import('./distribution-goods-list')
  },
  //佣金明细
  {
    path: '/commission-detail/:tid',
    exact: true,
    asyncComponent: () => import('./commission-detail')
  },
  //敏感词列表
  {
    path: '/sensitive-words',
    asyncComponent: () => import('./sensitive-words')
  },
  //商家评价列表
  {
    path: '/supplier-evaluate-list',
    asyncComponent: () => import('./store-evaluate-list')
  },
  //商品评价列表
  {
    path: '/goods-evaluate-list',
    asyncComponent: () => import('./goods-evaluate-list')
  },
  //积分列表
  {
    path: '/points-list',
    exact: true,
    asyncComponent: () => import('./points-list')
  },
  //积分详情
  {
    path: '/points-details/:cid',
    exact: true,
    asyncComponent: () => import('./points-detail')
  },
  //积分订单列表
  {
    path: '/points-order-list',
    exact: true,
    asyncComponent: () => import('./points-order-list')
  },
  //积分订单-详情
  {
    path: '/points-order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./points-order-detail')
  },
  //拼团活动列表
  {
    path: '/groupon-activity-list',
    asyncComponent: () => import('./groupon-activity-list')
  },
  //拼团设置
  {
    path: '/groupon-setting',
    asyncComponent: () => import('./groupon-setting')
  },
  //拼团分类
  {
    path: '/groupon-cate',
    asyncComponent: () => import('./groupon-cate')
  },
  // 拼团活动详情
  {
    path: '/groupon-detail/:activityId',
    asyncComponent: () => import('./groupon-detail')
  },
  // 秒杀活动详情
  {
    path: '/flash-sale-detail/',
    asyncComponent: () => import('./flash-sale-goods-list')
  },
  {
    path: '/not-login/:activityId?',
    asyncComponent: () => import('./not-login')
  },
  //供应商商品待审核列表
  {
    path: '/goods-check-provider',
    asyncComponent: () => import('./goods-check-provider')
  },
  // 供应商商品列表
  {
    path: '/goods-list-provider',
    asyncComponent: () => import('./goods-list-provider')
  },
  // 企业会员列表
  {
    path: '/enterprise-customer-list',
    asyncComponent: () => import('./enterprise-customer-list')
  },
  //企业购商品列表
  {
    path: '/enterprise-goods-list',
    asyncComponent: () => import('./enterprise-goods-list')
  },
  {
    path: '/work-order',
    asyncComponent: () => import('./work-order')
  },
  {
    path: '/work-details/:workOrderId',
    asyncComponent: () => import('./work-details')
  },
  // 运费模板
  {
    path: '/freight',
    asyncComponent: () => import('./freight')
  }, // 新增店铺运费模板
  {
    path: '/store-freight',
    asyncComponent: () => import('./freight-store')
  },
  // 编辑店铺运费模板
  {
    path: '/store-freight-edit/:freightId',
    asyncComponent: () => import('./freight-store')
  },
  // 新增单品运费模板
  {
    path: '/goods-freight',
    asyncComponent: () => import('./freight-goods')
  },
  // 编辑单品运费模板
  {
    path: '/goods-freight-edit/:freightId',
    asyncComponent: () => import('./freight-goods')
  },
  // 运费模板关联商品
  {
    path: '/freight-with-goods/:freightId',
    asyncComponent: () => import('./freight-with-goods')
  },
  // 小程序直播
  {
    path: '/live',
    asyncComponent: () => import('./live')
  },
  // 小程序直播详情
  {
    path: '/live-detail/:id',
    asyncComponent: () => import('./live-detail')
  },
  // app直播
  {
    path: '/app-live',
    asyncComponent: () => import('./app-live')
  },
  // app直播详情
  {
    path: '/app-live-dis/:id',
    asyncComponent: () => import('./app-live-dis')
  },
  // 竞价配置
  {
    path: '/bidding',
    asyncComponent: () => import('./bidding')
  },
  // 竞价商品添加
  {
    path: '/bidding-add/:bid?',
    asyncComponent: () => import('./bidding-add')
  },
  // 竞价商品添加
  {
    path: '/bidding-detail/:bid?',
    asyncComponent: () => import('./bidding-detail')
  },
  {
    path: '/print-setting',
    asyncComponent: () => import('./print-setting')
  },
  // 品牌排序导入
  {
    path: '/brand-sort-import',
    exact: true,
    asyncComponent: () => import('./brand-sort-import')
  },
  // 品牌排序导入
  {
    path: '/goods-brand-sort-import',
    exact: true,
    asyncComponent: () => import('./goods-brand-sort-import')
  },
  // 商品排序导入
  {
    path: '/goods-sort-import',
    exact: true,
    asyncComponent: () => import('./goods-sort-import')
  },
  //搜索管理
  {
    path: '/search-manage',
    asyncComponent: () => import('./search-manage')
  },
  // 隐私政策
  {
    path: '/privacy-policy-setting',
    asyncComponent: () => import('./privacy-policy-setting')
  },
  // 注销政策
  {
    path: '/cancell',
    asyncComponent: () => import('./cancell')
  },
  // //弹窗管理
  {
    path: '/popmodal-manage',
    asyncComponent: () => import('./popmodal-manage')
  },
  // //新增弹窗
  {
    path: '/popmodal-manage-add/:wareId?',
    asyncComponent: () => import('./popmodal-manage-add')
  },
  {
    path: '/popmodal-manage-edit/:id/:name',
    asyncComponent: () => import('./popmodal-manage-edit')
  },
  {
    path: '/popmodal-manage-update/:id',
    asyncComponent: () => import('./popmodal-manage-update')
  },
  {
    path: '/home-page-setting',
    asyncComponent: () => import('./home-page-setting')
  },
  {
    path: '/video-setting',
    asyncComponent: () => import('./video-setting')
  },
  {
    path: '/video-create/:videoId',
    asyncComponent: () => import('./video-create')
  },
  {
    path: '/video-set-detail/:videoId',
    asyncComponent: () => import('./video-set-detail')
  },
  // 乡镇件地址配置
  {
    path: '/pieces',
    asyncComponent: () => import('./pieces')
  },
  // 乡镇件地址列表
  {
    path: '/pieces-list',
    asyncComponent: () => import('./pieces-list')
  },
  // -----新增----
  // 主播管理
  {
    path: '/host-management',
    asyncComponent: () => import('./host-management')
  },
  // 直播间管理
  {
    path: '/live-manage',
    asyncComponent: () => import('./live-manage')
  },
  // 直播管理
  {
    path: '/live-manage-list/:liveRoomId',
    asyncComponent: () => import('./live-manage-list')
  },
  // 直播管理设置
  {
    path: '/live-manage-setUp/:liveRoomId',
    asyncComponent: () => import('./live-manage-setUp')
  },
  // 批发市场
  {
    path: '/wholesale-market',
    asyncComponent: () => import('./wholesale-market')
  },
  // 商城分类
  {
    path: '/mall-classification',
    asyncComponent: () => import('./mall-classification')
  },
  // 推荐商家
  {
    path: '/recommended-merchant',
    asyncComponent: () => import('./recommended-merchant')
  },
  // 商品属性
  {
    path: '/commodity-property',
    asyncComponent: () => import('./commodity-property')
  },
  // 商家合同
  {
    path: '/business-contract',
    asyncComponent: () => import('./business-contract')
  },
  // 应用 - 商家活动中心 - 促销活动
  {
    path: '/storeMarketing-list',
    asyncComponent: () => import('./store-marketing-list')
  },
  //应用 - 商家活动中心 - 促销活动 - 详情
  {
    path: '/storeMarketing-detail/:marketingId/:pageNum?',
    asyncComponent: () => import('./store-marketing-detail')
  },
  // 应用 - 商家活动中心 - 优惠券活动
  {
    path: '/store-activity-list',
    asyncComponent: () => import('./coupon-activity-list')
  },
  // 入驻申请
  {
    path: '/residency-apply',
    asyncComponent: () => import('./residency-apply')
  },
  // 设置-商家操作视频
  {
    path: '/video-tutorial',
    asyncComponent: () => import('./video-tutorial')
  },
  // 设置-用户使用视频
  {
    path: '/video-user',
    asyncComponent: () => import('./video-tutorial')
  },
  // 财务-鲸贴管理-鲸币账户
  {
    path: '/jinbi-account',
    asyncComponent: () => import('./jinbi-account')
  },
  // 财务-鲸贴管理-鲸币账户-账户明细
  {
    path: '/jinbi-account-detail/:type/:id',
    asyncComponent: () => import('./jinbi-account-detail')
  },
  // 商家-商家管理-商家囤货活动
  {
    path: '/stock-activity',
    asyncComponent: () => import('./stock-activity')
  },
  // 设置-物流设置-配送到店
  {
    path: '/delivery-to-store',
    asyncComponent: () => import('./delivery-to-store')
  },
  // 设置-站点设置-店招边框设置
  {
    path: '/store-border',
    asyncComponent: () => import('./store-border')
  },
  // 管理承运商（主页）
  {
    path: '/forwarding-agent-manager',
    asyncComponent: () => import('./forwarding-agent-manager')
  },
  // 管理承运商（新增）
  {
    path: '/forwarding-agent-manager-add',
    asyncComponent: () => import('./forwarding-agent-manager/add')
  },
  // 承运商 新增 运费模版
  {
    path: '/forwarding-agent-manager-freight-template',
    asyncComponent: () => import('./forwarding-agent-manager/freight-template')
  },
  // 查询所有自提点
  {
    path: '/forwarding-agent-manager-point',
    asyncComponent: () => import('./forwarding-agent-manager/pick-up-point')
  },
  // 承运商 -> 承运商管理 -> 运单列表
  {
    path: '/waybill-list',
    asyncComponent: () => import('./waybill-list')
  },
  // 承运商 -> 承运商管理 -> 运单详情
  {
    path: '/waybill-detail',
    asyncComponent: () => import('./waybill-detail')
  },
  // 商家 -> 商家设置 -> 客服关联设置
  {
    path: '/supplier-settings/im-relevance',
    asyncComponent: () => import('./supplier-settings/im-relevance')
  }
];

const homeRoutes = [
  { path: '/login', asyncComponent: () => import('./login') },
  {
    path: '/find-password',
    asyncComponent: () => import('./find-password')
  },
  {
    path: '/lackcompetence',
    asyncComponent: () => import('./lackcompetence')
  },
  {
    path: '/pay-help-doc',
    asyncComponent: () => import('./pay-help-doc')
  },
  {
    path: '/wechat-share-doc',
    asyncComponent: () => import('./wechat-share-doc')
  },
  {
    path: '/login-interface-doc',
    asyncComponent: () => import('./login-interface-doc')
  },
  //视频详情
  {
    path: '/video-detail',
    asyncComponent: () => import('./video-detail')
  },
  {
    path: '/mini-interface-doc',
    asyncComponent: () => import('./mini-interface-doc')
  },
  {
    path: '/mini-interface-doc',
    asyncComponent: () => import('./mini-interface-doc')
  }
  // //商家注册
  // {
  //   path: '/company-register',
  //   asyncComponent: () => import('./company-register')
  // },

  // //商家注册协议
  // {
  //   path: '/supplier-agreement',
  //   asyncComponent: () =>
  //     import('./company-register/component/agreement')
  // }
];

export { routes, homeRoutes };
