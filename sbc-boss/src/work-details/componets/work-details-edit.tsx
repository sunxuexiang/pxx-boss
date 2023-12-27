import React from 'react';
import { Col, Select, Input, Row, Tooltip, Button } from 'antd';
import { Form, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  AuthWrapper,
  cache,
  Const,
  history,
  isSystem,
  noop,
  QMMethod,
  QMUpload,
  SelectGroup,
  Tips
} from 'qmkit';
const { Option } = Select;
import { fromJS } from 'immutable';
import { Relax, Store } from 'plume2';
import { IList } from '../../../typings/globalType';
import validate from '../../../web_modules/qmkit/validate';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const { TextArea } = Input;
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
class WorkDetailsShow extends React.Component<any, any> {
  form;

  props: {
    form: any;
    relaxProps?: {
      workOrderDetails: IList;
      addEdit: Function;
      saveEdit: Function;
      editOnChange: Function;
      editFlag: boolean;
      checkFlag: boolean;
    };
  };

  static relaxProps = {
    baseInfo: 'baseInfo',
    workOrderDetails: 'workOrderDetails',
    saveEdit: noop,
    addEdit: noop,
    editOnChange: noop,
    checkFlag: 'checkFlag',
    editFlag: 'editFlag'
  };

  state = {
    flushFlag: true
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      baseInfo: { workOrderNo, status },
      //工单详情
      workOrderDetails,
      addEdit,
      editFlag,
      editOnChange,
      //是否可编辑状态位
      checkFlag
    } = this.props.relaxProps;

    const workOrderList = workOrderDetails.map((elem, index) => {
      return (
        <div>
          <Row>
            {elem.notEditFlag ? (
              <Col span={10}>
                <FormItem label="处理日期" {...formItemLayout}>
                  <DatePicker
                    allowClear={true}
                    disabledDate={(current) => {
                      return current && current.valueOf() > Date.now();
                    }}
                    value={moment(elem.dealTime)}
                    showTime={{ format: 'HH:mm:ss' }}
                    format={Const.TIME_FORMAT}
                    placeholder="处理日期"
                    showToday={true}
                    disabled={elem.notEditFlag}
                  />
                </FormItem>
              </Col>
            ) : null}
            <Col span={10}>
              <FormItem label="处理意见" {...formItemLayout} required={true}>
                {getFieldDecorator(`suggestion${index}`, {
                  initialValue: elem.suggestion,
                  onChange: (value) => {
                    this._editOnChange(index, value.target.value, 'suggestion');
                  },
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写处理意见'
                    },
                    {
                      min: 1,
                      max: 100,
                      message: '1-100字符'
                    }
                  ]
                })(
                  <TextArea
                    autoSize
                    placeholder="字数不能超过100"
                    onKeyDown={(e) => {
                      const et = e || window.event;
                      const keycode = et.charCode || et.keyCode;
                      if (keycode == 13) {
                        if (window.event) {
                          window.event.returnValue = false;
                        } else {
                          e.preventDefault();
                        }
                      }
                    }}
                    disabled={elem.notEditFlag}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <FormItem label="处理状态" {...formItemLayout} required={true}>
                {getFieldDecorator(`handlerState${index}`, {
                  initialValue:
                    elem.status === undefined ||
                    elem.status == null ||
                    elem.status === ''
                      ? '-1'
                      : elem.status.toString(),
                  onChange: (value) => {
                    this._editOnChange(index, value, 'status');
                  },
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写处理状态'
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback();
                          return;
                        }
                        if (value == '-1') {
                          callback('请填写处理状态');
                          return;
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Select
                    style={{ width: 100 }}
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    disabled={elem.notEditFlag}
                  >
                    <Option key="-1" value="-1">
                      请选择
                    </Option>
                    <Option key="0" value="0">
                      待处理
                    </Option>
                    <Option key="1" value="1">
                      已处理
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      );
    });
    return (
      <Form>
        <Row>
          <Col span={10}>
            <FormItem label="工单号" {...formItemLayout}>
              <Input
                disabled={true}
                value={workOrderNo != null ? workOrderNo : ' '}
                style={{ width: 108 }}
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <AuthWrapper functionName="f_work_order_add">
              <Button
                type="primary"
                onClick={() => addEdit()}
                disabled={editFlag || status === 1 || checkFlag}
              >
                +继续处理
              </Button>
            </AuthWrapper>
          </Col>
        </Row>
        {workOrderList}

        <AuthWrapper functionName="f_basicSetting_1">
          <div className="bar-button" style={{ left: 264 }}>
            <Button
              type="primary"
              disabled={checkFlag || !editFlag || status === 1}
              onClick={this._handleSubmit}
            >
              保存
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={() => history.goBack()}>
              返回
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  _editOnChange = (index, value, key) => {
    const { editOnChange } = this.props.relaxProps;
    editOnChange(index, value, key);
    this.setState({ flushFlag: !this.state.flushFlag });
  };

  /**
   * 提交
   */
  _handleSubmit = (e) => {
    const { saveEdit } = this.props.relaxProps;
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        saveEdit();
      }
    });
    this.setState({ flushFlag: !this.state.flushFlag });
  };
}

export default Form.create()(WorkDetailsShow);
