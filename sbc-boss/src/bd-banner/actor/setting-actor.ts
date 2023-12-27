import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      settings: {
        banner: '',
      }
    };
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.mergeIn(['settings'], setting);
  }
}
