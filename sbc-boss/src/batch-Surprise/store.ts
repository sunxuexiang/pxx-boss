import { message } from "antd";
import { Action, Actor, Store } from "plume2";
import { Const } from "qmkit";
import { fromJS } from 'immutable';
import * as webapi from './webapi';
export default class AppStore extends Store {
    bindActor(): Actor[] {
        return [new Surprise]
    }
    // 列表
    init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 100 }) => {
        // const { customerAccount, accountState } = this.state().toJS();

        const cates: any = await webapi.getCateList();

        this.dispatch('surpise', {
            'keys': 'cateList', 'value': cates.res.context
        })
        const { res } = await webapi.ListStart(
            // {
            // pageSize,
            // pageNum,
            // advertisingName: customerAccount ? customerAccount : null,
            // status: accountState ? accountState : null
        // }
        )
        if (res.code != Const.SUCCESS_CODE) {
            message.error(res.message);
            return
        }
        let list = [];
        list = res.context?.goodsInfos||[];
            let Ids = [];
            list.forEach((el) => {
                Ids.push(el.goodsInfoId)
            })
            this.dispatch('surpise', {
                'keys': 'chooseSkuIds', 'value': fromJS(Ids)
            })
            this.dispatch('init-set', {
                list: fromJS(list),
                total: 100,
                pageNum: pageNum + 1
            });
        
    }

    deleteCoupon = async (recommendId) => {
        const { res } = await webapi.deleterecommend({ recommendId });
        console.log(res, '删除');
        if (res.code != Const.SUCCESS_CODE) {
            message.error(res.message);
            return
        }
        this.init()

    }
    // 键值设置
    fieldsValue = (keys, value) => {
        this.dispatch('surpise', {
            keys, value
        })
    }
    // 保存
    onOkBackFun = async (skuIds, rows) => {
        this.dispatch('surpise', {
            'keys': 'chooseSkuIds',
            'value': fromJS(skuIds)
        });
        this.dispatch('surpise', {
            'keys': 'goodsRows',
            'value': fromJS(rows)
        });
        const { res } = await webapi.addGoods({
            goodsInfoIds: skuIds
        });
        if (res.code != Const.SUCCESS_CODE) {
            message.error(res.message);
            return
        }
        this.init(); // 刷新
        this.dispatch('surpise', {
            'keys': 'goodsModalVisible',
            'value': false
        });
    }
}
class Surprise extends Actor {
    defaultState(): Object {
        return {
            list: [],
            total: 0,
            pageNum: 0,
            goodsModalVisible: false,
            customerAccount: null,
            chooseSkuIds: fromJS([]),
            goodsRows: fromJS([]),
            cateList: []
        }
    }
    @Action('init-set')
    setinit(state, { list, total, pageNum }) {
        return state.set('list', list)
            .set('total', total)
            .set('pageNum', pageNum)
    }
    // 键值设置
    @Action('surpise')
    fieldsValue(state, { keys, value }) {
        return state.set(keys, value)
    }
}
