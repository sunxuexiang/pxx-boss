import * as React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import '../index.less';

@Relax
export default class MoneyInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentTab: string;
      userInfo: IMap;
      companyInfo: IMap;
    };
  };

  static relaxProps = {
    currentTab: 'currentTab',
    userInfo: 'userInfo',
    companyInfo: 'companyInfo'
  };

  render() {
    const { currentTab, userInfo, companyInfo } = this.props.relaxProps;
    const currentData = currentTab === '0' ? userInfo : companyInfo;
    return (
      <div className="ja-money-box">
        <div>
          <p>鲸币余额</p>
          <span className="ja-main-color">¥{currentData.get('balance')}</span>
        </div>
        <div>
          <p>昨日新增鲸币</p>
          <span className="ja-main-color">
            ¥{currentData.get('addBalance')}
          </span>
        </div>
        <div>
          <p>昨日减少鲸币</p>
          <span className="ja-main-color">
            ¥{currentData.get('reduceBalance')}
          </span>
        </div>
      </div>
    );
  }
}
