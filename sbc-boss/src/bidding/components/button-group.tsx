import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, history } from 'qmkit';
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchData: IMap;
    };
  };

  static relaxProps = {
    searchData: 'searchData'
  };

  render() {
    const { searchData } = this.props.relaxProps;
    const biddingType = searchData.get('biddingType');
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_bidding_add'}>
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/bidding-add',
                state: { biddingType: biddingType === '1' ? 1 : 0 }
              });
            }}
          >
            新增竞价排名
          </Button>
        </AuthWrapper>
      </div>
    );
  }
}
