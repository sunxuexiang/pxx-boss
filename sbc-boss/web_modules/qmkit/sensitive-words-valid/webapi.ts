import { Fetch } from 'qmkit';

/**
 * 敏感词校验
 * @param goodsId
 */
export function sensitiveWordsValid(text) {
  return Fetch<TResult>('/sensitiveWords/valid', {
    method: 'POST',
    body: JSON.stringify({text: text})
  });
}
