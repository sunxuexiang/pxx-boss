import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
    props: {
        form?: any;
        relaxProps?: {
            onFormChange: Function;
            onSearch: Function;
            balanceSum: number;
            searchForm: Map<string, any>;
        };
    };

    static relaxProps = {
        onFormChange: Function,
        onSearch: Function,
        balanceSum: 'balanceSum',
        searchForm: 'searchForm'
    };

    constructor(props) {
        super(props);
    }

    render() {
        // const { onFormChange, searchForm, onSearch } = this.props.relaxProps;
        const {balanceSum} = this.props.relaxProps;
        console.log('====================================');
        console.log(balanceSum,'balanceSumbalanceSum');
        console.log('====================================');
        return (
            <Form className="filter-content" layout="inline">

                <div style={styles.contentMoney}>
                    <div style={styles.Money_text}>累计余额</div>
                    <div style={styles.Money_jine}>{balanceSum}</div>
                </div>
            </Form>
        );
    }
}

const styles = {
    flexcontex: {
        width: '100%'
    },
    Money_text: {
        fontSize: '18px',
    },
    Money_jine: {
        fontSize: '16px',
        color: '#000',
        fontWeight: 'bold'

    },
    contentMoney: {
        width: '100%',
        display: 'flex',
        padding: '30px 0',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
}