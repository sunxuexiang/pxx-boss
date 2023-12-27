import React, { useState, useRef, useEffect } from 'react';
import './customer-chat.less';
import { Icon, message } from 'antd';
import { cache, Const } from 'qmkit';
import { notification } from 'antd';
// import { getIMConfigDetail } from '../../online-service/webapi';
import { getLoginSignature } from '../webapi';

export default function CustomerChat(props) {
  const iframeRef = useRef(null);
  const [iframeLoad, setLoad] = useState(false);
  const img = require('../img/customer-icon.png');
  useEffect(() => {
    window.addEventListener('message', function (e) {
      if (e.origin !== Const.IM_URL) {
        return;
      }

      const msgData = e.data;
      console.warn(msgData);
      if (msgData.msgType === 'msgReceive' && !props.show) {
        notification.info({
          message: `消息通知：${msgData.nick}`,
          description: `${msgData.nick}：${msgData.payload.text}`,
          icon: <img src={img} className="notice-icon" />
        });
      }
    });
    const ifDom = document.getElementById('chatIframe');
    ifDom.onload = function () {
      setLoad(true);
    };
  }, []);
  // 监听聊天iframe加载
  useEffect(() => {
    if (iframeLoad) {
      getUserSig();
    }
  }, [iframeLoad]);
  const hideChat = () => {
    props.hideChat();
  };
  const getUserSig = () => {
    getLoginSignature({
      customerServiceAccount: props.accountData.customerServiceAccount
    }).then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('获取登录签名失败');
        return;
      }
      const ifDom = document.getElementById('chatIframe') as HTMLIFrameElement;
      const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      const loginParams = {
        msgType: 'login',
        userID: props.accountData.customerServiceAccount,
        userName: props.accountData.customerServiceName,
        token: loginInfo.token,
        fromBoss: true,
        sign: data.res.context
      };
      ifDom.contentWindow.postMessage(loginParams, Const.IM_URL);
    });
  };
  return (
    <div
      className="customer-chat-box"
      style={{ display: props.show ? 'flex' : 'none' }}
    >
      <div className="customer-chat-main">
        <div className="customer-chat-close" onClick={hideChat}>
          <Icon type="close-circle" />
        </div>
        <iframe
          ref={iframeRef}
          id="chatIframe"
          style={{
            width: '100%',
            height: '100%',
            border: 'medium none',
            overflow: 'hidden'
          }}
          frameBorder="0"
          scrolling="no"
          src={Const.IM_URL}
        />
      </div>
    </div>
  );
}
