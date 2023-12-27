import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Input, Button, Form, Select, DatePicker, message } from 'antd';
import {
  SelectGroup,
  noop,
  Const,
  AuthWrapper,
  ExportModal,
  checkAuth
} from 'qmkit';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchForm: any;
      setFormField: Function;
      changeOption: Function;
      init: Function;
      list: IList;
      orList: IList;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    // 搜索项
    searchForm: 'searchForm',
    list: 'list',
    orList: 'orList',
    setFormField: noop,
    changeOption: noop,
    init: noop,

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };
  render() {
    const {
      searchForm,
      setFormField,
      init,
      exportModalData,
      onExportModalHide,
      list,
      orList
    } = this.props.relaxProps;
    const { budgetType, remark } = searchForm.toJS();

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="鲸币类型"
              onChange={(e) => setFormField('budgetType', e)}
              value={budgetType}
            >
              <Option key="0" value={null}>
                全部
              </Option>
              <Option key="1" value={0}>
                获得
              </Option>
              <Option key="2" value={1}>
                扣除
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="鲸币明细"
              onChange={(e) => setFormField('remark', e)}
              value={remark}
            >
              <Option key="0" value="">
                全部
              </Option>
              {[...list.toJS(), ...orList.toJS()].map((item, i) => (
                <Option key={i + 1} value={item}>
                  {item}
                </Option>
              ))}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              onChange={(e) => {
                let startTime = '';
                let endTime = '';
                if (e.length > 0) {
                  startTime = e[0].format(Const.DAY_FORMAT);
                  endTime = e[1].format(Const.DAY_FORMAT);
                }
                setFormField('startTime', startTime);
                setFormField('endTime', endTime);
              }}
            />
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => init()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        {/* <div className="handle-bar">
          <AuthWrapper functionName={'f_funds_detail_export'}>
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
        /> */}
      </div>
    );
  }

  // async _handleBatchExport() {
  //   // 校验是否有导出权限
  //   const haveAuth = checkAuth('f_funds_detail_export');
  //   if (haveAuth) {
  //     const { onExportByParams, onExportByIds } = this.props.relaxProps;
  //     this.props.relaxProps.onExportModalChange({
  //       visible: true,
  //       byParamsTitle: '导出筛选出的会员资金明细记录',
  //       byIdsTitle: '导出选中的会员资金明细记录',
  //       exportByParams: onExportByParams,
  //       exportByIds: onExportByIds
  //     });
  //   } else {
  //     message.error('此功能您没有权限访问');
  //   }
  // }
}
