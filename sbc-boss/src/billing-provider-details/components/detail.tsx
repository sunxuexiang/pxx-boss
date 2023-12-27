import React from 'react';

import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import moment from 'moment';

import { Const, util } from 'qmkit';

@Relax
export default class BillingDetails extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
    };
  };

  static relaxProps = {
    settlement: 'settlement'
  };

  render() {
    const { settlement } = this.props.relaxProps;

    return (
      <div>
        <div style={styles.static}>
          <p style={{ marginLeft: 5, marginBottom: 10 }}>
            <span style={styles.space}>
              供应商名称：{settlement.get('storeName')}
            </span>
            <span style={styles.space}>
              供应商编码：{settlement.get('companyCode')}
            </span>
            <span style={styles.space}>
              结算时间段：{settlement.get('startTime')}～{settlement.get(
                'endTime'
              )}
            </span>
            <span style={styles.space}>
              结算单号：{settlement.get('settlementCode')}
            </span>
            <span style={styles.space}>
              结算单生成时间：{moment(settlement.get('createTime'))
                .format(Const.DAY_FORMAT)
                .toString()}
            </span>
          </p>

          <Row>
            <Col span={3}>
              <p style={styles.nav}>供货商应收总额</p>
              <p style={styles.num}>
                {settlement.get('storePrice')
                  ? util.FORMAT_YUAN(settlement.get('storePrice'))
                  : '¥0.00'}
              </p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const styles = {
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  space: {
    marginRight: 35
  }
};
