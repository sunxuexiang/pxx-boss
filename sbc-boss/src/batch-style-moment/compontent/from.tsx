import React, { Component } from 'react';
import { Form, Input, Button, Select, Alert } from 'antd';
import { noop, SelectGroup, history } from 'qmkit';
import { Relax } from 'plume2';
import store from '../store';

const { Option } = Select;
const FormItem = Form.Item;

@Relax
export default class Fromsa extends Component<any, any> {
  store: store;
  static relaxProps = {
    hotName: 'hotName',
    status: 'status',
    // advertisingType:'advertisingType',
    onFormFieldChange: noop,
    init: noop
  };

  render() {
    const store = this.store as any;
    const { hotName, status, onFormFieldChange, init } =
      this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="活动名称"
              placeholder="请输入名称"
              value={hotName}
              onChange={(e: any) =>
                onFormFieldChange('hotName', e.target.value)
              }
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              label="状态"
              defaultValue="0"
              onChange={(e) => onFormFieldChange('status', e.valueOf())}
            >
              <Option key="0" value="0">
                全部
              </Option>
              <Option key="1" value="1">
                进行中
              </Option>
              <Option key="3" value="3">
                未开始
              </Option>
              <Option key="4" value="4">
                已结束
              </Option>
              <Option key="2" value="2">
                暂停
              </Option>
              <Option key="6" value="6">
                终止
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={() => {
                init();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <div style={styles.margins}>
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: `/batch-style-moment-dis/add`
              });
            }}
          >
            新建场次
          </Button>
        </div>
      </div>
    );
  }
}
const styles = {
  margins: {
    marginBottom: 10
  } as any,
  maLeft: {
    marginLeft: 10
  } as any
};
