import { Actor, Store, Action, IMap } from "plume2";
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import { message } from 'antd';
import { Const } from 'qmkit';
interface IInvoiceResponse {
    content: Array<any>;
    total: number;
    pageNum: number;
}

export default class AppStore extends Store {
    bindActor(): Actor[] {
        return [
            new Acountad()
        ]
    }
    //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
    init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
        this.dispatch('loading:start');
        let param = this.state()
            .get('searchForm')
            .toJS();
        // let status = param.checkState == 99 ? null : param.checkState;
        // param.checkState = status;
        param.pageNum = pageNum;
        param.pageSize = pageSize;

        const { res } = await webapi.accountPage(param);
        if (res.code === Const.SUCCESS_CODE) {
            console.log(res.context.pageList, 'res.context.pageList');
            res.context.pageList.content.forEach(element => {
                element.dealTime = element.dealTime.slice(0, -4);
                if (element.tradeType == 0) {
                    element.tradeTypevalue = '充值'
                } else if (element.tradeType == 1) {
                    element.tradeTypevalue = '提现'
                } else if (element.tradeType == 2) {
                    element.tradeTypevalue = '余额支付'
                } else if (element.tradeType == 3) {
                    element.tradeTypevalue = '购物返现'
                } else if (element.tradeType == 4) {
                    element.tradeTypevalue = '调账'
                } else if (element.tradeType == 5) {
                    element.tradeTypevalue = '退款'
                } else if (element.tradeType == 6) {
                    element.tradeTypevalue = '撤销申请'
                } else if (element.tradeType == 7) {
                    element.tradeTypevalue = '拒绝'
                } else if (element.tradeType == 8) {
                    element.tradeTypevalue = '失败'
                }
            });
            this.transaction(() => {
                this.dispatch('list:init', 
                {
                    dataList: res.context.pageList.content,
                    total: res.context.pageList.total,
                    pageNum: pageNum + 1
                  });
            });
        } else {
            message.error(res.message);
            if (res.code === 'K-110001') {
                this.dispatch('loading:end');
            }
        }
    };
    onFormChange = (searchParam) => {
        this.dispatch('change:searchForm', searchParam);
    };
    onSearch = () => {
        this.init()
    }
    // 弹窗
    isVisibleBut = (is, row) => {
        if (is == true) {
            this.dispatch('modal:isVisible', { is: is, item: { ...row } });
            return;
        }
        this.dispatch('modal:isVisible', { is: is, item: {} });
    };
    /**
 * 修改表单信息
 */
    changeFormField = (params) => {
        this.dispatch('change: form: field', fromJS(params));
    };
}
class Acountad extends Actor {
    defaultState(): Object {
        return {
            activity: {
                startTime: '',
                endTime: ''
            },
            customerAccount: null,
            accountState: null,
            //当前的数据总数
            total: 0,
            //当前的分页条数
            pageSize: 10,
            //当前页
            pageNum: 1,
            dataList: fromJS([]),
            searchForm: {
                customerName: null,
                customerAccount: null,
                tradeType: null,
                budgetType: null,
                relationOrderId: null,
                startTime: null,
                endTime: null
            },
            isVisible: false
        }
    }
    /**
 * 修改搜索框
 * @param state
 * @param field
 * @param value
 * @returns {Map<K, V>}
 */
    @Action('change:searchForm')
    searchForm(state, { field, value }) {
        return state.setIn(['searchForm', field], value);
    }
    /**
 * 修改表单信息
 */
    @Action('change: form: field')
    changeFormField(state, params) {
        return state.update('activity', (activity) => activity.merge(params));
    }
    /**
     * 数据初始化
     * @param state
     * @param res
     * @returns {Map<K, V>}
     */
    @Action('list:init')
    init(state: IMap, { dataList, total, pageNum }) {
        
        return state.withMutations((state) => {
            state
                .set('total', total)
                .set('pageNum', pageNum)
                .set('dataList', fromJS(dataList));
        });
    }
    // 弹窗
    @Action('modal:isVisible')
    modalIsVisible(state, t) {
        return state.set('isVisible', t.is).set('pageRow', t.item);
    }
}