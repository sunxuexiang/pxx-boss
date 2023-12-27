import { Actor, Action, IMap } from 'plume2';

export default class TabActor extends Actor {
  defaultState() {
    return {
      tab: {
        key: '1'
      }
    };
  }

  @Action('tab:init')
  init(state: IMap, key: string) {
    return state.setIn(['tab', 'key'], key);
  }
}
