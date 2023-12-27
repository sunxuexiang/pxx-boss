import React, { Component } from 'react'
import { Headline, BreadCrumb } from 'qmkit';
import { Alert } from 'antd';
import { AuthWrapper,  } from 'qmkit';
import List from './component/list';

export default class Recomcate extends Component {
    render() {
        return (
            <AuthWrapper functionName={'f_goods_cate_sp'}> 
            <div >
                <BreadCrumb />
                <div className="container">
                    <Headline
                        title="散批商品推荐类目"
                        smallTitle='会自动把类目里的商品优先推荐给客户'
                    />
                    <div style={{ marginBottom: 16 }}>
                        <Alert
                            message="商品类目最多10个，一级及二级类目只做为结构类目存在，只能选择第三级类目，未添加三级类目的类目不会在商城前台展示。对商品类目的编辑或删除将会影响到商家的商品展示与销售分润，请谨慎操作，尽量使用“编辑”而避免“删除”！"
                            type="info"
                            showIcon
                        />
                    </div>

                    {/* 列表 */}
                    <List />
                </div>
            </div>
            </AuthWrapper>
        )
    }
}
