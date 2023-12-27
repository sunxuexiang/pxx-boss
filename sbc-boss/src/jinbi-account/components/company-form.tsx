import * as React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { Form, Input, Button, Select } from 'antd';
import { noop, ValidConst, SelectGroup } from 'qmkit';
import '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@Relax
export default class CompanySearch extends React.Component<any, any> {
  WrapperForm: any;
  props: {
    relaxProps?: {
      setForm: Function;
      geCompanyList: Function;
    };
  };

  static relaxProps = {
    setForm: noop,
    geCompanyList: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CompanyForm as any);
  }

  render() {
    const { setForm } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    return (
      <div>
        <WrapperForm
          ref={(form) => setForm({ key: 'companyForm', form })}
          relaxProps={this.props.relaxProps}
        />
      </div>
    );
  }
}

class CompanyForm extends React.Component<any, any> {
  props: {
    form;
    relaxProps?: {
      setForm: Function;
      geCompanyList: Function;
    };
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { geCompanyList } = this.props.relaxProps;
    return (
      <Form layout="inline" style={{ marginBottom: '16px' }}>
        <FormItem>
          {getFieldDecorator('customerAccount', {
            initialValue: '',
            rules: [
              { pattern: ValidConst.noChar, message: '请输入正确的店铺名称' }
            ]
          })(<Input addonBefore="店铺名称" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('accountName', {
            initialValue: '',
            rules: [{ pattern: ValidConst.noChar, message: '请输入正确的账号' }]
          })(<Input addonBefore="企业账号" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('isMoney', {
            initialValue: ''
          })(
            <SelectGroup label="是否有鲸币">
              <Option key="-1" value="">
                全部
              </Option>
              <Option key="1" value="1">
                是
              </Option>
              <Option key="0" value="0">
                否
              </Option>
            </SelectGroup>
          )}
        </FormItem>
        <Button type="primary" onClick={() => geCompanyList()}>
          搜索
        </Button>
      </Form>
    );
  }
}
