import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, InputNumber,message } from 'antd';
import { util,Const } from 'qmkit';
const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      searchForm: any;
    };
  };

  static relaxProps = {
    onFormChange: Function,
    onSearch: Function,
    searchForm: 'searchForm'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onFormChange, searchForm, onSearch } = this.props.relaxProps;

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
            value={searchForm.get('customerName')}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="客户账号"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerAccount',
                value
              });
            }}
            value={searchForm.get('customerAccount')}
          />
        </FormItem>
        <FormItem
          label="总余额"
        >
          <InputNumber
            placeholder="请输入价格"
            onChange={(e) => {
              const value = e;
              onFormChange({
                field: 'minBalance',
                value
              });
            }}
            value={searchForm.get('minBalance')}
          ></InputNumber>~
          <InputNumber
            placeholder="请输入价格"
            onChange={(e) => {
              const value = e;
              onFormChange({
                field: 'maxBalance',
                value
              });
            }}
            value={searchForm.get('maxBalance')}
          ></InputNumber>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => onSearch()} htmlType="submit">
            搜索
          </Button>
          <Button type="primary" style={styles.m20} onClick={() => this.exportDetailList()} htmlType="submit">
            导出
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 导出
  exportDetailList = async () => {
    let base64 = new util.Base64();
    const { searchForm } = this.props.relaxProps;
    const data = searchForm.toJS();
    const token = (window as any).token;
    if (token) {
      let result = JSON.stringify({
        token: token,
        pageSize: 1000,
        ...data
      });

      let encrypted = base64.urlEncode(result);

      // 新窗口下载
      const exportHref =
        Const.HOST + `/wallet/account/getWalletAccountBalancePageDownLoad/${encrypted}`;
      // console.log(result, 'resultresult', searchForm.toJS(), exportHref);
      console.log(exportHref,'exportHref');
      
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };
}
const styles = {
  m20: {
    marginLeft: 20
  }
} as any;
