import { message } from "antd";
import { Action, Actor, Store } from "plume2";
import { Const } from "qmkit";
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import update from 'immutability-helper';
export default class AppStore extends Store {
    bindActor(): Actor[] {
        return [new Surprise]
    }
    // 列表
    init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 100 },cateId=null) => {
        const { customerAccount, brandId } = this.state().toJS();
        const { res } = await webapi.ListStart({
            pageSize,
            pageNum,
            cateId,
            advertisingName: customerAccount||null,
            brandId: brandId|| null
        })
        if (res.code != Const.SUCCESS_CODE) {
            message.error(res.message);
            return
        }
        let list = [];
        if (res.context.goodsInfos) {
            list = res.context.goodsInfos;
            this.dispatch('init-set', {
                list: fromJS(list),
                total: 100,
                pageNum: pageNum + 1
            });
        }
        const brandRes: any = await webapi.fetchBrandList();
        if(brandRes.res.code!=Const.SUCCESS_CODE){
            message.error(brandRes.res.message);
            return
        }else this.dispatch('surpise',{keys:'brandlist',value:brandRes.res.context})
    }
    // 键值设置
    fieldsValue = (keys, value) => {
        this.dispatch('surpise', {keys, value});
    }
    goodsSort=async(dragIndex,hoverIndex)=>{
        let {list}=this.state().toJS();
        let list1=list.map((item,i)=>{return {recommendId:item.recommendId,sortNum:i+1}})
        const { res }:any = await webapi.sort(list1);
        if (res.code == 'K-000000') {
            this.setState(
                update(this.state, {
                    list: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, list[dragIndex]]],
                  },
                }),
            );
            // this.init(pageNum, pageSize);
        } else {
            message.error(res.message);
        }
       
    }
    // 保存
    onOkBackFun = async (skuIds, rows) => {
        const { res } = await webapi.addGoods({
            goodsInfoIds: skuIds
        });
        if (res.code != Const.SUCCESS_CODE) {
            message.error(res.message);
            return
        }
        this.init(); // 刷新
    }
}
class Surprise extends Actor {
    defaultState(): Object {
        return {
            list: [],
            total: 0,
            pageNum: 0,
            customerAccount: null,
            brandlist: [],
            brandId:'',
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
