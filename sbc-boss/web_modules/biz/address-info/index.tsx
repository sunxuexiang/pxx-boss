import React from 'react';
import { Form, Input } from 'antd';

import { AreaSelect, ValidConst, QMMethod } from 'qmkit';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

/**
 * 添加收获地址
 */
export default class AddressInfo extends React.Component<any, any> {
  _addressInfoForm: any;

  render() {
    console.log(this.props.addr, '123123');
    const AddressFormComponent = Form.create()(AddressInfoForm);
    const AddressForm = React.createElement(AddressFormComponent, {
      ref: '_addressInfoForm',
      addr: this.props.addr
    } as any);

    return AddressForm;
  }

  data = (cb) => {
    let { addr } = this.props;
    const form = this.refs._addressInfoForm as any;
    form.validateFields(null, (errs, values) => {
      const { area, consigneeName, consigneeNumber, deliveryAddress } = values;
      console.log('====================================');
      console.log(values, 'areaareaarea', addr);
      console.log('====================================');
      //如果校验通过
      if (!errs) {
        cb({
          consigneeName: consigneeName.trim(),
          consigneeNumber,
          deliveryAddress: deliveryAddress.trim(),
          provinceId: area[0],
          cityId: area[1],
          areaId: area[2],
          provinceName: addr.provinceName ? addr.provinceName : null,
          cityName: addr.cityName ? addr.cityName : null,
          areaName: addr.areaName ? addr.areaName : null,
          twonId: addr.twonId ? addr.twonId : null,
          twonName: addr.twonName ? addr.twonName : null
        });
      }
    });
  };
}

/**
 * 新增地址form
 */
class AddressInfoForm extends React.Component<any, any> {
  static defaultProps = {
    addr: {
      area: [],
      consigneeName: '',
      consigneeNumber: '',
      deliveryAddress: '',
      provinceName: null,
      cityName: null,
      areaName: null,
      twonId: null,
      twonName: null
    }
  };

  render() {
    let { addr } = this.props;
    const { getFieldDecorator } = this.props.form;
    addr = addr || AddressInfoForm.defaultProps.addr;

    const initArea = {};
    console.log(addr, 'addraddraddr');

    if (addr.area && addr.area.length > 0) {
      initArea['initialValue'] = addr.area;
    } else {
      initArea['initialValue'] = null;
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="收货人" hasFeedback>
          {getFieldDecorator('consigneeName', {
            initialValue: addr.consigneeName,
            rules: [
              { required: true, whitespace: true, message: '请输入收货人' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '收货人',
                    2,
                    15
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="手机" hasFeedback>
          {getFieldDecorator('consigneeNumber', {
            initialValue: addr.consigneeNumber,
            rules: [
              { required: true, message: '请输入手机号' },
              { pattern: ValidConst.phone, message: '请输入正确的手机号码' }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="所在地区">
          {getFieldDecorator('area', {
            ...initArea,
            onChange: (leb, val) => {
              console.log('====================================');
              console.log(leb, val, 'leb,valleb,val');
              console.log('====================================');
              addr.provinceName= val[0].label ? val[0].label : null;
              addr.cityName= val[1].label ? val[1].label : null;
              addr.areaName= val[2].label ? val[2].label : null;
              addr.twonId= val[3].value ? val[3].value : null;
              addr.twonName= val[3].label ? val[3].label : null;
              // this.setState({
              //   provinceName: val[0].label ? val[0].label : null,
              //   cityName: val[1].label ? val[1].label : null,
              //   areaName: val[2].label ? val[2].label : null,
              //   twonId: val[3].value ? val[3].value : null,
              //   twonName: val[3].label ? val[3].label : null
              // })
            },
            rules: [{ required: true, message: '请输入省市区' }]
          })(<AreaSelect />)}
        </FormItem>

        <FormItem {...formItemLayout} label="详细地址" hasFeedback>
          {getFieldDecorator('deliveryAddress', {
            initialValue: addr.deliveryAddress,
            rules: [
              { required: true, whitespace: true, message: '请输入详细地址' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '详细地址',
                    5,
                    60
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
