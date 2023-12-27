import { Store, Action, Actor, IMap } from "plume2";
import { fromJS } from 'immutable'
import * as webapi from './webapi';
import { Const } from "qmkit";
import { message } from "antd";
import { extend } from "lodash";
export default class AppStore extends Store {
    bindActor(): Actor[] {
        return [new GreaterActor()]
    }
    constructor(props) {
        super(props);
        (window as any)._store = this;
    }
    init = async () => {
        const { res } = await webapi.queryOrderSettings({ lag: true });
        if (res.code != Const.SUCCESS_CODE) {
            message.error(res.message);
        }
        this.dispatch('order-setting:init', res.context);
    }

    /**
     * 修改设置状态
     */
    editStatusByConigType = (number, state) => {
        let configs = this.state().get('configs').toJS();
        this.dispatch('order-setting:status', {
            type: state,
            number
        });
    };
      /**
   * 保存配置
   */
  saveEditConfigs = async () => {
    const configs = this.state().get('configs').toJS();
    console.log(configs,'configs');
    
    const param = {
        retailDeliveryId: configs.retailDeliverConfigVO.retailDeliveryId ? configs.retailDeliverConfigVO.retailDeliveryId : '',
        lessMoney: configs.retailDeliverConfigVO.lessMoney ? configs.retailDeliverConfigVO.lessMoney.toFixed(2) : 0,
        greaterMoney: configs.retailDeliverConfigVO.greaterMoney ? configs.retailDeliverConfigVO.greaterMoney.toFixed(2) : 0,
    }
    const { res } = await webapi.editOrderSettings(param);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存打包设置成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
class GreaterActor extends Actor {
    defaultState(): Object {
        return {
            configs: {}
        }
    }
    @Action('order-setting:init')
    initGreater(state: IMap, configs) {
        return state.set('configs', fromJS(configs));
    }
    /**
 * 编辑设置
 * @param state
 * @param configs
 */
    @Action('order-setting:status')
    editStatus(state: IMap, { type, number }) {
        return state.updateIn(['configs', 'retailDeliverConfigVO', type], () => number);
    }
}