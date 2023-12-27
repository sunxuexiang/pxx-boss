import React from 'react';
import { Tabs, Button } from 'antd';
import { history } from 'qmkit';
import BasicInfo from './basic-info';

const TabPane = Tabs.TabPane;

export default class Detail extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="main">
          <TabPane tab="基础信息" key="main">
            <BasicInfo />
          </TabPane>
        </Tabs>
        <div className="bar-button">
          <Button
            onClick={() => {
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
