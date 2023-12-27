import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';
import { Button, Icon, Modal, Form, message, Select, Tree } from 'antd';
import {
    TreeSelectGroup
} from 'qmkit';
import * as webapi from '../webapi';
const { Option } = Select;
const TreeNode = Tree.TreeNode;
export default class SearchForm extends Component {
    props: {
        onischoun: Function;
        batchDelete: Function;
    }
    state = {
        isModalVisible: false,
        storeSignImage: [],
        storeSign: null,
        Imageget: [],
        cateList: []
    }
    async componentDidMount() {
        this.initCalte()
    }

    constructor(props) {
        super(props);
    }
    render() {
        //处理分类的树形图结构数据
        const loop = (cateList) =>
            cateList.map((item) => {
                // console.log(item, 'itemitem');

                if (item.goodsCateList && item.goodsCateList.length > 0) {
                    return (
                        <TreeNode
                            key={item.cateId}
                            value={item.cateId}
                            title={item.cateName}
                        >
                            {loop(item.goodsCateList)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        key={item.cateId}
                        value={item.cateId}
                        title={item.cateName}
                    />
                );
            });
        const { cateList } = this.state;

        // const list = this.state.storeSignImage.length >= 1 ? this.state.storeSignImage : this.state.Imageget
        return (
            <div className="handle-bar">
                <div style={styles.TreeSelectGroup}>
                    <TreeSelectGroup
                        getPopupContainer={() => document.getElementById('page-content')}
                        label="类目"
                        defaultValue={-1}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeDefaultExpandAll
                        onChange={(value) => {
                            console.log(value);
                            
                            // onFormFieldChange({ key: 'cateId', value });
                        }}
                    >
                        <TreeNode key="-1" value="-1" title="全部">
                            {loop(cateList)}
                        </TreeNode>
                    </TreeSelectGroup>

                    <Button type="primary" onClick={this.seacher}>
                        搜索
                    </Button>
                </div>

            </div>
        )
    }
    initCalte = async () => {
        const cates: any = await webapi.getCateList();
        this.setState({ cateList: cates.res.context })
    }
    // 搜索
    seacher = () => {
        console.log('====================================');
        console.log('搜索');
        console.log('====================================');
    }
}
const styles = {
    TreeSelectGroup: {
        display: 'flex',
        alignItems: 'center',
        width: 100,
        marginTop: 20
    } as any,
    box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    } as any,
    plus: {
        color: '#999',
        fontSize: '28px'
    },
    alertBox: {
        marginLeft: 10
    },
    flens: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    } as any,
    leftsa: {
        marginLeft: 10,
    } as any
}