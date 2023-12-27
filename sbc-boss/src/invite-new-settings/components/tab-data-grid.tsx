import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs,Form,Alert } from 'antd';
import NewForm from './new-form';
import OldForm from './old-form';
import RulesForm from './rules-form';
import { noop,AuthWrapper } from 'qmkit';

const NewForms=Form.create({})(NewForm);
const OldForms=Form.create({})(OldForm);
const RulesForms=Form.create({})(RulesForm);
@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      isRewardRecorded: string;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    isRewardRecorded: 'isRewardRecorded'
  };

  render() {
    const { onTabChange, isRewardRecorded } = this.props.relaxProps;
    return (
      <div>
      <Tabs onChange={(key) => onTabChange(key)} activeKey={isRewardRecorded}>
        <Tabs.TabPane tab="新客限购" key="1">
          <Alert
              message=""
              description={
                <div>
                  <p>
                    1、通过邀请链接注册或者注册输入邀请人账号的用户均可享受新客价
                  </p>
                  <p>
                    2、该设置代表每位新用户以新客价购买的最大商品数量
                  </p>
                  <p>
                    3、此处代表的是商品的总件数并非商品种类数
                  </p>
                </div>
              }
              type="info"
          />
          <NewForms />
        </Tabs.TabPane>
        <Tabs.TabPane tab="老客赠礼" key="2">
          <Alert
            message=""
            description={
              <div>
                <p>
                  1、符合邀新享好礼规则的用户可获得赠送好礼的资格
                </p>
                <p>
                  2、该设置代表每位获得兑换好礼资格的用户单笔订单中可兑换的最大商品数量
                </p>
                <p>
                  3、此处代表的是商品的总件数并非商品种类数
                </p>
              </div>
            }
            type="info"
          />
          <OldForms />
        </Tabs.TabPane>
        <Tabs.TabPane tab="邀新规则" key="3">
          <RulesForms />
        </Tabs.TabPane>
      </Tabs>
      
    </div>
    );
  }
}
