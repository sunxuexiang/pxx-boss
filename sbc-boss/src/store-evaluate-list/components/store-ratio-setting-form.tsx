import React from 'react';
import {Row, Col, Button, Input, Form} from 'antd';
import PropTypes from 'prop-types';
import {AuthWrapper, QMMethod, Tips} from 'qmkit';
import Store from '../store';
import {WrappedFormUtils} from "antd/lib/form/Form";

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 6,
        xs: {span: 6},
        sm: {span: 6}
    },
    wrapperCol: {
        span: 14,
        xs: {span: 14},
        sm: {span: 18}
    }
};

export default class StoreRatioSettingForm extends React.Component<any, any> {
    form;

    _store: Store;

    static contextTypes = {
        _plume$Store: PropTypes.object
    };

    constructor(props, ctx) {
        super(props);
        this._store = ctx['_plume$Store'];
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const state = this._store.state();

        if (state.get('loading')) {
            return null;
        }

        const ratio = state.get('ratio')
        return (
            <Form
                style={{paddingBottom: 50, maxWidth: 900}}
                onSubmit={this._handleSubmit}
            >
                <Row>
                    <Col span={18}>
                        <FormItem
                            {...formItemLayout}
                            label="A=商品评论系数="
                            required={true}
                        >
                            {getFieldDecorator('goodsRatio', {
                                initialValue: ratio.get('goodsRatio'),
                                rules: [
                                    {required: true, message: '请填写商品评论系数'},
                                    {
                                        validator: (rule, value, callback) => {
                                            QMMethod.validatorRatioLength(
                                                rule,
                                                value,
                                                callback,
                                                '',
                                            );
                                        }
                                    }
                                ]
                            })(
                                <Input
                                    placeholder="0到1之间的两位小数"
                                    onChange={(e:any) =>
                                        this._store.changeRatioInfo(
                                            {
                                                key: 'goodsRatio',
                                                value: e.target.value
                                            }
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <FormItem
                            {...formItemLayout}
                            label="B=服务评论系数="
                            required={true}
                        >
                            {getFieldDecorator('serverRatio', {
                                initialValue: ratio.get('serverRatio'),
                                rules: [
                                    {required: true, message: '请填写服务评论系数'},
                                    {
                                        validator: (rule, value, callback) => {
                                            QMMethod.validatorRatioLength(
                                                rule,
                                                value,
                                                callback,
                                                '',
                                            );
                                        }
                                    }
                                ]
                            })(
                                <Input
                                    placeholder="0到1之间的两位小数"
                                    onChange={(e) =>
                                        this._store.changeRatioInfo(
                                            {
                                                key: 'serverRatio',
                                                value: (e.target as any).value
                                            }
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <FormItem
                            {...formItemLayout}
                            label="C=物流评分系数="
                            required={true}
                        >
                            {getFieldDecorator('logisticsRatio', {
                                initialValue: ratio.get('logisticsRatio'),
                                rules: [
                                    {required: true, message: '请填写物流评分系数'},
                                    {
                                        validator: (rule, value, callback) => {
                                            QMMethod.validatorRatioLength(
                                                rule,
                                                value,
                                                callback,
                                                '',
                                            );
                                        }
                                    }
                                ]
                            })(
                                <Input
                                    placeholder="0到1之间的两位小数"
                                    onChange={(e) =>
                                        this._store.changeRatioInfo({
                                                key: 'logisticsRatio',
                                                value: (e.target as any).value
                                            }
                                        )
                                    }
                                />
                            )}

                        </FormItem>
                    </Col>
                </Row>
                <Tips title="系数维护总合为1，调整后该系数计算在下次统计时进行生效，商家评价每日进行统计"/>
                <AuthWrapper functionName="f_share_app_edit">
                    <div className="bar-button">
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </div>
                </AuthWrapper>
            </Form>
        );
    }

    /**
     * 提交
     */
    _handleSubmit = (e) => {
        e.preventDefault();
        const form = this.props.form as WrappedFormUtils;
        form.validateFields(null, (errs, values) => {
            if (!errs) {
                (this._store as any).editRatio(values);
            }
        });
    };

}

