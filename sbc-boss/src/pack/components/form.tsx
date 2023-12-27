import React from 'react';
import { Form, InputNumber, Switch, Radio } from 'antd';
import styled from 'styled-components';
import { Relax } from 'plume2';

import { noop } from 'qmkit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const ItemBox = styled.div`
  display: flex;
  flex-direciton: row;
  align-items: center;
  justify-content: flex-start;
  height: 39px;
  > div {
    margin-left: 30px;
  }
`;
@Relax
export default class SettingForm extends React.Component<any, any> {
  static relaxProps = {
    configs: 'configs',
    editStatusByConigType: noop,
    editDaysByConfigType: noop
  };

  render() {
    const {
      configs,
      editStatusByConigType,
      editDaysByConfigType
    } = this.props.relaxProps;
    console.log(123123);
    
    return (
      <div style={{ margin: '30px 0 40px 0' }}>
        <Form>
          <FormItem label="打包规则" {...formItemLayout}>
            <RadioGroup
              onChange={(val) =>
                editStatusByConigType(
                  val.target.value,
                  'packingType'
                )
              }
              value={configs.get('packingConfigVO') ? configs.get('packingConfigVO').get('packingType') : 0}
            >
              <Radio value={0}>满金额</Radio>
              <Radio value={1}>满数量</Radio>
            </RadioGroup>
            <InputNumber
              max={9999}
              min={1}
              // precision={0}
              value={configs.get('packingConfigVO') ? configs.get('packingConfigVO').get('packingAmountNum') : 0}
              onChange={(val) =>{
                editStatusByConigType(
                  val,
                  'packingAmountNum'
                )
              }
              }
            />
            <span className="order-setting-span">
              * 如果是满数量必须是整数
            </span>
          </FormItem>
          <FormItem label="单价" {...formItemLayout}>
          <InputNumber
              max={9999}
              min={1}
              // precision={0}
              value={configs.get('packingConfigVO') ? configs.get('packingConfigVO').get('packingAmount') : 0}
              onChange={(val) =>{
                editStatusByConigType(
                  val,
                  'packingAmount'
                )
              }
              }
            />
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 解析小时数据
   * @param context
   */
  _parseHour(context: string) {
    try {
      if (context) return JSON.parse(context).hour;
    } catch (e) {
      if (e instanceof Error) {
        console.error('解析小时数据错误');
      }
    }
  }
}
