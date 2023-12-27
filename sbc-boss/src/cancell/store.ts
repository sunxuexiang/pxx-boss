import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const } from 'qmkit';
import SettingActor from './actor/setting-actor';
import ModalActor from './actor/modal-actor';
import {
  getImgCates,
  fetchImages,
  fetchPrivacyPolicyConfig,
  setPrivacyPolicyConfig
} from './webapi';
import PicActor from './actor/pic-actor';
import { IList } from '../../typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor(), new ModalActor(), new PicActor()];
  }

  init = async () => {
    const { res } = (await fetchPrivacyPolicyConfig()) as any;
    const { code, context } = res;
    if (code === Const.SUCCESS_CODE) {
      this.dispatch('ModalActor: privacyPolicyPop', context.cancellationPolicyPop);
      this.dispatch('ModalActor: privacyPolicy', context.cancellationPolicy);
      this.dispatch('FormActor: privacyPolicyId', context.cancellationPolicyId);
    } else {
      message.error(res.message);
    }
  };

  refDetailEditor = (businessEditor) => {
    this.dispatch('FormActor: businessEditor', businessEditor);
  };

  /**
   * 注销政策弹窗富文本编辑器
   */
  refSupDetailEditor = (supplierEditor) => {
    this.dispatch('FormActor: supplierEditor', supplierEditor);
  };

  /**
   * 注销政策富文本编辑器
   */
  refSupRegisterEditor = (registerSupEditor) => {
    this.dispatch('ModalActor: registerSupEditor', registerSupEditor);
  };

  /**
   * 新增或编辑
   */
  onSubmit = async (maximumWord) => {
    let data = this.state();
    let privacyPolicyId = data.get('privacyPolicyId');

    //自定义区
    const privacyPolicyPopEditor = data.get('supplierEditor');
    const privacyPolicyEditor = data.get('registerSupEditor');
    let privacyPolicyPop = privacyPolicyPopEditor.getContent
      ? privacyPolicyPopEditor.getContent()
      : '';
    let privacyPolicy = privacyPolicyEditor.getContent
      ? privacyPolicyEditor.getContent()
      : '';
    // 正则过滤标签字符
    const reg = /<[^>]+>/gi;
    if (
      (privacyPolicyPop.length > 0 &&
        privacyPolicyPop.replace(reg, '').length > maximumWord) ||
      (privacyPolicy.length > 0 &&
        privacyPolicy.replace(reg, '').length > maximumWord)
    ) {
      message.success('仅限0-50000位字符');
      return;
    }
    let param = {
      cancellationPolicyId: privacyPolicyId,
      cancellationPolicyPop: privacyPolicyPop,
      cancellationPolicy: privacyPolicy
    };
    let result = await setPrivacyPolicyConfig(param);
    let { res } = result as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
      this.init();
    } else if (res.code == 'K-999998') {
      message.error('您没有该权限，如需修改请联系管理员!');
    } else {
      message.error('保存失败');
    }
    this.init();
  };

  openModal = (title) => {
    let data = this.state();
    this.setModalTitle(title);
    this.setModalVisible(true);
    const businessEditor = data.get('businessEditor');
    let busseditor = businessEditor.getContent
      ? businessEditor.getContent()
      : '';
    this.dispatch('FormActor: businessContent', busseditor);
  };

  setModalTitle = (title: string) => {
    this.dispatch('ModalActor: modalTitle', title);
  };

  setModalVisible = (visible: boolean) => {
    this.dispatch('ModalActor: modalVisible', visible);
  };

  /**
   * 初始化
   */
  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchImages({
      pageNum,
      pageSize: 15,
      resourceName: this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseImgs',
            fromJS(imageList.res.context)
              .get('content')
              .slice(0, successCount)
          );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1 }));
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      cateIdList.push(cateId);
      const secondCateList = cateListIm.filter(
        (item) => item.get('cateParentId') == cateId
      ); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(
          secondCateList.map((item) => item.get('cateId')).toJS()
        );
        const thirdCateList = cateListIm.filter(
          (item) =>
            secondCateList.filter(
              (sec) => item.get('cateParentId') == sec.get('cateId')
            ).size > 0
        ); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(
            thirdCateList.map((item) => item.get('cateId')).toJS()
          );
        }
      }
    }
    return cateIdList;
  };

  editCateId = async (value: string) => {
    this.dispatch('modal: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('modal: cateIds', List.of(value));
  };

  setVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  search = async (imageName: string) => {
    this.dispatch('modal: search', imageName);
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 点击图片
   * @param {any} check
   * @param {any} img
   */
  chooseImg = ({ check, img, chooseCount }) => {
    this.dispatch('modal: chooseImg', { check, img, chooseCount });
  };

  /**
   * 确定选择以上图片
   */
  beSureImages = (editor) => {
    const chooseImgs = this.state().get('chooseImgs');
    const imgType = this.state().get('imgType');
    if (imgType === 0) {
      let images = this.state().get('images');
      images = images.concat(chooseImgs);
      this.dispatch('imageActor: editImages', images);
    } else if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else {
      if (editor == 'business') {
        this.state()
          .get('businessEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'registerEditor') {
        this.state()
          .get('registerEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'enterEditor') {
        this.state()
          .get('enterEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'supplier') {
        this.state()
          .get('supplierEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'registerSupEditor') {
        this.state()
          .get('registerSupEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'enterSupEditor') {
        this.state()
          .get('enterSupEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
    }
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  editEditor = (editor) => {
    this.dispatch('modal: editor', editor);
  };

  changeTab = (key) => {
    this.dispatch('setting: changeTab', key);
  };
}
