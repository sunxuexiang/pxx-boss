import React from 'react';
import { Relax } from 'plume2';
import { Modal, Button, Form } from 'antd';
import { noop } from 'qmkit';
const FormItem = Form.Item;


const formItemLayout = {
    labelCol: {
        sm: { span: 5 },
        lg: { span: 5 },
        xl: { span: 5 },
        xxl: { span: 5 }
    },
    wrapperCol: {
        sm: { span: 15 },
        lg: { span: 15 },
        xl: { span: 15 },
        xxl: { span: 15 }
    }
};

@Relax
export default class ModalDis extends React.Component<any, any> {
    props: {
        relaxProps?: {
            isVisible: boolean;
            pageRow: any;
            isVisibleBut: Function;
        };
    };
    static relaxProps = {
        isVisible: 'isVisible',
        pageRow: 'pageRow',
        isVisibleBut: noop
    };

    render() {
        const { isVisible, pageRow }: any = this.props.relaxProps;
        console.log(pageRow, 'pageRowpageRowpageRow', isVisible);
        return (
            <Modal
                title="余额明细"
                visible={isVisible}
                onOk={this.confirm}
                onCancel={this.hideModal}
                okText="确认"
                cancelText="取消"
            >
                <div>
                    {isVisible ?
                        <Form>
                            <FormItem {...formItemLayout} label="交易流水号">
                                {pageRow.recordNo}
                            </FormItem>
                            <FormItem {...formItemLayout} label="客户账户">
                                {pageRow.customerAccount}
                            </FormItem>
                            <FormItem {...formItemLayout} label="关联单号">
                                {pageRow.relationOrderId}
                            </FormItem>
                            <FormItem {...formItemLayout} label="交易时间">
                                {pageRow.dealTime}
                            </FormItem>
                            <FormItem {...formItemLayout} label="交易类型">
                                {pageRow.tradeTypevalue}
                            </FormItem>
                            <FormItem {...formItemLayout} label="收支类型">
                                {pageRow.budgetType == 0 ? '收入' : '支出'}
                            </FormItem>
                            <FormItem {...formItemLayout} label="交易金额">
                                {pageRow.dealPrice}
                            </FormItem>
                            <FormItem {...formItemLayout} label="剩下余额">
                                {pageRow.balance}
                            </FormItem>
                        </Form> : ''
                    }
                </div>
            </Modal>
        );
    }
    extractStatus = (extractStatus) => {
        if (extractStatus == '1') {
            return '待审核'
        } else if (extractStatus == '2') {
            return '已审核'
        } else if (extractStatus == '3') {
            return '已打款'
        } else if (extractStatus == '4') {
            return '已拒绝'
        } else if (extractStatus == '5') {
            return '打款失败'
        } else if (extractStatus == '6') {
            return '用户撤回'
        }
    }
    confirm = (eve) => {
        console.log('确定操作');
        this.props.relaxProps.isVisibleBut(false);
        console.log(this.props.relaxProps.pageRow);
    };
    hideModal = (eve) => {
        this.props.relaxProps.isVisibleBut(false);
    };
}
