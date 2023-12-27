import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select } from 'antd';
import { noop, SelectGroup } from 'qmkit';
import { MyRangePicker } from 'biz';
import moment from 'moment';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    tabKey: string;
    relaxProps?: {
      onFormChange: Function;
      onWaitFormChange: Function;
      pageChange: Function;
      getWaitList: Function;
      form: any;
      waitForm: any;
      managerList: IList;
      marketsList: IList;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onWaitFormChange: noop,
    pageChange: noop,
    getWaitList: noop,
    form: 'form',
    waitForm: 'waitForm',
    managerList: 'managerList',
    marketsList: 'marketsList'
  };

  render() {
    const { tabKey } = this.props;
    const {
      pageChange,
      getWaitList,
      form,
      waitForm,
      managerList,
      marketsList
    } = this.props.relaxProps;
    let timeValue;
    if (tabKey === '0') {
      timeValue =
        waitForm.get('beginTime') && waitForm.get('endTime')
          ? [
              moment(waitForm.get('beginTime'), 'YYYY-MM-DD HH:mm:ss'),
              moment(waitForm.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
            ]
          : [];
    } else {
      timeValue =
        form.get('beginTime') && form.get('endTime')
          ? [
              moment(form.get('beginTime'), 'YYYY-MM-DD HH:mm:ss'),
              moment(form.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
            ]
          : [];
    }

    return (
      <Form className="filter-content" layout="inline">
        {tabKey === '0' && (
          <FormItem>
            <Input
              addonBefore="商家账号"
              onChange={(e) => {
                const value = (e.target as any).value;
                this.formChange({
                  field: 'accountName',
                  value
                });
              }}
            />
          </FormItem>
        )}
        {tabKey === '1' && (
          <FormItem>
            <Input
              addonBefore="商家名称"
              onChange={(e) => {
                const value = (e.target as any).value;
                this.formChange({
                  field: 'supplierName',
                  value
                });
              }}
            />
          </FormItem>
        )}

        <FormItem>
          <MyRangePicker
            title={tabKey === '0' ? '注册时间' : '签署时间'}
            getCalendarContainer={() => document.getElementById('page-content')}
            value={timeValue}
            onChange={(e) => {
              let beginTime = '';
              let endTime = '';
              if (e.length > 0) {
                beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
              }
              this.formChange({ field: 'beginTime', value: beginTime });
              this.formChange({ field: 'endTime', value: endTime });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="入驻商家业务代表"
            style={{ width: 80 }}
            labelInValue
            onChange={(value: any) => {
              this.formChange({
                field: 'investmentManager',
                value: value.key ? value.label : ''
              });
            }}
          >
            <Select.Option key="qaunbu" value="">
              全部
            </Select.Option>
            {managerList &&
              managerList.toJS() &&
              managerList.toJS().map((item) => (
                <Select.Option key={item.accountName} value={item.accountName}>
                  {item.employeeName}
                </Select.Option>
              ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="签署方式"
            style={{ width: 80 }}
            onChange={(value) => {
              this.formChange({ field: 'signType', value });
            }}
          >
            <Select.Option key="qaunbu" value="">
              全部
            </Select.Option>
            <Select.Option key={1} value={1}>
              线下签署
            </Select.Option>
            <Select.Option key={0} value={0}>
              线上签署
            </Select.Option>
          </SelectGroup>
        </FormItem>

        {tabKey === '1' && (
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="批发市场"
              style={{ width: 120 }}
              onChange={(value) => {
                this.formChange({
                  field: 'tabRelationValue',
                  value: value ? [value] : []
                });
              }}
              showSearch
              filterOption={(input, option: any) =>
                option.props.children.indexOf(input) >= 0
              }
            >
              <Select.Option key="all" value="">
                全部
              </Select.Option>
              {marketsList &&
                marketsList.toJS() &&
                marketsList.toJS().map((item) => (
                  <Select.Option key={item.marketId} value={item.marketId}>
                    {item.marketName}
                  </Select.Option>
                ))}
            </SelectGroup>
          </FormItem>
        )}

        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={() => {
              pageChange({
                type: tabKey === '0' ? 'waitList' : 'contract',
                current: 1
              });
            }}
            htmlType="submit"
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
  formChange = ({ field, value }) => {
    const { tabKey } = this.props;
    const { onFormChange, onWaitFormChange } = this.props.relaxProps;
    if (tabKey === '0') {
      onWaitFormChange({ field, value });
    } else {
      onFormChange({ field, value });
    }
  };
}
