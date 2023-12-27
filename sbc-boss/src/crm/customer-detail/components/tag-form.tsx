import React from 'react';
import { Store, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import { noop } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

const tagLables = [
  { id: 0, name: '零食店' },
  { id: 1, name: '便利店' },
  { id: 2, name: '商超' },
  { id: 3, name: '二批发' },
  { id: 4, mame: '水果零食' },
  { id: 5, name: '连锁系统' },
  { id: 6, name: '炒货' }
];

@Relax
export default class TagForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    form;
    relaxProps?: {
      tagList: any;
      groupNames: any;
      baseInfo: any;
      onFormChange: Function;
      modifyCustomerTag: Function;
    };
  };

  static relaxProps = {
    baseInfo: 'baseInfo',
    tagList: 'tagList',
    groupNames: 'groupNames',
    onFormChange: noop,
    modifyCustomerTag: noop
  };

  render() {
    const {
      form: { getFieldDecorator },
      relaxProps: { modifyCustomerTag, baseInfo }
    } = this.props;
    const tagId = baseInfo.customerTag;

    return (
      <Form>
        <FormItem label="会员标签">
          {getFieldDecorator('tagId', {
            initialValue: tagId,
            rules: [{ required: true, message: '请选择会员标签' }]
          })(
            <Select
              placeholder="请选择会员标签"
              onChange={(value) => modifyCustomerTag(value)}
            >
              {tagLables.map((tag) => {
                return (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}
