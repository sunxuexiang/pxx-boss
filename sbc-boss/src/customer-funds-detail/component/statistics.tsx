import React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { Row, Col,Avatar } from 'antd';
//import styled from 'styled-components';

// const StatisticsBox = styled.div`
//   width: 100%;
//   background-color: #f5f5f5;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 10px;
//   padding-left: 20px;
//   margin-bottom: 20px;
//   margin-top: 20px;
//   .item {
//     margin-right: 20px;
//   }
//   .text {
//     color: #999;
//     font-size: 12px;
//   }
//   .price {
//     font-size: 16px;
//     color: #333;
//   }
// `;

@Relax
export default class Statistics extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // customerName: string;
      // customerAccount: string;
      // //余额
      // accountBalance: number;
      // //冻结余额
      // blockedBalance: number;
      // //可提现余额
      // withdrawAmount: number;
      // //收入笔数
      // income: number;
      // //收入金额
      // amountReceived: number;
      // //支出笔数
      // expenditure: number;
      // //支出金额
      // amountPaid: number;
      customerDisObj:IMap
    };
  };

  static relaxProps = {
    customerDisObj:'customerDisObj',

    // customerName: 'customerName',
    // customerAccount: 'customerAccount',
    // accountBalance: 'accountBalance',
    // blockedBalance: 'blockedBalance',
    // withdrawAmount: 'withdrawAmount',
    // income: 'income',
    // amountReceived: 'amountReceived',
    // expenditure: 'expenditure',
    // amountPaid: 'amountPaid'
  };
  render() {
    const {
      customerDisObj
    } = this.props.relaxProps;
    return (
      <div style={styles.static}>
        <Row>
          <Col span={24}>
            <div style={styles.flex}>
              <Avatar size={50}  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <div style={{marginLeft:'10px'}}>
                <p >{customerDisObj.get('customerName')}</p>
                <p >账号：{customerDisObj.get('customerAccount')}</p>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <p style={{marginLeft:'60px'}}>
              当前鲸币：{(customerDisObj.get('balance')||0).toFixed(2)}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              已提现：{(customerDisObj.get('extractBalance')||0).toFixed(2)}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              已抵扣：{(customerDisObj.get('deductionBalance')||0).toFixed(2)}
            </p>
          </Col>
          
        </Row>
      </div>
    );
  }
}

const styles = {
  flex:{
    display:'flex',
    alignItems:'center'
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 16
  }
};
