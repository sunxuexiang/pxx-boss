import React, { Component } from 'react';
import { Form, Input, Button, Select, Tree } from 'antd';
import { noop, SelectGroup, history, TreeSelectGroup } from 'qmkit';
import { Relax } from 'plume2';
import store from '../store';

const TreeNode = Tree.TreeNode;
// const { Option } = Select;
// const FormItem = Form.Item;

@Relax
export default class SearchForm extends Component<any, any> {
    store: store;
    static relaxProps = {
        customerAccount: 'customerAccount',
        accountState: 'accountState',
        onFormFieldChange: noop,
        init: noop,
        goodsModalVisible: 'goodsModalVisible',
        fieldsValue: noop,
        onOkBackFun: noop,
        chooseSkuIds: 'chooseSkuIds',
        list: 'list',
        cateList: 'cateList',
        wareId:'wareId'
    }

    render() {
        const store = this.store as any;
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
        const { customerAccount, accountState, onFormFieldChange, init, goodsModalVisible, list, chooseSkuIds, cateList,wareId } = this.props.relaxProps;
        // console.log('====================================');
        // console.log(goodsModalVisible, 'goodsModalVisible', list.toJS(), chooseSkuIds.toJS());
        // console.log('====================================');
        return (
            <div>
                <Form className="filter-content" layout="inline">
                    {/* <FormItem>
                        <Input
                            addonBefore=" 名称"
                            placeholder="请输入名称"
                            value={customerAccount}
                            onChange={(e: any) =>
                                onFormFieldChange('customerAccount', e.target.value)
                            }
                        />
                    </FormItem>
                    <FormItem>
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
                    </FormItem>
                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon="search"
                            onClick={() => {
                                init();
                            }}
                        >
                            搜索
                        </Button>
                    </FormItem> */}
                    <div style={styles.margins}>
                        <Button type='primary'
                            onClick={() => {
                                // history.push('/start-add')
                                this.AddGoods()
                            }}
                        >选择商品</Button>
                    </div>
                </Form>

                
            </div>
        )
    }
    // 添加商品
    AddGoods = () => {
        const { fieldsValue } = this.props.relaxProps;
        fieldsValue('goodsModalVisible', true)
    }
}
const styles = {
    margins: {
        marginBottom: 10,
    } as any
}
