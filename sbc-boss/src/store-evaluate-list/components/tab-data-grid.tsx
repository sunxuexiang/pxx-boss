import React from 'react';
import { Relax } from 'plume2';
import {Tabs, Alert, Form} from 'antd';
import EvaluateList from './list';
import { noop } from 'qmkit';
import SearchForm from './search-form';
import SettingForm from './store-ratio-setting-form';
const SettingFormWrapper = Form.create()(SettingForm);
@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
        key: 'key';
    };
  };

  static relaxProps = {
    onTabChange: noop,
      key: 'key'
  };

  render() {
    const { onTabChange, key } = this.props.relaxProps;

    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="评价列表" key="0">
            {/*搜索条件*/}
            <SearchForm />
            <EvaluateList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="评价设置" key="1">
            <Alert
                message={
                    <div>
                        商家评价综合评分计算公式=商品平均数*A+服务平均数*B+物流平均数*C
                        <br/>
                        平均数计算公式=∑（各个分数*评分人数占比）
                    </div>
                }
                type="info"
            />
            <br/>
            <SettingFormWrapper/>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
