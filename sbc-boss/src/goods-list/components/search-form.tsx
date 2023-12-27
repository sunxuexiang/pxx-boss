import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree } from 'antd';
import {
  AutoCompleteGroup,
  InputGroupCompact,
  noop,
  SelectGroup,
  TreeSelectGroup
} from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      likeGoodsName: string;
      likeSupplierName: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      cateId: string;
      brandId: string;
      addedFlag: string;
      onSearch: Function;
      onEditSkuNo: Function;
      specialPriceFirst: any;
      specialPriceLast: any;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      warehouseList: IList;
      saleType: string;
      goodsInfoType: string;
      stockUp: string;
      goodsInfoBatchNo: string;
      goodsSeqFlag: string;
      manySpecs: string;
      wareId: string;
      storeName: string;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    // 模糊条件-商家名称
    likeSupplierName: 'likeSupplierName',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    cateId: 'cateId',
    // 品牌编号
    brandId: 'brandId',
    // 上下架状态
    addedFlag: 'addedFlag',
    onSearch: noop,
    onFormFieldChange: noop,
    onEditSkuNo: noop,
    //品牌列表
    brandList: 'brandList',
    specialPriceFirst: 'specialPriceFirst',
    specialPriceLast: 'specialPriceLast',
    //分类列表
    cateList: 'cateList',
    warehouseList: 'warehouseList',
    saleType: 'saleType',
    goodsInfoType: 'goodsInfoType',
    stockUp: 'stockUp',
    goodsInfoBatchNo: 'goodsInfoBatchNo',
    goodsSeqFlag: 'goodsSeqFlag',
    manySpecs: 'manySpecs',
    wareId: 'wareId',
    storeName: 'storeName'
  };

  render() {
    const {
      likeGoodsName,
      likeSupplierName,
      likeGoodsInfoNo,
      likeGoodsNo,
      onSearch,
      onFormFieldChange,
      brandList,
      specialPriceFirst,
      specialPriceLast,
      cateList,
      onEditSkuNo,
      warehouseList,
      cateId,
      brandId,
      addedFlag,
      saleType,
      goodsInfoType,
      stockUp,
      goodsInfoBatchNo,
      goodsSeqFlag,
      manySpecs,
      wareId,
      storeName
    } = this.props.relaxProps;

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('goodsCateList') && item.get('goodsCateList').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('goodsCateList'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              value={likeGoodsName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="店铺名称"
              value={storeName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'storeName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="SPU编码"
              value={likeGoodsNo}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsNo',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="SKU编码"
              value={likeGoodsInfoNo}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsInfoNo',
                  value: e.target.value
                });
                onEditSkuNo(e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="类目"
              defaultValue={-1}
              value={cateId}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={(value) => {
                onFormFieldChange({ key: 'cateId', value });
              }}
            >
              <TreeNode key="-1" value="-1" title="全部">
                {loop(cateList)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="品牌"
                defaultValue="全部"
                showSearch
                optionFilterProp="children"
                value={brandId}
                onChange={(value) => {
                  onFormFieldChange({ key: 'brandId', value });
                }}
              >
                <Option key="-1" value="-1">
                  全部
                </Option>
                {brandList.map((v, i) => {
                  return (
                    <Option key={i} value={v.get('brandId') + ''}>
                      {v.get('brandName')}
                    </Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="上下架"
              defaultValue="全部"
              value={addedFlag || '-1'}
              onChange={(value) => {
                onFormFieldChange({ key: 'addedFlag', value });
              }}
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                下架
              </Option>
              <Option key="1" value="1">
                上架
              </Option>
              <Option key="2" value="2">
                部分上架
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="销售类型"
                defaultValue="全部"
                value={saleType || '-1'}
                onChange={(value) => {
                  onFormFieldChange({ key: 'saleType', value });
                }}
              >
                <Option value="-1">全部</Option>
                <Option value="0">批发</Option>
                <Option value="1">零售</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="商品类型"
                defaultValue="全部"
                value={goodsInfoType || '-1'}
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'goodsInfoType', value });
                }}
              >
                <Option value="-1">全部</Option>
                <Option value="1">特价商品</Option>
                <Option value="0">普通商品</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="囤货状态"
                defaultValue=""
                value={stockUp || ''}
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'stockUp', value });
                }}
              >
                <Option value="">全部</Option>
                <Option value="3">全部囤货状态</Option>
                <Option value="1">囤货中</Option>
                <Option value="2">已囤完</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="价格范围"
              precision={2}
              startMin={0}
              start={specialPriceFirst}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'specialPriceFirst', value: val })
              }
              endMin={0}
              end={specialPriceLast}
              onEndChange={(val) =>
                onFormFieldChange({ key: 'specialPriceLast', value: val })
              }
            />
          </FormItem>

          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="批次号"
              style={{ width: 180 }}
              value={goodsInfoBatchNo}
              // dataSource={this._renderOption(storeMap.toJS())}
              // onSelect={(value) =>
              //     onFormFieldChange({ key: 'goodsInfoBatchNo', value: value })
              // }
              onChange={(value) =>
                onFormFieldChange({ key: 'goodsInfoBatchNo', value: value })
              }
              allowClear={true}
              placeholder=""
            />
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="排序商品"
                defaultValue="全部"
                value={goodsSeqFlag || ''}
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'goodsSeqFlag', value });
                }}
              >
                <Option value="">全部</Option>

                <Option value="0">未排序</Option>
                <Option value="1">已排序</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="商品规格"
                defaultValue=""
                value={manySpecs || '0'}
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'manySpecs', value });
                }}
              >
                <Option value="0">全部</Option>
                <Option value="1">单规格</Option>
                <Option value="2">多规格</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="所属仓库"
                defaultValue=""
                showSearch
                value={wareId || ''}
                onChange={(value) => {
                  onFormFieldChange({ key: 'wareId', value });
                }}
              >
                <Option key="" value="">
                  全部
                </Option>
                {warehouseList.toJS().map((v, i) => {
                  return (
                    <Option key={i} value={v.wareId + ''}>
                      {v.wareName}
                    </Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                onSearch();
              }}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
