import { StoreProvider } from 'plume2'
import { BreadCrumb, Headline,AuthWrapper } from 'qmkit';
import React, { Component } from 'react'
import stores from './store';
import SearchForm from './compontents/search-form';
import List from './compontents/list';


@StoreProvider(stores, { debug: __DEV__ })
export default class Surprise extends Component {
    store: stores;
    componentDidMount() {
        this.store.init();
    }
    render() {
        return (
            <AuthWrapper functionName="f_batch_surprise">
                 <div> 
                    <BreadCrumb />
                    <div className="container coupon">
                        <Headline title={'推荐商品'} />
                        <SearchForm />
                        <List />
                    </div>
                </div>
            </AuthWrapper>
           
        )
    }
}
