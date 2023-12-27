import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import { Const, noop, SelectGroup, util } from 'qmkit';
import moment from 'moment';
import { WmRangePicker } from 'biz';
import { Relax } from 'plume2';
// import Store from '../store';
const RangePicker = DatePicker.RangePicker;

const { Option } = Select;

const FormItem = Form.Item;

@Relax
export default class search extends Component {
    props: {
        form?: any;
        relaxProps?: {
            activity: any,
            changeFormField: Function;
            onSearch: Function;
            onFormChange: Function;
            searchForm: any;
        };
    };
    static relaxProps = {
        activity: 'activity',
        changeFormField: noop,
        onSearch: noop,
        onFormChange: noop,
        searchForm: 'searchForm'
    }
    render() {
        const { activity, changeFormField, onSearch, onFormChange, searchForm } = this.props.relaxProps;
        // const store = this._store as any;
        console.log('====================================');
        console.log(activity.toJS(), 'activityactivity');
        console.log('====================================');
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <Form className="filter-content" layout="inline">
                    <FormItem>
                        <Input
                            addonBefore="客户名称"
                            onChange={(e) => {
                                const value = (e.target as any).value;
                                onFormChange({
                                    field: 'customerName',
                                    value
                                });
                            }}
                            value={searchForm.get('customerName')}
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            addonBefore="客户账户"
                            onChange={(e) => {
                                const value = (e.target as any).value;
                                onFormChange({
                                    field: 'customerAccount',
                                    value
                                });
                            }}
                            value={searchForm.get('customerAccount')}
                        />
                    </FormItem>
                    <FormItem>
                        <SelectGroup
                            getPopupContainer={() => document.getElementById('page-content')}
                            label="交易类型"
                            // defaultValue=''
                            value={searchForm.get('tradeType') ? searchForm.get('tradeType') : ''}
                            onChange={(e) =>
                            // changeFormField('accountState', e.valueOf())
                            {
                                let value = e.valueOf();
                                if (!value) {
                                    value = null
                                }
                                onFormChange({ field: 'tradeType', value })
                            }
                            }
                        >
                            <Option key="" value="">
                                全部
                            </Option>
                            {/* <Option key="0" value="0">
                                充值
                            </Option> */}
                            <Option key="1" value="1">
                                提现
                            </Option>
                            <Option key="2" value="2">
                                余额支付
                            </Option>
                            {/* <Option key="3" value="3">
                                购物返现
                            </Option> */}
                            <Option key="5" value="5">
                                退款
                            </Option>
                            <Option key="6" value="6">
                                撤回
                            </Option>
                            <Option key="7" value="7">
                                拒绝
                            </Option>
                            <Option key="8" value="8">
                                失败
                            </Option>
                        </SelectGroup>
                    </FormItem>
                    <FormItem>
                        <SelectGroup
                            getPopupContainer={() => document.getElementById('page-content')}
                            label="收支类型"
                            // defaultValue=''
                            value={searchForm.get('budgetType') ? searchForm.get('budgetType') : ''}
                            onChange={(e) => {
                                let value = e.valueOf();
                                if (!value) {
                                    value = null
                                }
                                onFormChange({ field: 'budgetType', value })
                            }
                                // changeFormField('accountState', e.valueOf())
                            }
                        >
                            <Option key="" value="">
                                全部
                            </Option>

                            <Option key="0" value="0">
                                收入
                            </Option>
                            <Option key="1" value="1">
                                支出
                            </Option>
                        </SelectGroup>
                    </FormItem>
                    <FormItem>
                        <Input
                            addonBefore="关联订单编号"
                            onChange={(e) => {
                                const value = (e.target as any).value;
                                onFormChange({
                                    field: 'relationOrderId',
                                    value
                                });
                            }}
                            value={searchForm.get('relationOrderId')}
                        />
                    </FormItem>
                    <FormItem> <RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={['开始时间', '结束时间']}
                        onChange={this.onChange}
                    /></FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => onSearch()} htmlType="submit">
                            搜索
                        </Button>
                        <Button type="primary" style={styles.m20} onClick={() => this.exportDetailList()} htmlType="submit">
                            导出
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
    /**
 *
 * @param settleId
 * @returns {Promise<void>}
 */
    exportDetailList = async () => {
        let base64 = new util.Base64();
        const { searchForm } = this.props.relaxProps;
        const data = searchForm.toJS();
        const token = (window as any).token;
        if (token) {
            let result = JSON.stringify({  
                token: token,
                pageSize: 1000,
                ...data
                // customerName: searchForm.customerName,
                // customerAccount: searchForm.customerAccount,
                // tradeType: searchForm.tradeType,
                // budgetType: searchForm.budgetType,
                // relationOrderId: searchForm.relationOrderId,
                // startTime: searchForm.startTime,
                // endTime: searchForm.endTime
             });
            
            let encrypted = base64.urlEncode(result);

            // 新窗口下载
            const exportHref =
                Const.HOST + `/boss/walletRecord/walletRecordDownLoad/${encrypted}`;
            console.log(result,'resultresult',searchForm.toJS());
            console.log(exportHref);
            

            window.open(exportHref);
        } else {
            message.error('请登录');
        }
    };

    onChange = (value, dateString) => {
        const { onFormChange } = this.props.relaxProps;
        onFormChange({
            field: 'startTime',
            value: dateString[0]
        });
        onFormChange({
            field: 'endTime',
            value: dateString[1]
        });
    }
}
const styles = {
    m20: {
        marginLeft: 20
    }
} as any;