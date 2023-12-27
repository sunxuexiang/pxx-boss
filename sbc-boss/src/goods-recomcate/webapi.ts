import { Fetch } from 'qmkit';
type TResult = {
    code: string;
    message: string;
    context: any;
};

/**
 * 查询商品类目
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addRecommend = (params) => {
    return Fetch<TResult>('/goods/goodsCate/recommend', {
        method: 'POST',
        body: JSON.stringify({ ...params })

    });
};

/**
 * 添加超市icon图
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const retailGoodsCate = (params) => {
    return Fetch<TResult>(`/goods/retailGoodsCate/set`, {
        method: 'POST',
        body: JSON.stringify({...params})
    });
};

/**
 * 查询列表
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const addRecommendlist = (params) => {
    return Fetch<TResult>('/goods/goodsCate/recommend', {
        method: 'GET',
        // body: JSON.stringify({ ...params })

    });
};
// 获取超市icon图
export const getImage = () => {
    return Fetch<TResult>('/goods/retailGoodsCateImg/get',{
        method: 'POST'
    })
}

/**
 * 删除推荐类目
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const deleteRecommendlist = (params) => {
    return Fetch<TResult>('/goods/goodsCate/recommend', {
        method: 'DELETE',
        body: JSON.stringify({ ...params })

    });
};

/**
 * 拖拽排序推荐商品分类
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const sort = (params) => {
    return Fetch('/goods/recommend/goods-cate/sort', {
        method: 'PUT',
        body: JSON.stringify(params)
      });
};