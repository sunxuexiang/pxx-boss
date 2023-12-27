import React from 'react';

import { Relax } from 'plume2';
import { DatePicker, Form, Input, Select, Button } from 'antd';
import { Const, noop, SelectGroup} from 'qmkit';
import { IMap } from 'typings/globalType';
const { Option } = Select;
const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      onFormFieldChange: Function;
      search: Function;
      warehouseList:any;
    };
  };

  static relaxProps = {
    form: 'form',
    warehouseList:'warehouseList',
    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const { form, onFormFieldChange, search,warehouseList } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="优惠券名称"
            value={form.get('likeCouponName')}
            onChange={(e: any) => {
              onFormFieldChange('likeCouponName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="使用范围"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('scopeType', value);
            }}
          >
            <Select.Option key="-1" value="-1">
              不限
            </Select.Option>
            <Select.Option key="0" value="0">
              {Const.couponScopeType[0]}
            </Select.Option>
            <Select.Option key="1" value="1">
              {Const.couponScopeType[1]}
            </Select.Option>
            <Select.Option key="2" value="2">
              {Const.couponScopeType[2]}
            </Select.Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            format={Const.DAY_FORMAT}
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            showToday={false}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            format={Const.DAY_FORMAT}
            value={endValue}
            placeholder="结束时间"
            onChange={this.onEndChange}
            showToday={false}
          />
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              search();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
