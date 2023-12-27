import React from 'react';
import { Alert, Switch } from 'antd';
import { IMap, Relax } from 'plume2';
import { noop } from 'qmkit';

@Relax
export default class Tips extends React.Component<any, any> {
  props: {
    type;
    relaxProps?: {
      setBusinessBanner: Function;
      dataList: IMap;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    setBusinessBanner: noop
  };
  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <Alert
        message=""
        description={
          <div>
            <p style={{ lineHeight: 2 }}>
              是否开启{' '}
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={dataList.get('isOpen') == '1'}
                onChange={this._change.bind(this)}
              />
              <br />
              开启后，需设置不同满系对应的图标，关闭则按照系统默认样式展示
            </p>
          </div>
        }
        type="info"
      />
    );
  }
  _change(e) {
    const { setBusinessBanner, dataList } = this.props.relaxProps;
    const dataList1 = dataList.toJS();
    dataList1['isOpen'] = e ? '1' : '0';
    setBusinessBanner(dataList1);
  }
}
