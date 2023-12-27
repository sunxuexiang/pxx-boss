import { Fetch } from 'qmkit';

/**
 * 查询单品运费模板
 * @param freightId
 */
export function fetchFreightGoods(freightId) {
  return Fetch(`/freightTemplate/freightTemplateGoods/${freightId}`);
}

/**
 * 保存单品运费模板
 * @param request
 */
export function saveFreightGoods(request) {
  return Fetch('/freightTemplate/freightTemplateGoods', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}
