import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Input, Button, Form,DatePicker, Select } from 'antd';
import {
  noop,
  SelectGroup,
  ExportModal,
  AuthWrapper,
} from 'qmkit';
import { fromJS } from 'immutable';
import styled from 'styled-components';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
// const Option = Select.Option;

// const OPTION_TYPE = {
//   0: 'customerAccount',
//   1: 'customerName'
// };

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

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      setFormField: Function;
      changeCustomerAccountOrNameOption: Function;
      init: Function;
      checkSwapInputGroupCompact: Function;

      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    setFormField: noop,
    changeCustomerAccountOrNameOption: noop,
    init: noop,
    checkSwapInputGroupCompact: noop,

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  render() {
    const {
      form,
      setFormField,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    const {
      customerAccount,
      customerName,
      useBalance,
      // applyTime,
      // startAccountBalance,
      // endAccountBalance,
      // startBlockedBalance,
      // endBlockedBalance,
      // startWithdrawAmount,
      // endWithdrawAmount
    } = form.toJS();

    // let searchText = [];
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="客户名称"
              value={customerName}
              onChange={(e: any) => setFormField('customerName',e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="账号"
              value={customerAccount}
              onChange={(e: any) => setFormField('customerAccount',e.target.value)}
            />
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="是否使用鲸币"
                defaultValue={null}
                showSearch
                value={useBalance}
                onChange={(value) => {
                  setFormField('useBalance', value);
                }}
              >
               <Select.Option key="0" value={null}>全部</Select.Option>
               <Select.Option key="1" value={1}>是</Select.Option>
               <Select.Option key="2" value={0}>否</Select.Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <DueTo>
            <FormItem label="提现申请时间">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={(value, dateString)=>{
                if(dateString?.length){
                  setFormField('recentlyTicketsTimeStart', dateString[0]);
                  setFormField('recentlyTicketsTimeEnd', dateString[1]);
                }else{
                  setFormField('recentlyTicketsTimeStart', '');
                  setFormField('recentlyTicketsTimeEnd', '');
                }
              }}
             />
            </FormItem>
          </DueTo>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => this._search()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <div style={{marginBottom:'10px'}}>
          <AuthWrapper functionName={'f_customer_funds_export'}>
            <Button type="primary" onClick={() => this._handleBatchExport()}>
              批量导出
            </Button>
          </AuthWrapper>
        </div>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          alertInfo={fromJS({
            message: '操作说明:',
            description:
              '为保证效率,每次最多支持' +
              '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'
          })}
          alertVisible={true}
        />
      </div>
    );
  }

  async _handleBatchExport() {
    // 校验是否有导出权限
    // const haveAuth = checkAuth('f_funds_export');
    // if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的信息',
        byIdsTitle: '导出勾选的信息',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    // } else {
    //   message.error('此功能您没有权限访问');
    // }
  }

  /**
   * 构建Option结构
   */
  _buildOptions = () => {
    // const { form } = this.props.relaxProps;
    // return (
    //   <Select
    //     value={form.get('optType')}
    //     getPopupContainer={() => document.getElementById('page-content')}
    //     onChange={(val) => this._changeCustomerAccountOrNameOption(val)}
    //   >
    //     <Option value="0">会员账号</Option>
    //     <Option value="1">会员名称</Option>
    //   </Select>
    // );
  };

  /**
   * 更改搜索项(会员账号、会员名称)
   */
  _changeCustomerAccountOrNameOption = (val) => {
    this.props.relaxProps.changeCustomerAccountOrNameOption(val);
  };

  /**
   * 搜索项设置搜索信息
   */
  _setField = (val) => {
    // const { setFormField, form } = this.props.relaxProps;
    // setFormField(OPTION_TYPE[form.get('optType')], val);
  };

  /**
   * 搜索
   * @private
   */
  _search = () => {
    const { checkSwapInputGroupCompact, init } = this.props.relaxProps;
    checkSwapInputGroupCompact();
    init();
  };
}
