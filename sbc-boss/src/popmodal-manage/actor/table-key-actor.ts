import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      infoKey: '0'
    };
  }

  @Action('changeInfo:infoKey')
  changeInfoKey(state: IMap, infoKey) {
    return state.set('infoKey', infoKey);
  }
}
