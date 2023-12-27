import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params, goodsSource: 1 })
  };
  return Fetch<TResult>('/goods/devanning/spus', request);
};

/**
 * 仓库列表
 * @param params
 */
const wareHousePage = (params = { pageNum: 0, pageSize: 10000,wareHousePage:1 }) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params })
  };
  return Fetch<TResult>('/ware/house/page', request);
};

/**
 * spu禁售
 */
const forbidSale = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/forbid', request);
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/goods/goodsCatesTree', {
    method: 'GET'
  });
};

/**
 * 将商品加入到商品库中
 * @param params
 * @returns {Promise<IAsyncResult<any>>}
 */
const copyToGoodsLibrary = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/standard', request);
};

/**
 * 设置商品序号
 */
const setGoodsSeqNum = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/modifySeqNum', request);
};
/**
 * 查询品牌关联
 */
const searchBrandLink = (brandId) => {
  return Fetch<TResult>(`/goods/goodsBrand/${brandId}`);
};

export {
  goodsList,
  forbidSale,
  getBrandList,
  getCateList,
  copyToGoodsLibrary,
  wareHousePage,
  setGoodsSeqNum,
  searchBrandLink
};
