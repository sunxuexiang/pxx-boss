import * as React from 'react';
import { Relax } from 'plume2';
import { Avatar } from 'antd';
import { withRouter } from 'react-router';
import { IMap } from 'typings/globalType';

import '../index.less';

@withRouter
@Relax
export default class AccountInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountInfo: IMap;
    };
  };

  static relaxProps = {
    accountInfo: 'accountInfo'
  };

  render() {
    const { accountInfo } = this.props.relaxProps;
    return (
      <div className="jad-accountInfo">
        <Avatar
          style={{ backgroundColor: '#87d068', marginRight: '16px' }}
          icon="user"
        />
        <div>
          <p>{accountInfo.get('accountName')}</p>
          <p>账号：{accountInfo.get('accountNumber')}</p>
          <p>账户鲸币余额：{accountInfo.get('accountBlance')}</p>
        </div>
      </div>
    );
  }
}
