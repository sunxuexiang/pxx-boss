import * as React from 'react';
import { Relax } from 'plume2';
import { MyRangePicker } from 'biz';
import { Form, Input, Button, Select } from 'antd';
import { noop, ValidConst, SelectGroup } from 'qmkit';
import { userList, orList, companyList, modalList } from './optionsList';
import '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@Relax
export default class Search extends React.Component<any, any> {
  WrapperForm: any;
  props: {
    type?: string;
    relaxProps?: {
      setForm: Function;
      getList: Function;
    };
  };

  static relaxProps = {
    setForm: noop,
    getList: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(SearchForm as any);
  }

  render() {
    const { type } = this.props;
    const { setForm } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    return (
      <div>
        <WrapperForm
          ref={(form) => setForm(form)}
          relaxProps={this.props.relaxProps}
          type={type}
        />
      </div>
    );
  }
}

class SearchForm extends React.Component<any, any> {
  props: {
    form;
    type?: string;
    relaxProps?: {
      setForm: Function;
      getList: Function;
    };
  };

  render() {
    const { type } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { getList } = this.props.relaxProps;
    return (
      <Form layout="inline" style={{ marginBottom: '16px' }}>
        <FormItem>
          {getFieldDecorator('budgetType', {
            initialValue: null
          })(
            <SelectGroup label="金额类型">
              <Option key="-1" value={null}>
                全部
              </Option>
              <Option key="0" value={0}>
                获得
              </Option>
              <Option key="1" value={1}>
                扣除
              </Option>
            </SelectGroup>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remark', {
            initialValue: ''
          })(
            <SelectGroup label="明细类型">
              <Option key="-1" value="">
                全部
              </Option>
              {type === 'user' &&
                [...userList, ...orList, ...modalList].map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              {type === 'company' &&
                [...companyList, ...orList, ...modalList].map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
            </SelectGroup>
          )}
        </FormItem>
        {/* {type === 'company' && (
          <FormItem>
            {getFieldDecorator('userAccount', {
              initialValue: '',
              rules: [
                { pattern: ValidConst.noChar, message: '请输入正确的用户账号' }
              ]
            })(<Input addonBefore="用户账号" />)}
          </FormItem>
        )} */}
        <FormItem>
          {getFieldDecorator('detailTime', {
            initialValue: []
          })(
            <MyRangePicker
              title="明细时间"
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
            />
          )}
        </FormItem>

        <Button type="primary" onClick={() => getList()}>
          搜索
        </Button>
      </Form>
    );
  }
}
