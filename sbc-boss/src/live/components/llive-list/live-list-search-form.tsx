import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      queryPage: Function;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    queryPage: noop,
    onFormFieldChange: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null
    };
  }

  render() {
    const { queryPage, onFormFieldChange } = this.props.relaxProps;
    const { startValue, endValue } = this.state;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={'直播名称'}
            onChange={(e) => {
              onFormFieldChange('name', e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore={'主播昵称'}
            onChange={(e) => {
              onFormFieldChange('anchorName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={'所属店铺'}
            onChange={(e) => {
              onFormFieldChange('storeName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            format="YYYY-MM-DD HH:mm"
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            showToday={false}
            showTime
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            format="YYYY-MM-DD HH:mm"
            value={endValue}
            placeholder="结束时间"
            onChange={this.onEndChange}
            showToday={false}
            showTime
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              queryPage();
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
      time = time.format('YYYY-MM-DD HH:mm:ss');
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format('YYYY-MM-DD HH:mm:ss');
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
