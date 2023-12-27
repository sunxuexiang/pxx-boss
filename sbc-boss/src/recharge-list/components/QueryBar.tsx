import React, { FC, useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select } from 'antd';
import { MyRangePicker } from 'biz';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const QueryBar: FC<any> = (props) => {
  const { form, setPage } = props;

  const onSubmit = () => {
    form.validateFields((err) => {
      if (!err) {
        setPage({ pageNum: 1, pageSize: 10 });
      }
    });
  };

  return (
    <Form className="filter-content" layout="inline" form={form}>
      <FormItem>
        {form.getFieldDecorator('supplierName')(
          <Input addonBefore="店铺名称" />
        )}
      </FormItem>
      <FormItem>
        {form.getFieldDecorator('supplierAccount')(
          <Input addonBefore="商家账号" />
        )}
      </FormItem>
      <FormItem>
        {form.getFieldDecorator('date')(
          <MyRangePicker
            title="充值时间"
            getCalendarContainer={() => document.getElementById('page-content')}
          />
        )}
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          // htmlType="submit"
          onClick={() => {
            onSubmit();
          }}
        >
          搜索
        </Button>
      </FormItem>
    </Form>
  );
};

export default Form.create<any>({})(QueryBar);
