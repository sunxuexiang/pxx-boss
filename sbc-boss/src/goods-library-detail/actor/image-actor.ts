import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: []
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    return state.set(
      'images',
      images instanceof Array ? fromJS(images) : images
    );
  }

  /**
   * 移除图片
   * @param state
   * @param {number} id
   */
  @Action('imageActor: remove')
  removeImg(state, id: number) {
    return state.set(
      'images',
      fromJS(
        state
          .get('images')
          .toJS()
          .filter((i) => i.uid !== id)
      )
    );
  }
}
