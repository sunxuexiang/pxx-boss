import React, { Component } from 'react'
import { Headline, BreadCrumb } from 'qmkit';
import { Alert } from 'antd';
import { AuthWrapper,  } from 'qmkit';
import List from './component/list';

export default class Recomcate extends Component {
    render() {
        return (
            <AuthWrapper functionName={'f_batch_category_three'}> 
            <div >
                <BreadCrumb />
                <div className="container">
                    <Headline
                        title="三级类目排序"
                    />
                    <div style={{ marginBottom: 16 }}>
                        <Alert
                            message="排序时序号不能重复。支持拖拽整行进行调整排序顺序"
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
