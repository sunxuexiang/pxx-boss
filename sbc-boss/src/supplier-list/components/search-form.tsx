import React from 'react';
import { Relax } from 'plume2';

import styled from 'styled-components';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { noop, SelectGroup, Const } from 'qmkit';
import { MyRangePicker } from 'biz';
import moment from 'moment';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const { Option } = Select;

const OPTION_TYPE = {
  0: 'supplierName',
  1: 'storeName',
  2: 'accountName'
};

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
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      managerList: IList;
      marketsList: IList;
      setField: Function;
      changeOption: Function;
      initSuppliers: Function;
      onExport: Function;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    managerList: 'managerList',
    marketsList: 'marketsList',
    setField: noop,
    changeOption: noop,
    initSuppliers: noop,
    onExport: noop
  };

  render() {
    const {
      form,
      setField,
      initSuppliers,
      managerList,
      marketsList,
      onExport
    } = this.props.relaxProps;
    const {
      supplierName,
      storeName,
      accountName,
      companyCode,
      contractEndDate,
      accountState,
      storeState,
      companyType,
      recommendFlag,
      selfManage,
      applyEnterTimeStart,
      applyEnterTimeEnd,
      applyTimeStart,
      applyTimeEnd,
      marketId,
      investmentManager
    } = form.toJS();
    const applyEnterTime =
      applyEnterTimeStart && applyEnterTimeEnd
        ? [moment(applyEnterTimeStart), moment(applyEnterTimeEnd)]
        : [];
    const applyTime =
      applyTimeStart && applyTimeEnd
        ? [moment(applyTimeStart), moment(applyTimeEnd)]
        : [];
    const searchText = supplierName || storeName || accountName;
    let investmentManagerVal = '';
    if (investmentManager) {
      managerList.forEach((item) => {
        if (item.get('employeeName') === investmentManager) {
          investmentManagerVal = item.get('accountName');
        }
      });
    }
    console.warn({ label: investmentManager, key: investmentManagerVal });
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={this._buildOptions()}
              value={searchText}
              onChange={(e: any) => this._setField(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="商家编号"
              value={companyCode}
              onChange={(e: any) =>
                setField({ field: 'companyCode', value: e.target.value })
              }
            />
          </FormItem>
          <DueTo>
            <FormItem label="到期时间">
              <DatePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                format={Const.DAY_FORMAT}
                placeholder="-- 前到期商家"
                value={
                  contractEndDate
                    ? moment(contractEndDate, Const.DAY_FORMAT)
                    : null
                }
                onChange={(_date, dateString) =>
                  setField({ field: 'contractEndDate', value: dateString })
                }
              />
            </FormItem>
          </DueTo>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="账号状态"
              value={accountState}
              onChange={(e) =>
                setField({ field: 'accountState', value: e.valueOf() })
              }
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                启用
              </Option>
              <Option key="1" value="1">
                禁用
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="店铺状态"
              value={storeState}
              onChange={(e) =>
                setField({ field: 'storeState', value: e.valueOf() })
              }
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                开启
              </Option>
              <Option key="1" value="1">
                关闭
              </Option>
              <Option key="2" value="2">
                过期
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="商家类型"
              value={companyType}
              onChange={(e) =>
                setField({ field: 'companyType', value: e.valueOf() })
              }
            >
              <Option value="">全部</Option>
              <Option value={0}>平台自营</Option>
              <Option value={1}>第三方商家</Option>
              <Option value={2}>统仓统配</Option>
              <Option value={3}>零售超市</Option>
              <Option value={4}>新散批</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="入驻商家业务代表"
              style={{ width: 80 }}
              labelInValue
              onChange={(value: any) => {
                console.warn(value);
                setField({
                  field: 'investmentManager',
                  value: value.key ? value.label : ''
                });
              }}
              value={
                investmentManager
                  ? { label: investmentManager, key: investmentManagerVal }
                  : undefined
              }
            >
              <Select.Option key="qaunbu" value="">
                全部
              </Select.Option>
              {managerList &&
                managerList.toJS() &&
                managerList.toJS().map((item) => (
                  <Select.Option
                    key={item.accountName}
                    value={item.accountName}
                  >
                    {item.employeeName}
                  </Select.Option>
                ))}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="是否推荐"
              value={recommendFlag}
              onChange={(e) =>
                setField({ field: 'recommendFlag', value: e.valueOf() })
              }
            >
              <Option value="">全部</Option>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="是否自营商家"
              value={selfManage}
              onChange={(e) =>
                setField({ field: 'selfManage', value: e.valueOf() })
              }
            >
              <Option value="">全部</Option>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="批发市场"
              style={{ width: 120 }}
              onChange={(e) => {
                setField({
                  field: 'marketId',
                  value: e.valueOf()
                });
              }}
              showSearch
              value={marketId}
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
          <FormItem>
            <MyRangePicker
              title="签约时间"
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              value={applyTime}
              onChange={(e) => {
                let beginTime = '';
                let endTime = '';
                if (e.length > 0) {
                  beginTime = e[0].format('YYYY-MM-DD');
                  endTime = e[1].format('YYYY-MM-DD');
                }
                setField({ field: 'applyTimeStart', value: beginTime });
                setField({ field: 'applyTimeEnd', value: endTime });
              }}
            />
          </FormItem>
          <FormItem>
            <MyRangePicker
              title="审核时间"
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              value={applyEnterTime}
              onChange={(e) => {
                let beginTime = '';
                let endTime = '';
                if (e.length > 0) {
                  beginTime = e[0].format('YYYY-MM-DD');
                  endTime = e[1].format('YYYY-MM-DD');
                }
                setField({ field: 'applyEnterTimeStart', value: beginTime });
                setField({ field: 'applyEnterTimeEnd', value: endTime });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => initSuppliers()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => onExport()}
              htmlType="button"
            >
              导出
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 构建Option结构
   */
  _buildOptions = () => {
    const { form } = this.props.relaxProps;
    return (
      <Select
        value={form.get('optType')}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => this._changeOptions(val)}
      >
        <Option value="0">商家名称</Option>
        <Option value="1">店铺名称</Option>
        <Option value="2">商家账号</Option>
      </Select>
    );
  };

  /**
   * 更改Option
   */
  _changeOptions = (val) => {
    this.props.relaxProps.changeOption(val);
  };

  /**
   * 搜索项设置搜索信息
   */
  _setField = (val) => {
    const { setField, form } = this.props.relaxProps;
    setField({ field: OPTION_TYPE[form.get('optType')], value: val });
  };
}
