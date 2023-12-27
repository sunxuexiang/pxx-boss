import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, AreaSelect, noop, DatePickerLaber } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';

type TList = List<IMap>;

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      employee: TList;
      customerLevels: TList;
      onFormChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    employee: ['employee'],
    customerLevels: ['customerLevels'],
    onFormChange: noop,
    onSearch: noop
  };
  // 注册日期选择
  dateChange = (e) => {
    console.warn(e, '选择日期');
    let beginTime = '';
    let endTime = '';
    if (e.length) {
      beginTime = moment(e[0]).format('YYYY-MM-DD') + ' 00:00:00';
      endTime = moment(e[1]).format('YYYY-MM-DD') + ' 23:59:59';
    }
    console.warn(beginTime, endTime, '选择日期');
    this.props.relaxProps.onFormChange({
      field: 'beginTime',
      value: beginTime
    });
    this.props.relaxProps.onFormChange({
      field: 'endTime',
      value: endTime
    });
  };

  render() {
    const {
      onFormChange,
      onSearch,
      employee,
      customerLevels
    } = this.props.relaxProps;

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

        {/*省市区*/}
        <FormItem>
          <AreaSelect
            label="所在地区"
            getPopupContainer={() => document.getElementById('page-content')}
            onChange={(value) => {
              onFormChange({
                field: 'area',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="账号状态"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'customerStatus',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="0">启用</Option>
            <Option value="1">禁用</Option>
          </SelectGroup>
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
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="平台等级"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'customerLevelId',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            {customerLevels.map((v) => (
              <Option
                key={v.get('customerLevelId').toString()}
                value={v.get('customerLevelId').toString()}
              >
                {v.get('customerLevelName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="业务代表"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'employeeId',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            {employee.map((v) => (
              <Option
                key={v.get('employeeId').toString()}
                value={v.get('employeeId').toString()}
              >
                {v.get('employeeName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="客户标记"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'beaconStar',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="1">已标记</Option>
            <Option value="0">未标记</Option>
          </SelectGroup>
        </FormItem>
        {/*<FormItem>*/}
        {/*<SelectGroup*/}
        {/*getPopupContainer={() => document.getElementById('page-content')}*/}
        {/*label="分销员"*/}
        {/*style={{ width: 80 }}*/}
        {/*onChange={(value) => {*/}
        {/*value = value === '' ? null : value;*/}
        {/*onFormChange({*/}
        {/*field: 'isDistributor',*/}
        {/*value*/}
        {/*});*/}
        {/*}}*/}
        {/*>*/}
        {/*<Option value="">全部</Option>*/}
        {/*<Option value="1">是</Option>*/}
        {/*<Option value="0">否</Option>*/}
        {/*</SelectGroup>*/}
        {/*</FormItem>*/}
        <FormItem>
          <DatePickerLaber
            getPopupContainer={() => document.getElementById('page-content')}
            label="注册时间"
            onChange={this.dateChange}
          ></DatePickerLaber>
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
