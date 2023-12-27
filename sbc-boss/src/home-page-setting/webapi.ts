import { Fetch } from 'qmkit';

export function getweatherswitch() {
  return Fetch<any>('/weatherswitch/getConfig', {
    method: 'GET'
  });
}

/**
 * 修改
 */
export function modifyweatherswitch(info) {
  return Fetch<any>('/weatherswitch/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}
