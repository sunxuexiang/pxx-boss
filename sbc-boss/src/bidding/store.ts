import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    await this.queryPage();
    // 加载分类数据
    await webApi.getCateList().then((res) => {
      this.dispatch(
        'goodsActor: initCateList',
        fromJS((res as any).res.context)
      );
    });
  };

  onDelete = async (biddingId) => {
    const { res: pageRes } = await webApi.deleteById(biddingId);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.init();
    } else {
      message.error(pageRes.message);
    }
  };
  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.biddingVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async (searchData) => {
    let searchDataParam = searchData;
    const biddingStatus = searchDataParam.biddingStatus;
    let searchDataParamTm = this.state().get('searchData');
    const biddingType = searchDataParamTm.get('biddingType');
    searchDataParam.biddingType = biddingType;
    if (biddingStatus == '-1') {
      searchDataParam.biddingStatus = null;
    }
    this.dispatch('info:setSearchData', fromJS(searchDataParam));
    await this.queryPage();
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('info:editSearchFormData', {
      key: 'biddingType',
      value: index
    });
    this.init();
  };
}
