import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { noop, SelectGroup ,history} from 'qmkit';
import { Relax } from 'plume2';
import store from '../store';


const { Option } = Select;
const FormItem = Form.Item;

@Relax
export default class Fromsa extends Component<any, any> {
    store: store;
    static relaxProps = {
        customerAccount: 'customerAccount',
        accountState: 'accountState',
        onFormFieldChange: noop,
        init: noop
    }

    render() {
        const store = this.store as any;
        const { customerAccount, accountState, onFormFieldChange,init } = this.props.relaxProps;
        console.log('====================================');
        console.log(customerAccount,'customerAccountcustomerAccount',);
        console.log('====================================');
        return (
            <div>
                <Form className="filter-content" layout="inline">
                    <FormItem>
                        <Input
                            addonBefore=" 名称"
                            placeholder="请输入名称"
                            value={customerAccount}
                            onChange={(e: any) => 
                                onFormFieldChange('customerAccount', e.target.value)
                            }
                        />
                    </FormItem>
                    <FormItem>
                        <SelectGroup
                            getPopupContainer={() => document.getElementById('page-content')}
                            label="状态"
                            defaultValue=''
                            // value={accountState}
                            onChange={(e) =>
                                onFormFieldChange('accountState', e.valueOf())
                            }
                        >
                            <Option key="" value="">
                                全部
                            </Option>
                            <Option key="1" value="1">
                                启用
                            </Option>
                            <Option key="0" value="0">
                                禁用
                            </Option>
                        </SelectGroup>
                    </FormItem>
                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon="search"
                            onClick={() => {
                                init();
                            }}
                        >
                            搜索
                        </Button>
                    </FormItem>
                </Form>
                <div style={styles.margins}>
                    <Button type='primary' onClick={() => {
                        history.push('/start-add')  
                    }}>新建</Button>
                </div>
            </div>
        )
    }
}
const styles = {
    margins: {
        marginBottom: 10,
    } as any
}
