import React, { Component } from 'react'
import { Headline, BreadCrumb } from 'qmkit';
import { Alert ,Breadcrumb} from 'antd';
// import { AuthWrapper,  } from 'qmkit';
import List from './component/list';
import SearchForm from './component/search-form';
import { StoreProvider } from 'plume2'
import stores from './store';
import { any } from 'prop-types';

@StoreProvider(stores, { debug: __DEV__ })
export default class Recomcate extends Component<any,any> {
    store: stores;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const {id} = this.props.match.params;
        this.store.init({ pageNum: 0, pageSize: 100 },id);
    }
    render() {
        return (
            // <AuthWrapper functionName={'f_batch_category_three'}> 
            <div >
                <BreadCrumb thirdLevel={true}>
                    <Breadcrumb.Item>商品排序</Breadcrumb.Item>
                </BreadCrumb>
                <div className="container">
                    <Headline title="商品排序" />
                    <SearchForm />
                    <List />
                </div>
            </div>
            // </AuthWrapper>
        )
    }
}
