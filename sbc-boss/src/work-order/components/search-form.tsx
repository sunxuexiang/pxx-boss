import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, SelectGroup } from 'qmkit';

const FormItem = Form.Item;

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
              addonBefore={'客户名称'}
              onChange={(e) => {
                this.setState({
                  customerName: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'工单号'}
              onChange={(e) => {
                this.setState({
                  workOrderNo: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="工单状态"
              onChange={(value) => {
                this.setState({
                  status: value
                });
              }}
            >
              <Select.Option key="-1" value="-1">
                {'全部'}
              </Select.Option>
              <Select.Option key="0" value="0">
                待处理
              </Select.Option>
              <Select.Option key="1" value="1">
                已处理
              </Select.Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'联系方式'}
              onChange={(e) => {
                this.setState({
                  contactPhone: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'企业信用代码'}
              onChange={(e) => {
                this.setState({
                  socialCreditCode: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="账号合并"
              onChange={(e) => {
                this.setState({
                  accountMergeStatus: e
                });
              }}
            >
              <Select.Option key="-1" value="-1">
                {'全部'}
              </Select.Option>
              <Select.Option key="0" value="0">
                待合并
              </Select.Option>
              <Select.Option key="1" value="1">
                已合并
              </Select.Option>
            </SelectGroup>
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
