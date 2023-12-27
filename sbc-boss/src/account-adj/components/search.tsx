import React, { Component } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { Const, noop } from 'qmkit';
import moment from 'moment';
import { WmRangePicker } from 'biz';
import { Relax } from 'plume2';
// import Store from '../store';
const RangePicker = DatePicker.RangePicker;

const FormItem = Form.Item;

@Relax
export default class search extends Component {
    props: {
        form?: any;
        relaxProps?: {
            activity: any,
            changeFormField: Function;
            onSearch: Function;
        };
    };
    static relaxProps = {
        activity: 'activity',
        changeFormField: noop,
        onSearch: noop
    }
    render() {
        const { activity, changeFormField, onSearch } = this.props.relaxProps;
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
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            addonBefore="客户账户"
                        />
                    </FormItem>
                    <FormItem label="时间">
                        {getFieldDecorator('time', {
                            rules: [
                                // { required: true, message: '请选择活动时间' },
                                {
                                    validator: (_rule, value, callback) => {
                                        // if (
                                        //     value &&
                                        //     moment()
                                        //         .second(0) &&
                                        //     moment()
                                        //         .second(0)
                                        //         .unix() > value[0].unix()
                                        // ) {
                                        //     callback('开始时间不能早于现在');
                                        // } else
                                         if (value[0] && value[0].unix() >= value[1].unix()) {
                                            callback('开始时间必须早于结束时间');
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ],
                            onChange: (date, dateString) => {
                                if (date) {
                                    changeFormField({
                                        startTime: dateString[0] + ':00',
                                        endTime: dateString[1] + ':00'
                                    });
                                }
                            },
                            initialValue: activity.get('startTime') &&
                                activity.get('endTime') && [
                                    moment(activity.get('startTime')),
                                    moment(activity.get('endTime'))
                                ]
                        })(
                            <RangePicker
                                getCalendarContainer={() =>
                                    document.getElementById('page-content')
                                }
                                // disabledDate={(current) => {
                                //     return current && current.isBefore(moment().startOf('day'));
                                // }}
                                allowClear={false}
                                format={Const.DATE_FORMAT}
                                placeholder={['开始时间', '结束时间']}
                                showTime={{ format: 'HH:mm' }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => onSearch()} htmlType="submit">
                            搜索
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
