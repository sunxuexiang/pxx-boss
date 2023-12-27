import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SelectGroup } from 'qmkit';
import React from 'react';

interface SearchHeaderProps extends FormComponentProps {
  queryParams: { [prop: string]: any };
  onSearch: (data: { [prop: string]: any }) => void;
}

function SearchHeader(props) {
  const { form, onSearch } = props;
  const { getFieldDecorator } = form;

  const options = [
    { label: '商家名称', value: 'supplierName' },
    { label: '店铺名称', value: 'storeName' },
    { label: '商家账号', value: 'contactMobile' }
  ];

  const selectOptions = () => {
    return options.map((item) => {
      return <Select.Option key={item.value}>{item.label}</Select.Option>;
    });
  };

  const supplierTypes = [
    { label: '全部', value: '' },
    { label: '平台自营', value: '0' },
    { label: '第三方商家', value: '1' },
    { label: '统仓统配', value: '2' },
    { label: '零售超市', value: '3' },
    { label: '新散批', value: '4' }
  ];

  const clickSearch = () => {
    const values = form.getFieldsValue();
    const params = (() => {
      const obj = {};
      let paramKey = '';
      for (const key in values) {
        const value = values[key];
        if (key === 'storeNameChoose') {
          paramKey = value;
        } else {
          obj[key] = value;
        }
      }
      if (paramKey) {
        obj[paramKey] = obj['storeName'];
        if (paramKey !== 'storeName') {
          delete obj['storeName'];
        }
      }
      return obj;
    })();
    onSearch(params);
  };

  return (
    <Row gutter={16}>
      <Col span={5}>
        <Form.Item>
          {getFieldDecorator('storeName', {
            initialValue: ''
          })(
            <Input
              addonBefore={getFieldDecorator('storeNameChoose', {
                initialValue: options[0].value
              })(<Select>{selectOptions()}</Select>)}
            />
          )}
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item>
          {getFieldDecorator('companyCode', {
            initialValue: ''
          })(<Input addonBefore="商家编号" />)}
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item>
          {getFieldDecorator('companyType', {
            initialValue: supplierTypes[0].value
          })(
            <SelectGroup label="商家类型">
              {supplierTypes.map((item) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </SelectGroup>
          )}
        </Form.Item>
      </Col>
      <Col span={2}>
        <Form.Item>
          <Button type="primary" onClick={clickSearch}>
            搜索
          </Button>
        </Form.Item>
      </Col>
    </Row>
  );
}

export const FormSearchHeader = Form.create<SearchHeaderProps>()(SearchHeader);
