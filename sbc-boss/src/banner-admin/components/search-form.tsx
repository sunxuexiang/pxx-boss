import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, SelectGroup } from 'qmkit';
import styled from 'styled-components';
import { IList } from '../../../typings/globalType';

const FormItem = Form.Item;
const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const { Option } = Select;
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      cateList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onFormFieldChange: noop,
    //分类列表
    cateList: 'cateList'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch, cateList } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'轮播名称'}
              onChange={(e) => {
                this.setState({
                  bannerName: e.target.value
                });
              }}
            />
          </FormItem>

          {/*<FormItem>
            <Input
              addonBefore={'一级类目'}
              onChange={(e) => {
                this.setState({
                  oneCateName: e.target.value
                });
              }}
            />
          </FormItem>*/}
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="一级类目"
                defaultValue="全部"
                showSearch
                optionFilterProp="children"
                onChange={(value) => {
                  this.setState({
                    oneCateId: value
                  });
                }}
              >
                <Option key="" value="">
                  全部
                </Option>
                {cateList &&
                  cateList.map((v, i) => {
                    return (
                      <Option key={i} value={v.cateId + ''}>
                        {v.cateName}
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
