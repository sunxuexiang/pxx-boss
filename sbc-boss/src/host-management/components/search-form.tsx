import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { 
  noop,
  SelectGroup,
  TreeSelectGroup 
} from 'qmkit';

const FormItem = Form.Item;
// import styled from 'styled-components';


// const SelectBox = styled.div`
//   .ant-select-dropdown-menu-item,
//   .ant-select-selection-selected-value {
//     max-width: 142px;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//   }
// `;
// const { Option } = Select;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onFormFieldChange: Function;
      searchData:IMap,
    };
  };

  static relaxProps = {
    onSearch: noop,
    onFormFieldChange: noop,
    searchData:'searchData',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch,onFormFieldChange,searchData } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'主播姓名'}
              value={searchData.get('hostName')}
              onChange={(e) => {
                onFormFieldChange('hostName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'联系方式'}
              value={searchData.get('contactPhone')}
              onChange={(e) => {
                onFormFieldChange('contactPhone', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="在职状态"
                defaultValue=""
                showSearch
                onChange={(value) => {
                  onFormFieldChange('workingState', value );
                }}
              >
                <Select.Option value="" key="">全部</Select.Option>
                <Select.Option value="1" key="1">在职</Select.Option>
                <Select.Option value="0" key="0">离职</Select.Option>
              </SelectGroup>
          </FormItem>
          <FormItem>
          <Input
              addonBefore={'直播账号'}
              value={searchData.get('customerAccount')}
              onChange={(e) => {
                onFormFieldChange('customerAccount', e.target.value);
              }}
            />
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
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };
}
