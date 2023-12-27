import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs,Form } from 'antd';
import InfoList from './info-list';
import { noop } from 'qmkit';
import { IList } from 'typings/globalType';
import SearchForm from './search-form';
import ButtonGroup from './button-group';

const SearchDataForm = Relax(Form.create()(SearchForm));
@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      warehouseList: IList;
      wareId: any;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    warehouseList: 'warehouseList',
    wareId: 'wareId'
  };

  render() {
    const { onTabChange, wareId,warehouseList } = this.props.relaxProps;
    return (
      <Tabs
        onChange={(key) => onTabChange(key)}
        activeKey={wareId}
        defaultActiveKey="0"
      >
        {
          warehouseList.map(item=>
            <Tabs.TabPane tab={item.get('wareName')} key={String(item.get('wareId'))}>
              {/* 搜索项区域 */}
              <SearchDataForm />

                {/* 操作按钮区域 */}
                <ButtonGroup />

                {/* 数据列表区域 */}
                <InfoList />
            </Tabs.TabPane>
          )
        }
      </Tabs>
    );
  }
}
