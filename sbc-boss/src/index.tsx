import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { routeWithSubRoutes, history, noop } from 'qmkit';
import { homeRoutes } from './router';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './redux/store';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import '@babel/polyfill';
//将common.less,外加的less等都放在一起
import './index.less';

import Main from './main';

const B2BBoss = () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <Router history={history}>
        <div>
          <Switch>
            {routeWithSubRoutes(homeRoutes, noop)}
            <Route component={Main} />
          </Switch>
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
);

ReactDOM.render(<B2BBoss />, document.getElementById('root'));
