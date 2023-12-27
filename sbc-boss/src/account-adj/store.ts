import { Actor, Store, Action } from "plume2";
import { fromJS } from 'immutable';

export default class AppStore extends Store {
    bindActor(): Actor[] {
        return [
            new Acountad()
        ]
    }
    init = () => {

    }
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
            startList: fromJS([])
        }
    }
    /**
 * 修改表单信息
 */
    @Action('change: form: field')
    changeFormField(state, params) {
        return state.update('activity', (activity) => activity.merge(params));
    }
}