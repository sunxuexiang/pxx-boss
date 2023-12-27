import React from 'react';
import { Button, Form, Input, DatePicker, Select, Tree } from 'antd';
import { Relax } from 'plume2';
import { noop, Const, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';
import { IMap } from 'plume2/es5/typings';
import moment from 'moment';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
// import styled from 'styled-components';

const TreeNode = Tree.TreeNode;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onSearchForm: Function;
      warehouseList?: IList;
      brandList?: IList;
      cateList?: IList;
      searchData?: IMap;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onSearchForm: noop,
    warehouseList: 'warehouseList',
    brandList: 'brandList',
    cateList: 'cateList',
    searchData: 'searchData'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      onSearch,
      onSearchForm,
      warehouseList,
      brandList,
      cateList,
      searchData
    } = this.props.relaxProps;
    const replenishmentFlag = searchData.get('replenishmentFlag');
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
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'商品名称'}
              onChange={(e) => {
                onSearchForm('goodsName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'ERP编码'}
              onChange={(e) => {
                onSearchForm('erpGoodsInfoNo', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="品牌"
              onChange={(value) => {
                onSearchForm('brandId', value);
              }}
              defaultValue={''}
            >
              <Select.Option key="" value="">
                全部
              </Select.Option>
              {brandList.toJS().map((v, i) => {
                return (
                  <Select.Option key={i} value={v.brandId + ''}>
                    {v.brandName}
                  </Select.Option>
                );
              })}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="所属仓库"
              onChange={(value) => {
                onSearchForm('wareId', value);
              }}
              defaultValue={''}
            >
              <Select.Option key="" value="">
                全部
              </Select.Option>
              {warehouseList.toJS().map((v, i) => {
                return (
                  <Select.Option key={i} value={v.wareId + ''}>
                    {v.wareName}
                  </Select.Option>
                );
              })}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="商品品类"
              defaultValue={-1}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={(value) => {
                onSearchForm('cateId', value);
              }}
            >
              <TreeNode key="-1" value="-1" title="全部">
                {loop(cateList)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="上架状态"
              onChange={(value) => {
                onSearchForm('addedFlag', value);
              }}
              defaultValue={'-1'}
            >
              <Select.Option key="-1" value="-1">
                全部
              </Select.Option>
              <Select.Option key="1" value="1">
                上架
              </Select.Option>
              <Select.Option key="0" value="0">
                下架
              </Select.Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              format="YYYY-MM-DD"
              placeholder={['缺货开始日期', '缺货结束日期']}
              onChange={(date, dateStr) => {
                if (date.length > 0) {
                  onSearchForm('stockoutBegin', dateStr[0] + ' ' + '00:00:00');
                  onSearchForm('stockoutEnd', dateStr[1] + ' ' + '23:59:59');
                } else {
                  onSearchForm('stockoutBegin', '');
                  onSearchForm('stockoutEnd', '');
                }
              }}
            />
          </FormItem>
          <FormItem>
            {replenishmentFlag == 1 ? (
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                format="YYYY-MM-DD"
                placeholder={['补货开始日期', '补货结束日期']}
                onChange={(date, dateStr) => {
                  if (date.length > 0) {
                    onSearchForm(
                      'replenishmentTimeBegin',
                      dateStr[0] + ' ' + '00:00:00'
                    );
                    onSearchForm(
                      'replenishmentTimeEnd',
                      dateStr[1] + ' ' + '23:59:59'
                    );
                  } else {
                    onSearchForm('replenishmentTimeBegin', '');
                    onSearchForm('replenishmentTimeEnd', '');
                  }
                }}
              />
            ) : null}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                const params = this.state;
                onSearch(params);
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
