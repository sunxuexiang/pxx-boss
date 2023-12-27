import { StoreProvider } from 'plume2'
import { BreadCrumb, Headline,AuthWrapper } from 'qmkit';
import React, { Component } from 'react'
import stores from './store';
// import SearchForm from './compontents/search-form';
// import List from './compontents/list';
import Tab from './compontents/tab';

@StoreProvider(stores, { debug: __DEV__ })
export default class BdRecommendation extends Component {
    store: stores;
    componentDidMount() {
        this.store.onWareHousePage();
    }
    render() {
        return (
            <AuthWrapper functionName="f_bd_recommendation">
                 <div> 
                    <BreadCrumb />
                    <div className="container coupon">
                        <Headline title={'推荐商品'} />
                        <Tab />
                        {/* <List /> */}
                    </div>
                </div>
            </AuthWrapper>
        )
    }
}
