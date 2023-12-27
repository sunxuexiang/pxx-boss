import React, { useImperativeHandle, forwardRef } from 'react';
import { Form, Input, Button } from 'antd';
import '../index.less';

const FormItem = Form.Item;
const SearchHead = forwardRef((props: any, ref) => {
  const { form, pageChange, handlerExprotFile } = props;
  const { getFieldDecorator } = form;
  useImperativeHandle(ref, () => ({
    form
  }));

  return (
    <Form layout="inline" className="waybill-search">
      <FormItem>
        {getFieldDecorator('id', { initialValue: '' })(
          <Input addonBefore="运单号" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('carrierNameLike', { initialValue: '' })(
          <Input addonBefore="承运商名称" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('tradeOrderId', { initialValue: '' })(
          <Input addonBefore="销售单号" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('storeNameLike', { initialValue: '' })(
          <Input addonBefore="所属商家" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('shipmentSiteNameLike', { initialValue: '' })(
          <Input addonBefore="接货点" />
        )}
      </FormItem>
      <Button type="primary" onClick={() => pageChange()}>
        查询
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => handlerExprotFile()}
      >
        导出
      </Button>
    </Form>
  );
});

const SearchHeadForm = Form.create<any>()(SearchHead);

export default SearchHeadForm;
