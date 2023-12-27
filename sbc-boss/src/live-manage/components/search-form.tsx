import React from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { Relax } from 'plume2';
import { MyRangePicker } from 'biz';
import { IMap, IList } from 'typings/globalType';
import {
  noop,
  SelectGroup,
  util,
  Const
  // TreeSelectGroup
} from 'qmkit';
import moment from 'moment';

const FormItem = Form.Item;
import styled from 'styled-components';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
// const { Option } = Select;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onFormFieldChange: Function;
      searchData: IMap;
      companyCates: IList;
      brandCates: IList;
      storeList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onFormFieldChange: noop,
    searchData: 'searchData',
    companyCates: 'companyCates',
    brandCates: 'brandCates',
    storeList: 'storeList'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      onSearch,
      onFormFieldChange,
      searchData,
      companyCates,
      brandCates,
      storeList
    } = this.props.relaxProps;
    const options = storeList ? storeList.toJS() : [];
    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="所属店铺"
              style={{ width: 80 }}
              defaultValue=""
              onChange={(value) => {
                onFormFieldChange('storeId', value);
              }}
              showSearch
              filterOption={(input, option: any) =>
                option.props.children.indexOf(input) >= 0
              }
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
              addonBefore={'直播间名称'}
              value={searchData.get('liveRoomName')}
              onChange={(e) => {
                onFormFieldChange('liveRoomName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="厂商"
                defaultValue={null}
                showSearch
                value={searchData.get('companyId')}
                onChange={(value) => {
                  onFormFieldChange('companyId', value);
                }}
              >
                <Select.Option key="0" value={null}>
                  全部
                </Select.Option>
                {companyCates.toJS().map((v, i) => {
                  return (
                    <Select.Option key={i + 1} value={Number(v.companyId)}>
                      {v.companyName}
                    </Select.Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="品牌"
                defaultValue={null}
                showSearch
                value={searchData.get('brandId')}
                onChange={(value) => {
                  onFormFieldChange('brandId', value);
                }}
              >
                <Select.Option key="0" value={null}>
                  全部
                </Select.Option>
                {brandCates.toJS().map((v, i) => {
                  return (
                    <Select.Option key={i + 1} value={Number(v.brandId)}>
                      {v.brandName}
                    </Select.Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'直播账号'}
              value={searchData.get('accountName')}
              onChange={(e) => {
                onFormFieldChange('accountName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <MyRangePicker
              title="直播时间"
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              value={
                searchData.get('startTime') && searchData.get('endTime')
                  ? [
                      moment(
                        searchData.get('startTime'),
                        'YYYY-MM-DD HH:mm:ss'
                      ),
                      moment(searchData.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
                    ]
                  : []
              }
              onChange={(e) => {
                let beginTime = '';
                let endTime = '';
                if (e.length > 0) {
                  beginTime = e[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
                  endTime = e[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
                }
                onFormFieldChange('startTime', beginTime);
                onFormFieldChange('endTime', endTime);
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
          <FormItem>
            <Button onClick={this.onExport}>导出</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  // 导出
  onExport = async () => {
    let base64 = new util.Base64();
    const { searchData } = this.props.relaxProps;
    const data = searchData.toJS();
    const token = (window as any).token;
    if (token) {
      let result = JSON.stringify({
        token: token,
        ...data
      });

      let encrypted = base64.urlEncode(result);

      // 新窗口下载
      const exportHref =
        Const.HOST + `/liveStreamRoom/export/params/${encrypted}`;
      // console.log(result, 'resultresult', searchForm.toJS(), exportHref);
      console.log(exportHref, 'exportHref');

      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };
}
