import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, noop } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop
  };

  render() {
    const { onFormChange, onSearch } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="客户名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore="联系方式"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'contactPhone',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore="账号"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerAccount',
                value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => onSearch()} htmlType="submit">
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
