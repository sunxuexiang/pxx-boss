import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取品牌列表
 */
export const getBrandList = (filterParams = {}) => {
  return Fetch('/goods/goodsBrands', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 添加
 */
export const addBrand = (formData: IMap) => {
  return Fetch('/goods/goodsBrand', {
    method: 'POST',
    body: JSON.stringify({
      goodsBrand: formData.toJS()
    })
  });
};

/**
 * 删除
 */
export const deleteBrand = (brandId: string) => {
  return Fetch(`/goods/goodsBrand/${brandId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editBrand = (formData: IMap) => {
  return Fetch('/goods/goodsBrand', {
    method: 'PUT',
    body: JSON.stringify({
      goodsBrand: formData.toJS()
    })
  });
};

/**
 * 获取当前最大序号
 */
export const fetchMaxNum = () => {
  return Fetch<TResult>('/goods/getBrandSeqNumMax');
};

type TResult = {
  code: string;
  message: string;
  context: any;
};
