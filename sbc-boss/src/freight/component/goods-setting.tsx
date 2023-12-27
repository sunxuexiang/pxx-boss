import React from 'react';
import { Relax } from 'plume2';

import { Button } from 'antd';
import { history, checkAuth } from 'qmkit';
import { IList } from 'typings/globalType';

import FreightList from './freight-list';

/**
 * 单品运费模板
 */
@Relax
export default class GoodsSetting extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // 单品模板
      goodsFreights: IList;
    };
  };

  static relaxProps = {
    // 单品模板
    goodsFreights: 'goodsFreights'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { goodsFreights } = this.props.relaxProps;
    return [
      goodsFreights.count() < 20 && checkAuth('f_goods_temp_edit') && (
        <Button
          type="primary"
          onClick={() => history.push('/goods-freight')}
          key="button"
        >
          新增单品运费模板
        </Button>
      ),
      <FreightList
        key="feightList"
        data={goodsFreights.toJS()}
        isStore={false}
      />
    ];
  }
}
