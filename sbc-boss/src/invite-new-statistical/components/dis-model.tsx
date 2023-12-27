import React from 'react';
import { Relax } from 'plume2';
import { Form, Modal,Input,Button,Table } from 'antd';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
// import EditForm from './edit-Form';

// const EditFormWrapper = Form.create()(EditForm) as any;
const FormItem = Form.Item;
@Relax
export default class EditModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      detailsVisible: boolean;
      customerAccount: string;
      closeModal: Function;
      onInviteNew:Function;
      onSearchDis:Function;
      detailsList:IList;
    };
  };

  static relaxProps = {
    detailsVisible: 'detailsVisible',
    customerAccount: 'customerAccount',
    closeModal: noop,
    onInviteNew:noop,
    onSearchDis:noop,
    detailsList:'detailsList'
  };

  render() {
    const { detailsVisible, customerAccount,onInviteNew,onSearchDis,detailsList } = this.props.relaxProps;
   
    return (
      <Modal
        title='邀请详情'
        width={800}
        maskClosable={false}
        visible={detailsVisible}
        onCancel={this._onCancel}
        onOk={this._onCancel}
      >
        <Form className="filter-content" layout="inline">
          <FormItem>
              <Input
                addonBefore='邀请用户'
                value={customerAccount}
                onChange={(e) => {
                  onInviteNew('customerAccount', e.target.value);
                }}
              />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => onSearchDis()} htmlType="submit">
              搜索
            </Button>
          </FormItem>
        </Form>

        <Table columns={this.columns} dataSource={detailsList.toJS()} pagination={{ pageSize: 50 }} scroll={{ y: 350 }} />

      </Modal>
    );
  }

  columns=[
    {
      title: '用户',
      dataIndex: 'customerAccount',
      key:'customerAccount',
      
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key:'createTime',
    },
    {
      title: '首单完成时间',
      dataIndex: 'firstBuyTime',
      key:'firstBuyTime',
    },
  ]

  /**
   * 提交表单
   */
  _onOk = () => {
   
  };

  /**
   * 关闭弹框
   */
  _onCancel = () => {
    const {closeModal}=this.props.relaxProps;
    closeModal();
  };
}
