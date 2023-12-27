import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, SelectGroup } from 'qmkit';

const FormItem = Form.Item;
const { Option } = Select;
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
    };
  };

  static relaxProps = {
    onSearch: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'标签名称'}
              onChange={(e) => {
                this.setState({
                  name: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="标签状态"
              defaultValue="全部"
              onChange={(value) => {
                this.setState({
                  labelVisible: value
                });
              }}
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="1" value="1">
                启用
              </Option>
              <Option key="0" value="0">
                禁用
              </Option>
            </SelectGroup>
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
