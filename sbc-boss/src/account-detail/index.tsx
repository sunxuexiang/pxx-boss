import React, { Component } from 'react';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import Search from './components/search';
import List from './components/list';
import { Form } from 'antd'
import { StoreProvider } from 'plume2';
import AppStore from './store';
import ModalDis from './components/modal-dis';
const WrappedForm = Form.create()(Search as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AccountAdj extends React.Component<any, any>  {
    store: AppStore;
    _form;
    componentDidMount() {
        this.store.init();
    }
    render() {
        return (
            <AuthWrapper functionName={'f_account-detail'}>
                <div>
                    <BreadCrumb />
                    <div className="container resetTable">
                        <Headline title="余额明细" />
                        <WrappedForm ref={(form) => (this._form = form)} />
                        {/* 列表 */}
                        <List />
                        <ModalDis />
                    </div>
                </div>
            </AuthWrapper>
        )
    }
}
