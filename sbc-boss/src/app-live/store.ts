import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util } from 'qmkit';
import * as webApi from './webapi';
import LiveActor from './actor/live-actor';
import LiveCompanyActor from './actor/live-company-actor';
import LiveGoodsActor from './actor/live-goods-actor';
import moment from 'moment';
export default class AppStore extends Store {
  bindActor() {
    return [new LiveActor(), new LiveCompanyActor(), new LiveGoodsActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    await Promise.all([
      this.queryPage() //初始化查直播列表
      // this.isOpen() //查是否开启直播共功能
    ]);
  };

  // /**
  //  * 改变开启状态
  //  */
  // changeOpenStatus = async (status) => {
  //   const param = {
  //     configKey: 'liveSwitch',
  //     status: status ? 1 : 0 //0:关闭， 1:开启
  //   };
  //   const { res: pageRes } = await webApi.auditLiveSwitch(param);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     await this.isOpen();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 查询直播功能是否开启
  //  */
  // isOpen = async () => {
  //   const { res: pageRes } = await webApi.isOpen();
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     this.dispatch(
  //       'info:openStatus',
  //       pageRes.context.configVOList[0].status ? true : false
  //     );
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  /**
   * 查询直播列表分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    // const liveListStatus = this.state().get('currentLiveListTab'); //根据状态查tab
    const param = this.state().get('searchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;

    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context);
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
   * 查询直播商品库分页数据
   */
  queryLiveGoodsPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('liveGoods:setLoading', true);
    // const liveGoodsStatus = this.state().get('currentLiveGoodsTab'); //根据状态查tab
    const param = this.state().get('LiveGoodsSearchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    // param.auditStatus = liveGoodsStatus;
    const { res: pageRes } = await webApi.getLiveGoodsPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('liveGoods:setLoading', false);
        // 设置分页数据
        this.dispatch('liveGoods:setPageData', { content: pageRes.context });
        // 设置当前页码
        this.dispatch('liveGoods:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('liveGoods:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('liveGoods:setLoading', false);
    }
  };

  /**
   * 查询直播优惠活动分页数据
   */
  queryLiveCompanyPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('liveCompany:setLoading', true);
    const status = this.state().get('currentLiveCompanyTab'); //根据状态查tab
    const param = this.state().get('liveCompanySearchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.liveBroadcastStatus = status;

    const { res: pageRes } = await webApi.getLiveCompanyPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      let activityList = pageRes.context;
      const now = moment();
      activityList = activityList.map((item) => {
        //设置活动状态
        let pauseFlag;
        const flag = item.couponActivity.pauseFlag;
        if (
          item.couponActivity.startTime != null &&
          item.couponActivity.endTime != null
        ) {
          // 常规赠券活动有开始时间结束时间
          const startTime = moment(item.couponActivity.startTime);
          const endTime = moment(item.couponActivity.endTime);
          if (endTime.isBefore(now)) {
            pauseFlag = 4;
          } else if (startTime.isAfter(now)) {
            pauseFlag = 3;
          } else if (now.isBetween(startTime, endTime)) {
            if (flag == 1) {
              pauseFlag = 2;
            } else {
              pauseFlag = 1;
            }
          }
        } else if (item.couponActivity.couponActivityType == 4) {
          // 权益赠券活动
          if (flag == 1) {
            pauseFlag = 2;
          } else {
            pauseFlag = 1;
          }
        }
        item.couponActivity.pauseFlag = pauseFlag;
        return item;
      });
      // 设置loading结束状态
      this.dispatch('liveCompany:setLoading', false);
      // 设置分页数据
      this.dispatch(
        'liveCompany:setPageData',
        activityList ? { content: activityList } : { content: [] }
      );
      // 设置当前页码
      this.dispatch('liveCompany:setCurrent', pageNum + 1);
      // 清空勾选信息
      this.dispatch('liveCompany:setCheckedData', List());
      // this.transaction(() => {

      // });
    } else {
      message.error(pageRes.message);
      this.dispatch('liveCompany:setLoading', false);
    }
  };

  onAddGoodsChange = async (list) => {
    const { res } = await webApi.getLiveStreamGoodsAdd({ goodsInfoIds: list });
    if (res.code === Const.SUCCESS_CODE) {
      this.onGoodsChange('modalVisible', false);
      this.queryLiveGoodsPage();
    } else {
      message.error(res.message);
    }
  };
  /**
   * 移除优惠券
   */
  onDelCoupons = async (activityId) => {
    const { res } = await webApi.getLiveStreamActivityModify({ activityId });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveCompanyPage();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 移除商品
   */
  onDelGoods = async (goodsInfoId) => {
    const { res } = await webApi.getLiveStreamGoodsModify({ goodsInfoId });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveGoodsPage();
    } else {
      message.error(res.message);
    }
  };

  //打开优惠券弹框
  onIsCouponsModal = (activityId, type) => {
    this.onCompanyChange('activityId', activityId);
    this.onCompanyChange('couponsType', type);
    this.onCompanyChange('isCouponsModal', true);
  };
  /**
   * 推送 isShow:1已发布0未发布
   * idsKey：id
   */
  onCuponsModalOk = (idsKey, isShow) => {
    if (isShow) {
      this.onLiveStreamSendMessage(4, idsKey.join());
    } else {
      this.onLiveStreamSendMessage(2, idsKey.join());
    }
  };
  /**
   * 推送 typ:1商品，2优惠券,4优惠券取消发布
   */
  onLiveStreamSendMessage = async (type: number, value: any) => {
    const activityId = this.state().get('activityId');
    let params =
      type == 1
        ? { goodsInfoId: value }
        : { activityId: activityId, couponId: value };
    const { res } = await webApi.getLiveStreamSendMessage({ ...params, type });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      type == 1 ? this.queryLiveGoodsPage() : this.queryLiveCompanyPage();
      if (type != 1) {
        this.onCompanyChange('isCouponsModal', false);
      }
    } else {
      message.error(res.message);
    }
  };
  /**
   * 商品取消推送
   */
  onCancelLiveStreamSendMessage = async (value) => {
    let { res } = await webApi.getLiveStreamGoodsExplain({
      goodsInfoId: value
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryLiveGoodsPage();
    } else {
      message.error(res.message);
    }
  };

  //选择活动（确定按钮）
  onActivityModalOk = async (idsKey, rows) => {
    const { res } = await webApi.getLiveStreamActivityAdd({
      activityIds: idsKey
    });
    if (res.code === Const.SUCCESS_CODE) {
      // this.onCompanyChange('selectedRowKeys', idsKey);
      // this.onCompanyChange('selectedRows', rows);
      this.onCompanyChange('isActivityModal', false);
      this.queryLiveCompanyPage();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改actor里的値
   */

  onGoodsChange = (key, value) => {
    this.dispatch('goods:info', { key, value });
  };
  onCompanyChange = (key, value) => {
    this.dispatch('company:info', { key, value });
  };

  /**
   * 设置搜索项信息并查询分页数据
   */

  onSearch = async (searchData) => {
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };
  onSearchLiveGoods = async (searchData) => {
    this.dispatch('liveGoods:setSearchData', fromJS(searchData));
    await this.queryLiveGoodsPage();
  };
  onLiveCompanySearch = async (searchData) => {
    this.dispatch('liveCompany:setSearchData', fromJS(searchData));
    await this.queryLiveCompanyPage();
  };

  // /**
  //  * 设置勾选的多个id
  //  */
  // onSelect = (checkedIds, row) => {
  //   this.dispatch('liveGoods:setCheckedData', fromJS(checkedIds));
  //   this.dispatch('liveGoods:setLiveGoodsRows', fromJS(row));
  // };

  // /**
  //  * 批量删除
  //  */
  // onBatchDelete = async () => {
  //   const checkedIds = this.state().get('checkedIds');
  //   const { res: delRes } = await webApi.deleteByIdList(checkedIds.toJS());
  //   if (delRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     await this.queryPage();
  //   } else {
  //     message.error(delRes.message);
  //   }
  // };

  // /**
  //  * 打开添加弹窗
  //  */
  // onAdd = () => {
  //   this.transaction(() => {
  //     this.dispatch('info:setVisible', true);
  //     this.dispatch('info:setFormData', fromJS({}));
  //   });
  // };

  // /**
  //  * 打开编辑弹框
  //  */
  // onEdit = async (id) => {
  //   const editData = this.state()
  //     .get('dataList')
  //     .find((v) => v.get('id') == id);
  //   this.transaction(() => {
  //     this.dispatch('info:setFormData', editData);
  //     this.dispatch('info:setVisible', true);
  //   });
  // };

  // /**
  //  * 修改新增/编辑的表单信息
  //  */
  // editFormData = (data) => {
  //   this.dispatch('info:editFormData', data);
  // };

  // /**
  //  * 关闭弹窗
  //  */
  // closeModal = () => {
  //   this.dispatch('info:setVisible', false);
  // };

  // /**
  //  * 保存新增/编辑弹框的内容
  //  */
  // onSave = async () => {
  //   const formData = this.state().get('formData');
  //   let result;
  //   if (formData.get('id')) {
  //     result = await webApi.modify(formData);
  //   } else {
  //     result = await webApi.add(formData);
  //   }
  //   if (result.res.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.closeModal();
  //     this.dispatch('info:setFormData', fromJS({}));
  //     await this.init();
  //   } else {
  //     message.error(result.res.message);
  //   }
  // };

  /**
   * 切换卡片式tab页
   */
  setCurrentTab = (key) => {
    //直播列表

    if (key == 0) {
      // this.onSearch({roomName: null,liveStatus:null,startTime: null,endTime: null})
      this.dispatch(
        'info:setSearchData',
        fromJS({
          roomName: null,
          liveStatus: '',
          startTime: null,
          endTime: null
        })
      );
      this.queryPage();
      //直播商品库
    } else if (key == 1) {
      this.queryLiveGoodsPage();
      //直播商家
    } else {
      this.queryLiveCompanyPage();
    }
    this.dispatch('change:setCurrentTab', key);
  };

  // /**
  //  * 切换直播列表tab页
  //  */
  // changeLiveListTab = async (key) => {
  //   //切换tab页后查数据
  //   await this.dispatch('change:setLiveListTab', key);
  //   this.queryPage();
  // };

  // /**
  //  * 切换直播商家列表
  //  */
  // changeLiveCompanyTab = async (key) => {
  //   //切换tab页后查数据
  //   await this.dispatch('change:setLiveCompanyTab', key);
  //   this.queryLiveCompanyPage();
  // };

  // /**
  //  * 切换直播商品库列表
  //  */
  // changeLiveGoodsTab = async (key) => {
  //   //切换tab页后查数据
  //   await this.dispatch('change:setLiveGoodsTab', key);
  //   this.queryLiveGoodsPage();
  // };

  // /**
  //  * 推荐直播
  //  */
  // changeRecommend = async (value, roomId) => {
  //   const param = {
  //     roomId: roomId,
  //     recommend: value ? 1 : 0 //传当前状态
  //   };
  //   const { res: pageRes } = await webApi.recommend(param);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.init(); //推荐成功刷新
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 商品提审
  //  */
  // onAudit = async (values) => {
  //   const params = [
  //     {
  //       name: values.name,
  //       coverImgUrl: values.coverImgUrl,
  //       priceType: values.priceType,
  //       price: values.price,
  //       price2: values.price2,
  //       url: values.url,
  //       id: values.id
  //     }
  //   ];

  //   const { res: pageRes } = await webApi.goodsAudit(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.queryLiveGoodsPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 批量提审
  //  */
  // spuCheckedFunc = async () => {
  //   const LiveGoodsRows = this.state().get('LiveGoodsRows');
  //   let params = [];
  //   LiveGoodsRows.map((item) => {
  //     item = item.toJS();
  //     const param = {
  //       name: item.name,
  //       coverImgUrl: item.coverImgUrl,
  //       priceType: item.priceType,
  //       price: item.price,
  //       price2: item.price2,
  //       url: item.url,
  //       id: item.id
  //     };
  //     params.push(param);
  //   });

  //   const { res: pageRes } = await webApi.goodsAudit(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.queryLiveGoodsPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 显示驳回弹框
  //  */
  // showRejectModal = (storeId, type) => {
  //   this.dispatch('modal:type', type);
  //   this.dispatch('modal:storeId', storeId);
  //   this.dispatch('order:list:reject:show');
  // };

  // /**
  //  *关闭驳回弹框
  //  */
  // hideRejectModal = () => {
  //   this.dispatch('order:list:reject:hide');
  // };

  // /**
  //  * 审核：type:2
  //  * 驳回：type:3
  //  * 禁用：type:4
  //  */
  // modify = async (id, type, cause) => {
  //   const params = {
  //     liveBroadcastStatus: type,
  //     storeId: id,
  //     auditReason: cause
  //   };
  //   const { res: pageRes } = await webApi.modify(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     if (type == '3' || type == '4') {
  //       this.hideRejectModal();
  //     }
  //     this.queryLiveCompanyPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // /**
  //  * 直播商品库驳回
  //  */
  // liveGoodsReject = async (id, type, cause) => {
  //   const params = {
  //     auditStatus: type,
  //     id: id,
  //     auditReason: cause
  //   };
  //   const { res: pageRes } = await webApi.liveGoodsReject(params);
  //   if (pageRes.code === Const.SUCCESS_CODE) {
  //     message.success('操作成功');
  //     this.hideRejectModal();
  //     this.queryLiveGoodsPage();
  //   } else {
  //     message.error(pageRes.message);
  //   }
  // };

  // liveGoodsShowRejectModal = (id) => {
  //   this.dispatch('modal:goodsId', id);
  //   this.dispatch('order:list:reject:show');
  // };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };
}
