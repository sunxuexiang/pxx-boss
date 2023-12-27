import React from 'react';

import { Relax } from 'plume2';
import { DatePicker, Form, Input, Select, Button } from 'antd';
import { Const, noop, InputGroupCompact, } from 'qmkit';
import { IMap } from 'typings/globalType';
import styled from 'styled-components';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const {Option}=Select;

const DueTo = styled.div`
  display: inline-block;
  .ant-form-item-label label:after {
    content: none;
  }

  .ant-form-item-label label {
    display: table-cell;
    padding: 0 11px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
    color: #000000a6;
    text-align: center;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    position: relative;
    transition: all 0.3s;
    border-right: 0;
    height: 32px;
    vertical-align: middle;
  }
  .ant-form-item-control-wrapper .ant-input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchForm: IMap;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    searchForm: 'searchForm',
    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    customerOptions:'customerPhone'
  };

  render() {
    const { searchForm, onFormFieldChange, search } = this.props.relaxProps;
    // const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="用户账号"
            value={searchForm.get('customerAccount')}
            placeholder="请输入用户账号"
            onChange={(e: any) => {
              onFormFieldChange('customerAccount', e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
              <Input
                addonBefore={this._renderCustomerOptionSelect()}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  if(this.state.customerOptions=='customerPhone'){
                    onFormFieldChange('customerPhone',value);
                    onFormFieldChange('customerAccount','');
                  }else{
                    onFormFieldChange('customerPhone','');
                    onFormFieldChange('customerName',value);
                  }
                }}
              />
        </FormItem>
        <FormItem>
            <InputGroupCompact
              title="提现金额"
              precision={2}
              startMin={0}
              start={searchForm.get('startApplyPrice')}
              onStartChange={(val) =>
                onFormFieldChange('startApplyPrice', val)
              }
              endMin={0}
              end={searchForm.get('endApplyPrice')}
              onEndChange={(val) =>
                onFormFieldChange('endApplyPrice', val)
              }
            />
          </FormItem>
        {/* <FormItem>
          <Input
            addonBefore="提现金额"
            value={searchForm.get('applyPrice')}
            placeholder="请输入金额"
            onChange={(e: any) => {
              onFormFieldChange('applyPrice', e.target.value);
            }}
          />
        </FormItem>     */}
        <DueTo>
            <FormItem label="提现申请时间">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={(value, dateString)=>{
                if(dateString?.length){
                  onFormFieldChange('beginTime', dateString[0]);
                  onFormFieldChange('endTime', dateString[1]);
                }else{
                  onFormFieldChange('beginTime', '');
                  onFormFieldChange('endTime', '');
                }
                
              }}
             />
            </FormItem>
        </DueTo>
        <DueTo>
            <FormItem label="客服审核时间">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={(value, dateString)=>{
                if(dateString?.length){
                  onFormFieldChange('auditTimeStart', dateString[0]);
                  onFormFieldChange('auditTimeEnd', dateString[1]);
                }else{
                  onFormFieldChange('auditTimeStart', '');
                  onFormFieldChange('auditTimeEnd', '');
                }
              }}
             />
            </FormItem>
        </DueTo>
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



  // disabledStartDate = (startValue) => {
  //   const endValue = this.state.endValue;
  //   if (!startValue || !endValue) {
  //     return false;
  //   }
  //   return startValue.valueOf() > endValue.valueOf();
  // };

  // disabledEndDate = (endValue) => {
  //   const startValue = this.state.startValue;
  //   if (!endValue || !startValue) {
  //     return false;
  //   }
  //   return endValue.valueOf() <= startValue.valueOf();
  // };

  // onChange = (field, value) => {
  //   this.setState({
  //     [field]: value
  //   });
  // };

  // onStartChange = (value) => {
  //   let time = value;
  //   if (time != null) {
  //     time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
  //   }
  //   const { onFormFieldChange } = this.props.relaxProps;
  //   onFormFieldChange('startTime', time);
  //   this.onChange('startValue', value);
  // };

  // onEndChange = (value) => {
  //   let time = value;
  //   if (time != null) {
  //     time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
  //   }
  //   const { onFormFieldChange } = this.props.relaxProps;
  //   onFormFieldChange('endTime', time);
  //   this.onChange('endValue', value);
  // };
  _renderCustomerOptionSelect = () => {
    // const { onFormFieldChange,form } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            customerOptions: value
          });
          // onFormFieldChange('customerOptions',value);
        }} value={this.state.customerOptions}>
        <Option value="customerPhone">联系方式</Option>
        <Option value="customerName">联系人</Option>
      </Select>
    );
  };
}
