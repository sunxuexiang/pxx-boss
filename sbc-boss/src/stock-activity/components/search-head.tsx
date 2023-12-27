import React from 'react';

import { Relax } from 'plume2';
import { Button, Form, Input, Select } from 'antd';
import { SelectGroup, noop } from 'qmkit';
import { MyRangePicker } from 'biz';
import { IList, IMap } from 'typings/globalType';
import moment from 'moment';

const FormItem = Form.Item;

@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      storeList: IList;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    storeList: 'storeList',
    onFormFieldChange: noop,
    search: noop
  };

  render() {
    const { form, onFormFieldChange, search, storeList } =
      this.props.relaxProps;
    const options = storeList ? storeList.toJS() : [];
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="店铺名称"
            style={{ width: 80 }}
            value={form.get('storeId')}
            showSearch
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
            onChange={(value) => {
              onFormFieldChange('storeId', value);
            }}
          >
            <Select.Option key="qaunbu" value="">
              全部
            </Select.Option>
            {options.map((item: any) => {
              return (
                <Select.Option key={item.storeId} value={item.storeId}>
                  {item.storeName}
                </Select.Option>
              );
            })}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input
            addonBefore="活动名称"
            value={form.get('activityName')}
            onChange={(e: any) => {
              onFormFieldChange('activityName', e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
          <MyRangePicker
            title="活动时间"
            getCalendarContainer={() => document.getElementById('page-content')}
            value={
              form.get('startTime') && form.get('endTime')
                ? [
                    moment(form.get('startTime'), 'YYYY-MM-DD HH:mm:ss'),
                    moment(form.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
                  ]
                : []
            }
            onChange={(e) => {
              let beginTime = '';
              let endTime = '';
              if (e.length > 0) {
                beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
              }
              onFormFieldChange('startTime', beginTime);
              onFormFieldChange('endTime', endTime);
            }}
          />
        </FormItem>

        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              search();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
