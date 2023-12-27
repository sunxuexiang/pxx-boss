/**
 * storage的key，定义为常量统一存放
 */
export default {
  LOGIN_DATA: 's2b-platform@login', //登录信息缓存
  LOGIN_MENUS: 's2b-platform@menus', //登录人菜单信息
  LOGIN_FUNCTIONS: 's2b-platform@functions', //登录人功能权限信息
  SITE_LOGO: 's2b-platform@logo', //商城logo
  DATA_BOARD: 's2b-platform@dataBoard:', //控制面板
  SYSTEM_BASE_CONFIG: 's2b-platform@systemBaseConfig:', //系统配置，如pc，h5系统配置
  FIRST_ACTIVE: 's2b-platform@firstActive', //选中的第一层菜单下标
  SECOND_ACTIVE: 's2b-platform@secondActive', //选中的第二层菜单下标
  THIRD_ACTIVE: 's2b-platform@thirdActive', //选中的第三层菜单下标
  MINI_QRCODE: 's2bboss-miniprogram-qrcode', //小程序二维码
  PENDING_AND_REFUSED: 'pending-or-refused-useInfo', //审核中或者审核未通过的用户信息
  VALUE_ADDED_SERVICES: 'value-added-service', // 增值服务
  HIDE_EMPLOYEE_SETTING:'HIDE_EMPLOYEE_SETTING'
};
