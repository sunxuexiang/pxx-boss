import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
// import { fromJS } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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
          <Input
            addonBefore="订单号"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'orderNo',
                value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="商品名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'goodsInfoName',
                value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <RangePicker
            getCalendarContainer={() => document.getElementById('page-content')}
            onChange={(e) => {
              let beginTime = null;
              let endTime = null;
              if (e.length > 0) {
                beginTime = e[0].format(Const.DAY_FORMAT).toString();
                endTime = e[1].format(Const.DAY_FORMAT).toString();
              }
              onFormChange({
                field: 'beginTime',
                value: beginTime
              });
              onFormChange({
                field: 'endTime',
                value: endTime
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="是否展示"
            style={{ width: 80 }}
            value={form.get('isShow')}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'isShow',
                value
              });
            }}
          >
            <Option value="-1">全部</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
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
