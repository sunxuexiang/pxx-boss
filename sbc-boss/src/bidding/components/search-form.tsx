import React from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, Const, SelectGroup } from 'qmkit';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

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
              addonBefore={'关键字'}
              onChange={(e) => {
                this.setState({
                  keywords: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="状态"
              onChange={(value) => {
                this.setState({
                  biddingStatus: value
                });
              }}
              defaultValue={'-1'}
            >
              <Select.Option key="-1" value="-1">
                全部
              </Select.Option>
              <Select.Option key="0" value="0">
                未开始
              </Select.Option>
              <Select.Option key="1" value="1">
                进行中
              </Select.Option>
              <Select.Option key="2" value="2">
                已失效
              </Select.Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              format={Const.TIME_FORMAT}
              showTime={true}
              placeholder={['活动开始时间', '活动结束时间']}
              onChange={(date, dateStr) => {
                let startTimeBegin = null;
                let startTimeEnd = null;
                if (date.length > 0) {
                  startTimeBegin = dateStr[0];
                  startTimeEnd = dateStr[1];
                }
                this.setState({ startTimeBegin, startTimeEnd });
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
}
