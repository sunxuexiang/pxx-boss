import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button, AutoComplete, message } from 'antd';
import moment from 'moment';
import {
  noop,
} from 'qmkit';
import { List, fromJS } from 'immutable';
type TList = List<IMap>;
const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onSearch: Function;
      searchParams:IMap;
      onInviteNewSearchParams:Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    searchParams:'searchParams',
    onInviteNewSearchParams:noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      onSearch,
      searchParams,
      onInviteNewSearchParams
    } = this.props.relaxProps;


    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
            <Input
              addonBefore='邀请用户'
              value={searchParams.get('inviteeAccount')}
              onChange={(e) => {
                onInviteNewSearchParams('inviteeAccount', e.target.value);
              }}
            />
        </FormItem>

        <FormItem>
          <Button type="primary" onClick={() => onSearch()} htmlType="submit">
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  //搜索种类，名称or账号,受邀人or分销员
  _setSearchKind = (kind, value) => {
    // const { setSearchKind } = this.props.relaxProps;
    // setSearchKind({ kind, value });
  };


}
