import * as React from 'react';
import { Relax } from 'plume2';
import { Input, Button, Form, Select } from 'antd';
import { fromJS } from 'immutable';
import { noop, SelectGroup } from 'qmkit';
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
const Option = Select.Option;
@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      editSearchData: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    editSearchData: noop,
    pageSize: 'pageSize'
  };

  constructor(props) {
    super(props);

    this.state = {
      brandOptions: 'likeBrandName',
      brandOptionsValue: '',
      brandSeqFlag: ''
    };
  }

  render() {
    return (
      <Form className="filter-content" layout="inline">
        {/*品牌名称、品牌别名搜索*/}
        <FormItem>
          <Input
            addonBefore={this._renderBrandOptionSelect()}
            onChange={(e) => {
              this.setState({
                brandOptionsValue: (e.target as any).value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectBox>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="品牌排序"
              defaultValue={this.state.brandSeqFlag}
              showSearch
              optionFilterProp="children"
              onChange={(value) => {
                this.setState({
                  brandSeqFlag: value
                });
              }}
            >
              <Option value="">全部</Option>
              <Option value="1">已排序</Option>
              <Option value="0">未排序</Option>
            </SelectGroup>
          </SelectBox>
        </FormItem>

        <FormItem>
          <Button
            icon="search"
            type="primary"
            onClick={this._search}
            htmlType="submit"
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  _renderBrandOptionSelect = () => {
    return (
      <Select
        onChange={(val) => {
          this.setState({
            brandOptions: val
          });
        }}
        value={this.state.brandOptions}
        style={{ width: 100 }}
      >
        <Option value="likeBrandName">品牌名称</Option>
        <Option value="likeNickName">品牌别名</Option>
      </Select>
    );
  };

  /**
   * 查询
   */
  _search = () => {
    const { editSearchData, pageSize } = this.props.relaxProps;
    const { brandOptions, brandOptionsValue, brandSeqFlag } = this.state;
    editSearchData(
      fromJS({
        [brandOptions]: brandOptionsValue,
        pageSize: pageSize,
        brandSeqFlag
      })
    );
  };
}
