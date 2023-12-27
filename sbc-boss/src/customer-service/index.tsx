import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import { Avatar, Badge, notification, message } from 'antd';
import './customer-service.less';
// import Const from '../../web_modules/qmkit/config';
import CustomerChat from './components/customer-chat';
import { getImSwitch, getIMConfigDetail } from '../online-service/webapi';
import { cache, Const } from 'qmkit';

const png = require('./img/customer-icon.png');

const CustomerService = forwardRef((props: any, ref) => {
  const [count, setCount] = useState(0);
  // 右侧客服入口显示
  const [showCustomerService, setShowCustomerService] = useState(false);
  // 客服聊天框显示
  const [chatShow, setChatShow] = useState(false);
  // 客服状态参数
  const [switchConfig, setSwitchConfig] = useState({} as any);
  // 客服账号
  const [userAccountConfig, setUserAccountConfig] = useState({});
  // 父组件可调用方法
  useImperativeHandle(ref, () => ({
    getStatus
  }));
  const openChat = () => {
    setChatShow(true);
  };
  useEffect(() => {
    window.addEventListener('message', function(e) {
      if (e.origin !== Const.IM_URL) {
        return;
      }
      const msgData = e.data;
      if (msgData.msgType === 'msgUnread') {
        setCount(msgData.count);
      }
    });
    chatStatusConfig();
  }, []);
  // // 客服状态修改监听
  // useEffect(() => {
  //   chatStatusConfig();
  // }, [props.customerServiceStatus]);
  // 获取客服开关状态
  const chatStatusConfig = () => {
    getImSwitch().then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        // message.error('获取im信息失败');
        return;
      }
      setSwitchConfig(data.res.context);
      if (data.res.context?.serverStatus === 1) {
        getServiceAccountData();
      } else {
        setShowCustomerService(false);
      }
    });
  };
  // 修改或编辑客服内容后触发
  const getStatus = (data, serviceAccountList = []) => {
    console.warn(data, '----------');
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const currentAccount = serviceAccountList.find((item) => {
      return item.phoneNo === loginInfo.mobile;
    });
    // 不存在与当前登录账户匹配账号
    if (!currentAccount) {
      console.warn('不存在与当前登录账户匹配账号');
      setShowCustomerService(false);
      return;
    }
    // 存在判断当前状态
    if (data.serverStatus === 1) {
      setUserAccountConfig(currentAccount);
      setShowCustomerService(true);
    } else {
      setShowCustomerService(false);
    }
  };
  // 获取客服账号数据
  const getServiceAccountData = () => {
    getIMConfigDetail().then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        return;
      }
      const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      const accountConfig = data.res.context.imOnlineServerItemRopList.find(
        (item) => {
          return item.phoneNo === loginInfo.mobile;
        }
      );
      console.warn(accountConfig, '------------');
      if (!accountConfig) {
        setShowCustomerService(false);
        return;
      }
      setUserAccountConfig(accountConfig);
      setShowCustomerService(true);
    });
  };
  return (
    <div>
      {showCustomerService && (
        <CustomerChat
          accountData={userAccountConfig}
          show={chatShow}
          hideChat={() => {
            setChatShow(false);
          }}
        />
      )}

      {showCustomerService && (
        <div className="service-box" onClick={openChat}>
          <div className="service-img">
            {/* 未读消息总数徽标 */}
            {count > 0 && (
              <span
                className={
                  count < 10
                    ? 'service-img-count-small service-img-count'
                    : 'service-img-count service-img-count-large'
                }
              >
                {count > 99 ? '99+' : count}
              </span>
            )}

            <Avatar src={png} size={50} />
          </div>
          <div className="service-text">在线客服</div>
        </div>
      )}
    </div>
  );
});

export default CustomerService;
