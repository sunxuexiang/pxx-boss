import React from 'react';
import { IMap, Relax } from 'plume2';
import { Row, Form, Switch, Button } from 'antd';
import styled from 'styled-components';
import { noop } from 'qmkit';
const FormItem = Form.Item;

const Content = styled.div`
  padding-bottom: 20px;
`;

@Relax
export default class StepFive extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      saveAuth: Function;
      onChange: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    saveAuth: noop,
    onChange: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { company, onChange } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    return (
      <div>
        <Form layout="inline">
          <Row>
            <Content>
              <FormItem required={true} label="囤货权限">
                {getFieldDecorator('pileState', {
                  initialValue: storeInfo.get('pileState') === 1,
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={(val) =>
                      onChange({
                        field: 'pileState',
                        value: val ? 1 : 2
                      })
                    }
                  />
                )}
                <span style={{ marginLeft: '12px' }}>
                  开放权限后，商家管理员即可在后台管理囤货活动
                </span>
              </FormItem>
            </Content>
          </Row>
          <Row>
            <Content>
              <FormItem required={true} label="鲸币权限">
                {getFieldDecorator('jingBiState', {
                  initialValue: storeInfo.get('jingBiState') === 1,
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={(val) =>
                      onChange({
                        field: 'jingBiState',
                        value: val ? 1 : 2
                      })
                    }
                  />
                )}
                <span style={{ marginLeft: '12px' }}>
                  开放权限后，商家管理员即可自行进行鲸币充值，平台管理员也可以给商家手动充值鲸币
                </span>
              </FormItem>
            </Content>
          </Row>
          <Row>
            <Content>
              <FormItem required={true} label="预售权限">
                {getFieldDecorator('presellState', {
                  initialValue: storeInfo.get('presellState') === 1,
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={(val) =>
                      onChange({
                        field: 'presellState',
                        value: val ? 1 : 0
                      })
                    }
                  />
                )}
                <span style={{ marginLeft: '12px' }}>
                  开放权限后，商家每个商品都会有默认虚拟库存值，也可自行设置该存值
                </span>
              </FormItem>
            </Content>
          </Row>
        </Form>

        <div className="bar-button">
          <Button onClick={this._save} type="primary">
            保存
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 保存
   */
  _save = () => {
    const form = this.props.form;
    const { saveAuth } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        saveAuth();
      }
    });
  };
}
