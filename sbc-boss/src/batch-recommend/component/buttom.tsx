import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';
import { Button, Icon, Modal, Form, message, Select, Tree } from 'antd';
import {
    TreeSelectGroup
} from 'qmkit';
import * as webapi from '../webapi';
const { Option } = Select;
const TreeNode = Tree.TreeNode;
export default class buttom extends Component {
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
                        新增三级类目
                    </Button>
                    <Button type="primary" onClick={this.batchDelete}>
                        批量三级类目删除
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
                {/* <Button style={styles.leftsa} type="primary" onClick={this.setDeles}>
                    编辑超市icon图
                </Button> */}
                {/* <Modal title="编辑图片样式" width='70%' visible={isModalVisible} okText='保存' onOk={this.handleOk} onCancel={this.handleCancel}>
                    <div style={styles.flens}>
                        <div>上传超市icon图：</div>
                        <QMUpload
                            style={styles.box}
                            action={
                                Const.HOST + '/uploadResource?resourceType=IMAGE'
                            }
                            listType="picture-card"
                            name="uploadFile"
                            onChange={this._editStoreSign}
                            fileList={list}
                            accept={'.jpg,.jpeg,.png,.gif'}
                            beforeUpload={this._checkUploadFile.bind(this, 2)}
                            onRemove={() => this.onRemoveTaxpayer()}
                        >
                            {list.length >= 1 ? null : (
                                <div>
                                    <Icon type="plus" style={styles.plus} />
                                </div>
                            )}
                        </QMUpload>
                    </div>
                </Modal> */}

            </div>
        )
    }
    initCalte = async () => {
        const cates: any = await webapi.getCateList();
        this.setState({ cateList: cates.res.context })
    }
    /**
 * 编辑店铺店招
 * @param file
 * @param fileList
 * @private
 */
    _editStoreSign = ({ file, fileList }) => {
        this.setState({ storeSignImage: fileList });

        //当所有图片都被删除时
        if (fileList.length == 0) {
            this.setState({ storeSign: '' });
            return;
        }

        if (file.status == 'error') {
            message.error('上传失败');
            return;
        }

        //当上传完成的时候设置
        fileList = this._buildFileList(fileList);
        if (fileList && fileList.length > 0) {
            this.setState({ storeSign: fileList[0].url });
        }
    };
    _buildFileList = (fileList: Array<any>): Array<any> => {
        return fileList
            .filter((file) => file.status === 'done')
            .map((file) => {
                return {
                    uid: file.uid,
                    status: file.status,
                    url: file.response ? file.response[0] : file.url
                };
            });
    };
    /**
 * 检查文件格式以及大小
 */
    _checkUploadFile = (size: number, file) => {
        let fileName = file.name.toLowerCase();
        // 支持的图片格式：jpg、jpeg、png、gif
        if (
            fileName.endsWith('.jpg') ||
            fileName.endsWith('.jpeg') ||
            fileName.endsWith('.png') ||
            fileName.endsWith('.gif')
        ) {
            if (file.size <= size * 1024 * 1024) {
                return true;
            } else {
                message.error('文件大小不能超过' + size + 'M');
                return false;
            }
        } else {
            message.error('文件格式错误');
            return false;
        }
    };
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