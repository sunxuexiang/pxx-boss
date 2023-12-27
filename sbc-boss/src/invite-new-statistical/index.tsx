import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb,AuthWrapper } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import List from './components/list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InviteNewRecord extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <AuthWrapper functionName='f_invite_new_statistical'>
          <div className="container customer">
            <Headline title="邀新统计" />
            {/*搜索条件*/}
            <SearchForm />
            <ButtonGroup />
            {/*tab邀新记录*/}
            <List />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
