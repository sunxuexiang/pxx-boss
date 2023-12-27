import React from 'react';
import { StoreProvider } from 'plume2';
import { Tabs, Form, message } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {
  Headline,
  BreadCrumb,
  DialogChooseUnit,
  AuthWrapper,
  Const,
  checkAuth
} from 'qmkit';
import Tips from './components/tips';
import PopularSettig from './components/popular';
import Presupposition from './components/presupposition';
import AppStore from './store';
import PresetForm from './components/preset-form';
import AssociationSetting from './components/association';
import SearchModal from './components/search-modal';
import AssociationModal from './components/association-modal';
import PopularModal from './components/popular-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
class SearchManage extends React.Component<any, any> {
  store;

  componentWillMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="搜索设置" />
          <Tabs
            tabBarStyle={{ marginTop: 10 }}
            onChange={(key) => this._onTabChange(key)}
          >
            <Tabs.TabPane tab="热门搜索词" key="1">
              <Tips type="popular" />
              <PopularSettig />
            </Tabs.TabPane>
            <Tabs.TabPane tab="搜索联想词" key="2">
              <Tips type="association" />
              <AuthWrapper functionName="f_search_associational_word">
                <AssociationSetting />
              </AuthWrapper>
            </Tabs.TabPane>
            <Tabs.TabPane tab="预置搜索词" key="3">
              <Tips type="preset" />
              <AuthWrapper functionName="f_preset_search_terms">
                <Presupposition />
              </AuthWrapper>
            </Tabs.TabPane>
          </Tabs>
          {/* 搜索词模态框 */}
          <SearchModal />
          {/* 联想词模态框 */}
          <AssociationModal />
          {/* 热搜词模态框 */}
          <PopularModal />
          <PresetForm />
          <DialogChooseUnit
            platform={this.store.state().get('platform')}
            systemCode="d2cStore"
            apiHost={Const.HOST}
          />
        </div>
      </div>
    );
  }

  _onTabChange = (key) => {
    if (!checkAuth('f_popular_search_terms') && key == '1') {
      message.error('暂无权限访问');
    } else if (!checkAuth('f_preset_search_terms') && key == '2') {
      message.error('暂无权限访问');
    } else if (!checkAuth('f_search_associational_word') && key == '3') {
      message.error('暂无权限访问');
    }
  };
}

export default DragDropContext(HTML5Backend)(SearchManage);
