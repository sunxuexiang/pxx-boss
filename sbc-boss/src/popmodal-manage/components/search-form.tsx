import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input,Select } from 'antd';
import { noop, history,SelectGroup } from 'qmkit';
import { IList,IMap } from 'typings/globalType';
const FormItem = Form.Item;
const { Option } = Select;
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      setPopupName: Function;
      popupName: string;
      warehouseList:IList;
      wareId:IMap;
      onFormFieldChange:Function;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    setPopupName: noop,
    onFormFieldChange:noop,
    popupName: 'popupName',
    wareId:'wareId',
    warehouseList:'warehouseList'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onSearch, setPopupName, popupName,warehouseList,onFormFieldChange,wareId} = this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="弹窗名称"
              value={popupName}
              onChange={(e) => {
                setPopupName((e.target as any).value);
              }}
            />
          </FormItem>
          <FormItem>
          <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="所属仓库"
                defaultValue=" "
                showSearch
                onChange={(value) => {
                  onFormFieldChange('wareId',value);
                }}
              >
                <Option value=" ">全部</Option>
                {warehouseList.toJS().map((v, i) => {
                  return (
                    <Option key={i} value={(v.wareId)+''}>
                      {v.wareName}
                    </Option>
                  );
                })}
              </SelectGroup>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => onSearch()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
          
        </Form>
        <FormItem>
          <Button
            type="primary"
            onClick={() => history.push(`/popmodal-manage-add/${wareId}`)}
            htmlType="submit"
          >
            新增弹窗
          </Button>
        </FormItem>
      </div>
    );
  }
}
