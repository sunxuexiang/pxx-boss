import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

export default class ImportActor extends Actor {
  defaultState() {
    return {
      importModalVisible: false,
      reason: []
    };
  }

  @Action('import: importModal')
  importModalAction(state: IMap, blo: boolean) {
    console.log('-----blo', blo);
    return state.set('importModalVisible', blo);
  }

  @Action('import: reason')
  importErrorReason(state: IMap, arr) {
    return state.set('reason', fromJS(arr));
  }
}
