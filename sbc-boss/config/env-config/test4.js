/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2019/5/8
 **/

var Common = require('./common');
// 灰度
module.exports = {
  // host: 'http://10.130.8.91:7290',
  // HOST: 'http://10.130.8.91:7290',
  host: 'http://10.130.8.143:8290',
  HOST: 'http://10.130.8.143:8290',
  X_XITE_ADMIN_HOST: 'http://172.19.25.40:3000',
  X_XITE_OPEN_HOST: 'http://172.19.25.40:9000',
  OSS_HOST: 'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/mini',
  RENDER_HOST:'https://app-render.xiyaya.kstore.shop',
  ...Common
};
