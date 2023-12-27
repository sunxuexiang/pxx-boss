import * as webapi from './webapi';
import { Const } from 'qmkit';

/**
 * 校验敏感词
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param streetCode
 * @returns {string}
 */
export async function sensitiveWordsValid(text) {
    const {res} = await webapi.sensitiveWordsValid(text);
    if (res.code == Const.SUCCESS_CODE && res.context) {
        return res.context;
    }
  return '';
}
