import React from 'react';
import { Col, Input, Row } from 'antd';
import { Form } from 'antd';
import { Const } from 'qmkit';
import { Relax, Store } from 'plume2';
import { IMap } from '../../../typings/globalType';
import moment from 'moment';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};
@Relax
export default class WorkDetailsShow extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      baseInfo: IMap;
      customerId: string;
    };
  };

  static relaxProps = {
    baseInfo: 'baseInfo',
    customerId: 'customerId'
  };

  render() {
    const {
      baseInfo: { customer, customerAlready }
    } = this.props.relaxProps;

    return (
      <Form
      /* style={{ paddingBottom: 50, maxWidth: 384 }}*/
      >
        <Row gutter={45}>
          <Col span={10}>
            <FormItem label="注册手机号码" {...formItemLayout}>
              <Input
                disabled={true}
                value={customer != null ? customer.customerAccount : ' '}
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="注册单位名称" {...formItemLayout}>
              <Input
                disabled={true}
                value={customer != null ? customer.enterpriseName : ' '}
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={45}>
          <Col span={10}>
            <FormItem label="企业信用代码" {...formItemLayout}>
              <Input
                disabled={true}
                value={customer != null ? customer.socialCreditCode : ' '}
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="注册时间" {...formItemLayout}>
              <Input
                disabled={true}
                value={
                  customer != null
                    ? moment(customer.createTime).format(Const.TIME_FORMAT)
                    : ' '
                }
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={45}>
          <Col span={10}>
            <FormItem label="已注册手机号码" {...formItemLayout}>
              <Input
                disabled={true}
                value={
                  customerAlready != null
                    ? customerAlready.customerAccount
                    : ' '
                }
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="已注册单位名称" {...formItemLayout}>
              <Input
                disabled={true}
                value={
                  customerAlready != null ? customerAlready.enterpriseName : ' '
                }
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={45}>
          <Col span={10}>
            <FormItem label="已注册企业信用代码" {...formItemLayout}>
              <Input
                disabled={true}
                value={
                  customerAlready != null
                    ? customerAlready.socialCreditCode
                    : ' '
                }
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="注册时间" {...formItemLayout}>
              <Input
                disabled={true}
                value={
                  customerAlready != null
                    ? moment(customerAlready.createTime).format(
                        Const.TIME_FORMAT
                      )
                    : ' '
                }
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
