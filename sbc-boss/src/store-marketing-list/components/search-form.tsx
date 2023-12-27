import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { List } from 'immutable';
type TList = List<IMap>;

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
      storeList: TList;
    };
  };

  exportForm: any;

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    form: 'form',
    storeList: 'storeList'
  };

  render() {
    const { onFormChange, onSearch, storeList } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    const options = storeList ? storeList.toJS() : [];
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="店铺名称"
            style={{ width: 80 }}
            showSearch
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'storeId',
                value
              });
            }}
          >
            <Option key="qaunbu" value="">
              全部
            </Option>
            {options.map((item: any) => {
              return (
                <Option key={item.storeId} value={item.storeId}>
                  {item.storeName}
                </Option>
              );
            })}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input
            addonBefore="活动名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'marketingName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="活动类型"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? '-1' : value;
              onFormChange({
                field: 'marketingSubType',
                value
              });
            }}
          >
            <Option value="-1">全部</Option>
            <Option value="0">满金额减</Option>
            <Option value="1">满数量减</Option>
            <Option value="7">订单满减</Option>
            <Option value="2">满金额折</Option>
            <Option value="3">满数量折</Option>
            <Option value="8">订单满折</Option>
            <Option value="4">满金额赠</Option>
            <Option value="5">满数量赠</Option>
            <Option value="6">订单满赠</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
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
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
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
            onClick={(e) => {
              e.preventDefault();
              onSearch();
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
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'startTime', value: time });
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'endTime', value: time });
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };
}
