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
      form: any;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    form: 'form'
  };

  render() {
    const { onFormChange, onSearch, form } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="店铺名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'storeName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="时间范围"
            style={{ width: 80 }}
            value={form.get('scoreCycle')}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'scoreCycle',
                value
              });
            }}
          >
            <Option value="2">近180日</Option>
            <Option value="1">近90日</Option>
            <Option value="0">近30日</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={() => onSearch()}
            htmlType="submit"
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
