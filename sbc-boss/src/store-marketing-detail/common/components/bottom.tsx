import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import styled from 'styled-components';

const GreyBg = styled.div`
  padding: 15px 0;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;
@withRouter
@Relax
export default class Bottom extends React.Component<any, any> {
  props: {
    relaxProps?: {
      joinLevel: any;
    };
  };

  static relaxProps = {
    joinLevel: 'joinLevel'
  };

  render() {
    const { joinLevel } = this.props.relaxProps;
    let levelName = '';
    if (joinLevel == '-1') {
      levelName = '全平台客户';
    } else if (joinLevel == '0') {
      levelName = '全部等级';
    }

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>目标客户：</span>
              {levelName}
            </Col>
          </Row>
        </GreyBg>
      </div>
    );
  }
}
