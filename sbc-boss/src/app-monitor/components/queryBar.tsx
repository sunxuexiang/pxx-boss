import React, { FC } from 'react';
import { Form, Input, DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
// const form = Form.create({})[0];

const QueryBar: FC<any> = (props) => {
  const { form, query } = props;

  const onQuery = () => {
    form.validateFields((err, value) => {
      if (!err) {
        let data = {
          ...value,
          createTimeBegin:
            value.date &&
            value.date[0] &&
            value.date[0].format('YYYY-MM-DD') + ' 00:00:00',
          createTimeEnd:
            value.date &&
            value.date[1] &&
            value.date[1].format('YYYY-MM-DD') + ' 23:59:59'
        };
        query(data);
      }
    });
  };

  return (
    <Form className="filter-content" layout="inline" form={form}>
      <FormItem label="用户账号">
        {form.getFieldDecorator('userNoList')(<Input />)}
      </FormItem>
      <FormItem label="版本号">
        {form.getFieldDecorator('appVersion')(<Input />)}
      </FormItem>
      <FormItem label="登录时间">
        {form.getFieldDecorator('date')(<RangePicker />)}
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          onClick={() => {
            onQuery();
          }}
        >
          搜索
        </Button>
      </FormItem>
    </Form>
  );
};

export default Form.create({})(QueryBar);
