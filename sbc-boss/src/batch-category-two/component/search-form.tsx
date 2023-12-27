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
        seacher:Function;
    }
    state = {
        isModalVisible: false,
        storeSignImage: [],
        storeSign: null,
        Imageget: [],
        cateList: [],
        cateId:null
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
        const { isModalVisible, cateList } = this.state;

        const list = this.state.storeSignImage.length >= 1 ? this.state.storeSignImage : this.state.Imageget
        return (
            <div className="handle-bar">
                <div>
                    <Button type="primary" onClick={this._showCateModal}>
                        新增二级类目
                    </Button>
                    <Button type="primary" onClick={this.batchDelete}>
                        批量二级类目移除
                    </Button>
                </div>
                <div style={styles.TreeSelectGroup}>
                    <TreeSelectGroup
                        getPopupContainer={() => document.getElementById('page-content')}
                        label="类目"
                        defaultValue={-1}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeDefaultExpandAll
                        onChange={(value) => {
                            console.log(value);
                            this.setState({cateId:value})
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
  
    // 删除
    onRemoveTaxpayer = () => {
        this.setState({ Imageget: [], storeSign: '' })
    }
    // 打开mode
    setDeles = async () => {
        const { res } = await webapi.getImage();
        console.log(res, 'ressress');
        if (res.code == 'K-000000') {
            const Imageget = [{
                uid: 1,
                name: '图1',
                size: 1,
                status: 'done',
                url: res.context
            }]
            this.setState({ Imageget: Imageget })
            this.setState({ storeSign: res.context })
        } else {
            message.error('保存失败')
        }
        this.setState({ isModalVisible: true })
    }
    // 确认
    handleOk = async () => {
        const { storeSign } = this.state;
        if (storeSign) {
            console.log(storeSign, 'storeSignstoreSignstoreSign');
            const { res } = await webapi.retailGoodsCate({
                imgUrl: storeSign
            });
            console.log(res, '结果');
            if (res.code == 'K-000000') {
                message.success('保存成功')
            } else {
                message.error('保存失败')
            }
        }
        this.setState({ isModalVisible: false })
    }
    // 关闭
    handleCancel = () => {
        this.setState({ isModalVisible: false })
    }
    // 搜索
    seacher = () => {
        this.props.seacher(this.state.cateId);
    }
    batchDelete = () => {
        this.props.batchDelete();
    }
    _showCateModal = () => {
        this.props.onischoun()
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