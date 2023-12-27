import React, { Component } from 'react';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import Search from './components/search';
import List from './components/list';
import { Form } from 'antd'
import { StoreProvider } from 'plume2';
import AppStore from './store';
const WrappedForm = Form.create()(Search as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AccountAdj extends React.Component<any, any>  {
    store: AppStore;
    _form;
    render() {
        return (
            <div>
                <BreadCrumb />
                <div className="container resetTable">
                    <Headline title="调账明细" />
                    <WrappedForm ref={(form) => (this._form = form)} />
                    {/* 列表 */}
                    <List />
                </div>
            </div>
        )
    }
}
