import React from 'react';
import { Button, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearchLiveGoods: Function;
    };
  };

  static relaxProps = {
    onSearchLiveGoods: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearchLiveGoods } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={'商品名称'}
            onChange={(e) => {
              this.setState({
                name: e.target.value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={'所属店铺'}
            onChange={(e) => {
              this.setState({
                storeName: e.target.value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              const params = this.state;
              onSearchLiveGoods(params);
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
