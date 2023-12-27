import React from 'react';
// import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
// import TopTips from './components/top-tips';

import Tab from './components/tab-data-grid';
// import InfoList from './components/info-list';
import EditModal from './components/edit-modal';



@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
    store: AppStore;

    componentDidMount() {
        this.store.onWareHousePage();
    }

    render() {
        return (

            <div>
                {/* 面包屑导航 */}
                <BreadCrumb />
                <AuthWrapper functionName={'f_new_guest_section_list'}>
                    <div className="container">
                        {/* 头部标题 */}
                        <Headline title="新客专区" />

                        {/* 页面提示 */}
                        {/*  <TopTips />*/}
                        {/* 仓库切换 */}
                        <Tab />

                        {/* 编辑/新增弹框 */}
                        <EditModal />
                    </div>
                </AuthWrapper>
            </div>
        );
    }
}
