import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util } from 'qmkit';
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
    // // 加载分类数据
    // await webApi.getCateList().then((res) => {
    //   this.dispatch(
    //     'goodsActor: initCateList',
    //     fromJS((res as any).res.context)
    //   );
    // });
  };
  onSearchPage = () => {
    this.onWareHousePage();
    this.onBrandPage();
    this.onCatesPage();
  };

  onWareHousePage = async () => {
    let res1 = await webApi.wareHousePage({ pageNum: 0, pageSize: 10000 });
    if (res1.res.code === Const.SUCCESS_CODE) {
      this.dispatch('form:field', {
        key: 'warehouseList',
        value: fromJS(res1.res.context?.wareHouseVOPage?.content || [])
      });
    } else {
      message.error(res1.res.message);
      return;
    }
  };

  onBrandPage = async () => {
    let { res }: any = await webApi.getBrandList();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('form:field', {
        key: 'brandList',
        value: fromJS(res.context)
      });
    } else {
      message.error(res.message);
      return;
    }
  };
  onCatesPage = async () => {
    let { res }: any = await webApi.goodsCatesTree();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('form:field', {
        key: 'cateList',
        value: fromJS(res.context)
      });
    } else {
      message.error(res.message);
      return;
    }
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
    const param = this.state().get('searchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.stockoutManageVOPage);
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
    const param = this.state().get('searchData').toJS();
    for (let a in param) {
      if (param[a] == '-1') {
        delete param[a];
      }
    }
    this.dispatch('info:setSearchData', fromJS(param));
    await this.queryPage();
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    if (index != 1) {
      this.dispatch('info:editSearchFormData', {
        key: 'replenishmentTimeBegin',
        value: ''
      });
      this.dispatch('info:editSearchFormData', {
        key: 'replenishmentTimeEnd',
        value: ''
      });
    }
    this.dispatch('info:editSearchFormData', {
      key: 'replenishmentFlag',
      value: index
    });
    this.init();
  };

  onSearchForm = (key, value) => {
    this.dispatch('info:editSearchFormData', {
      key: key,
      value: value
    });
  };

  /**
   * 设置勾选的多个id
   */
  onSelect = (checkedIds) => {
    this.dispatch('info:setCheckedData', fromJS(checkedIds));
  };

  /**
   * 打开导出弹框
   */
  onExportModalShow = (exportModalData) => {
    this.dispatch(
      'info:exportModalShow',
      fromJS({
        ...exportModalData,
        visible: true,
        exportByParams: this.onExportByParams,
        exportByIds: this.onExportByIds,
        exportByAll: this.onExportByAll
      })
    );
  };

  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };

  onExportByAll = () => {
    const searchParams = this.state().get('searchData').toJS();
    return this._onExport({
      replenishmentFlag: searchParams.replenishmentFlag
    });
  };

  /**
   * 按勾选的信息进行导出
   */
  onExportByIds = () => {
    const checkedIds = this.state().get('checkedIds').toJS();

    if (checkedIds.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }
    return this._onExport({ stockoutIdList: checkedIds });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const searchParams = this.state().get('searchData').toJS();
    return this._onExport(searchParams);
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = (window as any).token || '';
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref =
            Const.HOST + `/stockoutmanage/exportOperationData/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve();
      }, 500);
    });
  };
}
