import React, { FC, useState } from 'react';
import { Form, Input, Select, InputNumber, message } from 'antd';

const FormItem = Form.Item;

const Create: FC<any> = (props) => {
  const { form, storeList } = props;
  const [account, setAccount] = useState('');
  const storeChange = (val) => {
    storeList.forEach((item) => {
      if (item.storeId === val) {
        setAccount(item.accountName);
        return;
      }
    });
  };
  // 商家账号BLUR方法
  const storeBlur = () => {
    let id = '';
    storeList.forEach((item) => {
      if (item.accountName === account) {
        id = item.storeId;
      }
    });
    if (id) {
      form.setFieldsValue({ storeId: id });
    } else {
      form.setFieldsValue({ storeId: '' });
      message.error('此账号还不是商家账号');
    }
  };
  return (
    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <FormItem label="商家名称">
        {form.getFieldDecorator('storeId', {
          rules: [{ required: true, message: '请选择商家' }]
        })(
          <Select
            showSearch
            placeholder="请选择商家"
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
            onChange={(val) => storeChange(val)}
          >
            {storeList.map((item) => {
              return (
                <Select.Option key={item.storeId} value={item.storeId}>
                  {item.supplierName}
                </Select.Option>
              );
            })}
          </Select>
        )}
      </FormItem>
      <FormItem label="商家账号">
        <Input
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          onBlur={() => storeBlur()}
        />
      </FormItem>
      <FormItem label="充值金额">
        {form.getFieldDecorator('rechargeBalance', {
          rules: [{ required: true, message: '请输入需充值的金额' }]
        })(
          <InputNumber
            min={0}
            precision={0}
            step={1}
            placeholder="请输入需充值的金额"
            style={{ width: '100%' }}
          />
        )}
      </FormItem>
      <FormItem label="付款方式">
        {form.getFieldDecorator('paymentName')(
          <Input placeholder=" 请输入付款方式" />
        )}
      </FormItem>
      <FormItem label="支付单号">
        {form.getFieldDecorator('payOrderNo')(
          <Input placeholder=" 请输入支付单号" />
        )}
      </FormItem>
    </Form>
  );
};

export default Form.create<any>({})(Create);
