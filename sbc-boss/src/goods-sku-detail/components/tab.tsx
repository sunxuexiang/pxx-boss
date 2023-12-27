import React from 'react';
import { Tabs,Button } from 'antd';
import { history } from 'qmkit';
import BasicInfo from '../components/basic-info';
import Price from '../components/price';

const TabPane = Tabs.TabPane;

export default class Tab extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="基础信息" key="1">
            <BasicInfo />
          </TabPane>
          <TabPane tab="价格及订货量" key="2">
            <Price />
          </TabPane>
        </Tabs>
        <div  className="bar-button">
          <Button
            onClick={()=>{
              history.goBack();
            }}
            style={{ marginRight: 10 }}
          >
            返回
          </Button>
        </div>
      </div>
    );
  }
}
