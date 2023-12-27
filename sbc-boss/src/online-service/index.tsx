import React from 'react';
import { Form, message } from 'antd';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import styled from 'styled-components';
import QQModal from './components/qq-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import AliyunModal from './components/aliyun-modal';
import SobotModal from './components/sobot-modal';
import SupplyChat from './components/supply-chat';
import ImModal from './components/im-modal';
import { getImSwitch } from './webapi';
import { chatContext } from '../customer-service/chat-context';

const QQForm = Form.create()(QQModal as any); //品牌弹框
const AliForm = Form.create()(AliyunModal as any);
const SoBotForm = Form.create()(SobotModal as any);
const ContainerDiv = styled.div`
  .methodItem {
    width: 100%;
    border: 1px solid #f5f5f5;
    text-align: center;
    padding: 20px 0;
    img {
      width: 86px;
      height: 86px;
    }
    h4 {
      font-size: 14px;
      color: #333;
      margin-top: 5px;
    }
  }
  .bar {
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px 0;
    .status {
      font-size: 12px;
      color: #666;
    }
    .links {
      font-size: 12px;
      margin-left: 15px;
    }
  }
  .cardBox {
    display: inline-block;
    border-radius: 2px;
    line-height: 1.5;
    margin-right: 20px;
    width: 300px;
    border: 1px solid #eee;
    padding: 10px;
  }
`;
// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OnlinelService extends React.Component<any, any> {
  store: AppStore;
  static contextType = chatContext;
  constructor(props) {
    super(props);
    this.state = {
      supplyChatShow: false,
      imModalShow: false,
      imConfig: {}
    };
  }

  componentWillMount() {
    this.store.init();
    this.searchIMSwitch();
  }
  openImModal = () => {
    this.setState({ supplyChatShow: true });
  };
  // 打开弹窗
  showImConfig = () => {
    this.setState({ imModalShow: true });
  };
  // 查询IM客服配置
  searchIMSwitch = (isRefresh = false, serviceAccountList = []) => {
    getImSwitch().then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('获取im信息失败');
        return;
      }
      // 右侧客服开启关闭
      if (isRefresh) {
        this.context.changeChatStatus(data.res.context, serviceAccountList);
      }
      this.setState({ imConfig: data.res.context });
    });
  };
  render() {
    const enableFlag = this.store.state().get('enableFlag');
    const smsVisible = this.store.state().get('smsVisible');
    const aliSmsVisible = this.store.state().get('aliSmsVisible');
    const sobotVisible = this.store.state().get('sobotVisible');
    const aliyunServer = this.store.state().get('aliyunServer');
    const sobotServer = this.store.state().get('sobotServer');
    const imServer = this.store.state().get('imServer');

    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>客服设置</Breadcrumb.Item>
          <Breadcrumb.Item>在线客服</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <ContainerDiv>
            <Headline title="在线客服" />
            <div className="cardBox">
              <div className="methodItem">
                <img src={require('./img/qq.png')} />
                <h4>QQ客服</h4>
              </div>
              <div className="bar">
                <div className="status">{enableFlag ? '已启用' : '未启用'}</div>
                <div>
                  <a
                    onClick={() => this.store.onEditServer()}
                    className="links"
                  >
                    编辑
                  </a>
                </div>
              </div>
            </div>

            <div className="cardBox">
              <div className="methodItem">
                <img src={require('./img/aliyun.png')} />
                <h4>阿里云客服</h4>
              </div>
              <div className="bar">
                <div className="status">
                  {aliyunServer.get('enableFlag') == 1 ? '已启用' : '未启用'}
                </div>
                <div>
                  <a
                    onClick={() => this.store.onAliEditServer()}
                    className="links"
                  >
                    编辑
                  </a>
                </div>
              </div>
            </div>
            <div className="cardBox">
              <div className="methodItem" style={{ height: '154px' }}>
                <img
                  src={require('./img/zc.jpg')}
                  style={{ width: '250px', height: '74px' }}
                />
                <h4 style={{ paddingTop: '13px' }}>智齿客服</h4>
              </div>
              <div className="bar">
                <div className="status">
                  {sobotServer.get('enableFlag') == 1 ? '已启用' : '未启用'}
                </div>
                <div>
                  <a
                    onClick={() => this.store.onSobotEditServer()}
                    className="links"
                  >
                    编辑
                  </a>
                </div>
              </div>
            </div>
            {/* IM客服 */}
            <div className="cardBox">
              <div className="methodItem">
                <img src={require('./img/im.png')} />
                <h4>IM商家客服配置</h4>
              </div>
              <div className="bar">
                <div className="status">
                  {imServer.get('enableFlag') === 0 ? '已启用' : '未启用'}
                </div>
                <div>
                  <a onClick={() => this.openImModal()} className="links">
                    编辑
                  </a>
                </div>
              </div>
            </div>
            {/* IM客服 */}
            <div className="cardBox">
              <div className="methodItem">
                <img src={require('./img/im.png')} />
                <h4>IM商家客服账号配置</h4>
              </div>
              <div className="bar">
                <div className="status">
                  {this.state.imConfig.serverStatus === 0 ? '未启用' : '已启用'}
                </div>
                <div>
                  <a
                    onClick={() => {
                      history.push({
                        pathname: '/im-setting-index'
                      });
                    }}
                    className="links"
                  >
                    设置
                  </a>
                  <a onClick={() => this.showImConfig()} className="links">
                    编辑
                  </a>
                </div>
              </div>
            </div>
          </ContainerDiv>
          {smsVisible && <QQForm />}
          {aliSmsVisible && <AliForm />}
          {sobotVisible && <SoBotForm />}
          {/* imp配置 */}
          <SupplyChat
            // @ts-ignore
            show={this.state.supplyChatShow}
            closeSupplyChat={() => {
              this.setState({ supplyChatShow: false });
            }}
          />
          {/* im账号配置 */}
          <ImModal
            // @ts-ignore
            show={this.state.imModalShow}
            imData={this.state.imConfig}
            closeModal={(isRefresh, serviceAccountList) => {
              if (isRefresh) {
                this.searchIMSwitch(isRefresh, serviceAccountList);
              }
              this.setState({ imModalShow: false });
            }}
          />
        </div>
      </div>
    );
  }
}
