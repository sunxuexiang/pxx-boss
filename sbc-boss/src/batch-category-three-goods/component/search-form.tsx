import React, { Component } from 'react';
import { Form, Input, Button, Select, Tree,Tag } from 'antd';
import { noop, SelectGroup, history, TreeSelectGroup } from 'qmkit';
import { Relax } from 'plume2';
const TreeNode = Tree.TreeNode;
const { Option } = Select;
const FormItem = Form.Item;

@Relax
export default class SearchForm extends Component<any, any> {
    static relaxProps = {
        customerAccount: 'customerAccount',
        brandId: 'brandId',
        onFormFieldChange: noop,
        init: noop,
        fieldsValue: noop,
        onOkBackFun: noop,
        brandlist: 'brandlist'
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
        const { customerAccount, brandId,fieldsValue, onFormFieldChange, init, brandlist } = this.props.relaxProps;
      
        return (
            <div>
                <Tag color="volcano">类目 ：一级类目》二级类目》三级类目</Tag>
                <Form className="filter-content" layout="inline">
                    <FormItem>
                        <Input
                            addonBefore=" 名称"
                            placeholder="请输入名称"
                            value={customerAccount}
                            onChange={(e: any) =>
                                fieldsValue('customerAccount', e.target.value)
                            }
                        />
                    </FormItem>
                    <FormItem>
                    <SelectGroup
                        label="品牌"
                        dropdownStyle={{ zIndex: 1053 }}
                        onChange={(val) => {fieldsValue('brandId', val)}}
                        value={brandId}
                        >
                        <Option key="-1" value="">全部</Option>
                        {brandlist.map((v) => (
                            <Option key={v.brandId} value={v.brandId + ''}>
                            {v.brandName}
                            </Option>
                        ))}
                        </SelectGroup>
                        {/* <TreeSelectGroup
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
                        </TreeSelectGroup> */}
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
                    </FormItem>
                </Form>
                

            </div>
        )
    }


}
const styles = {
    margins: {
        marginBottom: 10,
    } as any
}
