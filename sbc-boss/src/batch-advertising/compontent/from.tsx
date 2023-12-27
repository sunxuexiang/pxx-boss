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
    advertisingName: 'advertisingName',
    status: 'status',
    advertisingType:'advertisingType',
    onFormFieldChange: noop,
    init: noop
  };

  render() {
    const store = this.store as any;
    const { advertisingName, status, onFormFieldChange,advertisingType, init } =
      this.props.relaxProps;
    console.log('====================================');
    console.log(advertisingName, 'customerAccountcustomerAccount');
    console.log('====================================');
    return (
      <div>
        <Alert
          message="操作提示："
          description={
            <div>
              <p>
                1.同一类型的广告位只能允许启用一条，若启用其他的，则已启用状态自动禁用。
                <br />
                2.配置成功且启用后将会立即生效"
              </p>
            </div>
          }
          type="info"
        ></Alert>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore=" 名称"
              placeholder="请输入名称"
              value={advertisingName}
              onChange={(e: any) =>
                onFormFieldChange('advertisingName', e.target.value)
              }
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="类型"
              defaultValue=""
              // value={status}
              onChange={(e) => onFormFieldChange('advertisingType', e.valueOf())}
            >
              <Option key="" value="">
                全部
              </Option>
              <Option key="1" value="1">
                分栏
              </Option>
              <Option key="0" value="0">
                通栏
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              label="状态"
              defaultValue=""
              onChange={(e) => onFormFieldChange('status', e.valueOf())}
            >
              <Option key="" value="">
                全部
              </Option>
              <Option key="1" value="1">
                启用
              </Option>
              <Option key="0" value="0">
                禁用
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
                pathname: `/batch-advertising-dis/add/0`
              });
            }}
          >
            新建通栏广告位
          </Button>
          <Button
            style={styles.maLeft}
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/batch-advertising-dis/add/1'
              });
            }}
          >
            新建分栏广告位
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
