import React from 'react';
import { IMap, Relax } from 'plume2';
import { Row, InputNumber, Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid, ValidConst } from 'qmkit';

// @ts-ignore
const { Column } = DataGrid;
const FormItem = Form.Item;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;

@Relax
export default class StepFour extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      setAccountDays: Function;
      shareInfoChange: Function;
      saveshareInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    setAccountDays: noop,
    shareInfoChange: noop,
    saveshareInfo: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { company, shareInfoChange } = this.props.relaxProps;
    const offlineAccount = company.get('offlineAccount');

    return (
      <div>
        <Form layout="inline">
          <Row>
            <Content>
              <FormItem required={true} label="建行商家编号">
                {getFieldDecorator('constructionBankMerchantNumber', {
                  initialValue: company.get('constructionBankMerchantNumber'),
                  rules: [
                    { required: true, message: '请填写建行商家编号' },
                    {
                      pattern: ValidConst.number,
                      message: '请填写正确的建行商家编号'
                    }
                  ]
                })(
                  <Input
                    style={{ width: '200px' }}
                    onChange={(e) =>
                      shareInfoChange(
                        'constructionBankMerchantNumber',
                        e.target.value
                      )
                    }
                  />
                )}
                <span style={styles.tipSpan}>
                  请输入在建行平台生成的该商家编码
                </span>
              </FormItem>
            </Content>
          </Row>
          <Row>
            <Content>
              <FormItem required={true} label="交易手续费">
                {getFieldDecorator('shareRatio', {
                  initialValue: company.get('shareRatio'),
                  rules: [
                    { required: true, message: '请填写交易手续费' },
                    {
                      pattern: ValidConst.discount,
                      message: '请填写正确的交易手续费'
                    }
                  ]
                })(
                  <Input
                    style={{ width: '100px' }}
                    onChange={(e) =>
                      shareInfoChange('shareRatio', e.target.value)
                    }
                  />
                )}
                <span>%</span>
                <span style={styles.tipSpan}>
                  请输入0.00-100.00之间的任意数并保留两位小数
                </span>
              </FormItem>
            </Content>
          </Row>
          <Row>
            <Content>
              <FormItem required={true} label="结算周期">
                {getFieldDecorator('settlementCycle', {
                  initialValue: company.get('settlementCycle')
                })(
                  <InputNumber
                    style={{ width: '100px' }}
                    precision={0}
                    min={1}
                    max={155}
                    onChange={(value) =>
                      shareInfoChange('settlementCycle', value)
                    }
                  />
                )}
                <span>天</span>
                <span style={styles.tipSpan}>请输入1-155 之间的整数</span>
              </FormItem>
            </Content>
          </Row>
        </Form>

        <Content>
          <div style={{ marginBottom: 20 }}>
            <Red>*</Red>
            <H2>结算银行账户 </H2>
          </div>

          <DataGrid
            // @ts-ignore
            dataSource={offlineAccount ? offlineAccount.toJS() : []}
            pagination={false}
            rowKey="accountId"
          >
            <Column
              title="序号"
              dataIndex="accountId"
              key="accountId"
              render={(_text, _rowData, index) => {
                return index + 1;
              }}
            />
            <Column title="银行" dataIndex="bankName" key="bankName" />
            <Column title="账户名" dataIndex="accountName" key="accountName" />
            <Column title="账号" dataIndex="bankNo" key="bankNo" />
            <Column title="支行/分行" dataIndex="bankBranch" key="bankBranch" />
            <Column
              title="收到平台打款"
              dataIndex="isReceived"
              key="isReceived"
              render={(isReceived) => (isReceived == 1 ? '已验证' : '未验证')}
            />
            <Column
              title="主账号"
              dataIndex="isDefaultAccount"
              key="isDefaultAccount"
              render={(isDefaultAccount) =>
                isDefaultAccount == 1 ? '是' : '否'
              }
            />
          </DataGrid>
        </Content>
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
    const { saveshareInfo } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        saveshareInfo();
      } else {
        this.setState({});
      }
    });
  };
}

const styles = {
  tipSpan: {
    paddingLeft: '10px',
    color: 'red'
  }
};
