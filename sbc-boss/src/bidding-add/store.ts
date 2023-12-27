import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, history } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async (bid?, biddingType?) => {
    this.dispatch('info: setBiddingType', biddingType);
    // 加载分类数据
    await webApi.getCateList().then((res) => {
      this.dispatch(
        'goodsActor: initCateList',
        fromJS((res as any).res.context)
      );
    });
    if (!bid) {
      this.dispatch('info: setAddFlag', true);
      return;
    }
    this.dispatch('info: setAddFlag', false);
    const { res } = await webApi.getById(bid);
    if (res.code == Const.SUCCESS_CODE) {
      const binddingInfo = res.context.biddingVO;
      this.dispatch('info:setFormData', fromJS(res.context.biddingVO));
      const brandInfos = res.context.goodsBrandVOS;
      const goodsCates = res.context.goodsCateVOS;
      const checkIds = binddingInfo.biddingGoodsVOS.map((i) => {
        return i.goodsInfoId;
      });
      const goodsRows = binddingInfo.biddingGoodsVOS.map((i) => {
        const brandInfo = brandInfos.filter(
          (b) => b.brandId == i.goodsInfo.brandId
        );
        const goodsCateInfo = goodsCates.filter(
          (gc) => gc.cateId == i.goodsInfo.cateId
        );
        return {
          goodsId: i.goodsInfo.goodsId,
          brandName: brandInfo.length > 0 ? brandInfo[0].brandName : '-',
          goodsInfoNo: i.goodsInfo.goodsInfoNo,
          goodsInfoName: i.goodsInfo.goodsInfoName,
          storeName: i.goodsInfo.storeName,
          cateName: goodsCateInfo.length > 0 ? goodsCateInfo[0].cateName : '-',
          sort: i.sort,
          cateId: i.goodsInfo.cateId,
          goodsInfoId: i.goodsInfoId
        };
      });
      this.onSelect(checkIds);
      this.editFormData({ key: 'goodsInfoIds', value: checkIds });
      this.fieldsValue({ field: 'chooseSkuIds', value: checkIds });
      this.fieldsValue({ field: 'goodsRows', value: goodsRows });
    }
  };

  /**
   * 设置勾选的多个id
   */
  onSelect = (checkedIds) => {
    this.dispatch('info:setCheckedData', fromJS(checkedIds));
  };

  /**
   * 打开添加弹窗
   */
  onAdd = () => {
    this.transaction(() => {
      this.dispatch('info:setVisible', true);
      this.dispatch('info:setFormData', fromJS({}));
    });
  };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormData = (data) => {
    this.dispatch('info:editFormData', data);
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };

  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    let formData = this.state().get('formData');
    // const chooseSkuIds = this.state().get('chooseSkuIds');
    // formData.goodsInfoIds = chooseSkuIds;
    let result;
    if (formData.get('biddingId')) {
      result = await webApi.modify(formData);
    } else {
      result = await webApi.add(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.push({
        pathname: '/bidding'
      });
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = (id) => {
    this.dispatch('delete: selected: sku', id);
  };

  /**
   * 变更商品各个字段信息
   * @param field
   * @param value
   */
  onGoodsChange = ({ goodsInfoId, field, value }) => {
    this.dispatch('modalActor: change:goods', { goodsInfoId, field, value });
  };

  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('goods: info: field: value', {
      field,
      value
    });
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = (skuIds, rows) => {
    //保存商品信息
    this.dispatch('goods: info: field: value', {
      field: 'chooseSkuIds',
      value: skuIds
    });
    this.dispatch('goods: info: field: value', {
      field: 'goodsRows',
      value: rows
    });
    //关闭弹窗
    this.dispatch('goods: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('goods: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 设置排序弹框
   * @param param
   */
  sortModalFunction = (param: boolean) => {
    this.dispatch('info: setSortModalShow', param);
  };

  /**
   * 设置排序商品Id
   */
  setSortGoodsInfo = ({ key, value }) => {
    this.dispatch('info: setSortInfo', { key, value });
  };

  setIndex = (value) => {
    this.dispatch('info:index', value);
  };

  saveSortInfo = () => {
    const sortInfo = this.state().get('sortInfo');
    const originIndex = sortInfo.get('originPosition');
    const targetIndex = sortInfo.get('sort');
    let goodsRows = this.state().get('goodsRows');
    let goodsInfoList = this.reSortList(goodsRows, originIndex, targetIndex);
    let goodsInfoIds = goodsInfoList.map((g) => {
      return g.get('goodsInfoId');
    });
    this.onSelect(goodsInfoIds);
    this.fieldsValue({ field: 'chooseSkuIds', value: goodsInfoIds });
    this.fieldsValue({ field: 'goodsRows', value: goodsInfoList });
    this.editFormData({ key: 'goodsInfoIds', value: goodsInfoIds });
    this.sortModalFunction(false);
  };

  reSortList = (
    goodsRows: any,
    originPosition: number,
    targetPostion: number
  ) => {
    goodsRows = goodsRows.toJS();
    const goodsInfo = goodsRows[originPosition - 1];
    if (targetPostion < originPosition) {
      //下移
      let i = originPosition;
      for (i; i > targetPostion; --i) {
        goodsRows[i - 1] = goodsRows[i - 2];
      }
      goodsRows[targetPostion - 1] = goodsInfo;
    }

    if (targetPostion > originPosition) {
      //上移
      let j = originPosition;
      for (j; j < targetPostion; ++j) {
        goodsRows[j - 1] = goodsRows[j];
      }
      goodsRows[targetPostion - 1] = goodsInfo;
    }
    return fromJS(goodsRows);
  };
}
