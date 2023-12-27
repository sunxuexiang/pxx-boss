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
    cateId: string;
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
      brandOptions: '',
      brandOptionsValue: '',
      sortStatus: ''
    };
  }

  render() {
    return (
      <Form className="filter-content" layout="inline">
        {/*品牌名称、品牌别名搜索*/}
        <FormItem>
          <Input
            addonBefore={'品牌名称'}
            defaultValue={this.state.brandOptions}
            onChange={(e) => {
              this.setState({
                brandOptions: (e.target as any).value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={'品牌别名'}
            defaultValue={this.state.brandOptionsValue}
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
              defaultValue={this.state.sortStatus}
              showSearch
              optionFilterProp="children"
              onChange={(value) => {
                this.setState({
                  sortStatus: value
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

  /**
   * 查询
   */
  _search = () => {
    const { editSearchData, pageSize } = this.props.relaxProps;
    const { brandOptions, brandOptionsValue, sortStatus } = this.state;
    const searchData = {
      pageSize: pageSize,
      cateId: this.props.cateId
    };
    if (brandOptionsValue.trim().length > 0) {
      searchData['alias'] = brandOptionsValue;
    }
    if (brandOptions.trim().length > 0) {
      searchData['name'] = brandOptions;
    }
    if (sortStatus.trim().length > 0) {
      searchData['sortStatus'] = sortStatus;
    }
    editSearchData(fromJS(searchData));
  };
}
