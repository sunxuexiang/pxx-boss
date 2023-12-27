import { Action, Actor, IMap, Store } from 'plume2';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import { Const,history } from 'qmkit';
import { message } from 'antd';
// import { image } from 'html2canvas/dist/types/css/types/image';
// import { timeStamp } from 'console';
// import Item from 'antd/lib/list/Item';

export default class AppStore extends Store {
  bindActor(): Actor[] {
    return [new StartUp()];
  }
  // // 删除
  // deleteCoupon = async (advertisingId) => {
  //   const { res } = await webapi.DeleteStart({
  //     advertisingId
  //   });
  //   if (res.code != Const.SUCCESS_CODE) {
  //     message.error(res.message);
  //   } else {
  //     this.init();
  //   }
  // };
  cascaderBut = async () => {
    const { res }: any = await webapi.fetchCates();
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.dispatch('start-set', { keys: 'options', value: res.context });
      // this.init();
    }
  };
  bannerBut=()=>{
    let formData=this.state().toJS().formData;
    let list=formData.advertisingRetailConfigs;
    console.log(formData,'formData')
    if(!formData.advertisingRetailConfigs[0].advertisingImageUrl){
      message.error('图1图片不能为空');
      return
    }
    if(list.some(item=>item.jumpCode&&!item.advertisingImageUrl.length)){
      message.error('请填写完整的信息');
      return
    }
    let obj={...formData};
    obj.advertisingRetailConfigs=obj.advertisingRetailConfigs.filter(item=>item.advertisingImageUrl);
    this.onAaveStart(obj);
  }
  columnsBut=()=>{
    let {formData}=this.state().toJS();
    let list=formData.advertisingRetailConfigs;
    if(list.some(item=>!item.advertisingImageUrl&&!item.columnsBannerImageUrl)){
      message.error('图片不能为空');
      return
    }
    let lists=list.map((item1,i)=>{
      let t=item1.goodsRows;
      // delete item1['imageList'],item1['imageBanneList'],item1['goodsRows'],item1['chooseSkuIds'];
      item1.advertisingRetailGoodsConfigs=t.map(item=>{
        return {goodsInfoId:item.goodsInfoId,sortNum:item.sortNum,id:item.id||null}
      })
      return {...item1};
    })
    let obj={...formData,advertisingRetailConfigs:lists};
    this.onAaveStart(obj);
  }
  onAaveStart=async(obj)=>{
    let {id}=this.state().toJS();
    const { res }: any = id? await webapi.advertising(obj):await webapi.saveStart(obj);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      message.success(res.message);
      history.push({
        pathname: '/batch-advertising'
      });
    }
    
  };

  // 详情数据
  init = async (id=this.state().toJS().id,type=0) => {
    
    const { res } = await webapi.getById({advertisingId:id});
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }else{
      let list=res.context.advertisingRetailConfigs||[];
      let tt=await Promise.all( 
        list.map(async(item,i)=>{
          item.imageList=item.advertisingImageUrl?[{url:item.advertisingImageUrl,uid:'-1',status:'done',name:'222'}]:[];
          item.imageBanneList=item.columnsBannerImageUrl?[{url:item.columnsBannerImageUrl,uid:'-1',status:'done',name:'222'}]:[];
          item.selectItem={};
          item.chooseSkuIds=item.skuIds||[];
          item.goodsRows=[];
          if(type==1) {
            let res1:any=await webapi.goodsSkus({goodsInfoIds:item.skuIds,pageSize:50,pageNum:0});
            if (res1.res.code != Const.SUCCESS_CODE) {
              message.error(res.message);
            }else{
              item.goodsRows=res1.res.context['goodsInfoPage'].content||[];
              return {...item,goodsRows:item.goodsRows.map((item1,index)=>{return {...item1,...item.advertisingRetailGoodsConfigs[index]}}),chooseSkuIds:item.goodsRows.map(item=>item.goodsInfoId)}
            }
          }else{
            return item 
          }
        })
      )
      this.batchInit(res.context,tt);
    }
  };
  batchInit=(context,list)=>{
    let {formData}=this.state().toJS();
    let e=formData.advertisingRetailConfigs
    e.splice(0,list.length);
    let t=[...list,...e];
    this.transaction(()=>{
      this.dispatch('start-set', { keys:'formData', value:context });
      this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:t});
    })
  }
  goodsSkusBut=async(item)=>{
    let {res}=await webapi.goodsSkus({goodsInfoIds:item.skuIds});
    if (res.code != Const.SUCCESS_CODE) {
      return false
    } else {
      return res.context['goodsInfoPage'].content
    }    
  }

  // 修改单个值
  onFormFieldChange = (keys, value) => {
    this.dispatch('start-set', { keys, value });
  };
  // 修改fromData对像值
  onFormBut = (keys, value) => {
    this.dispatch('form-set', { keys, value });
  };
  // 修改状态
  onchangeStart = async (advertisingId, status) => {
    const { res } = await webapi.modstart({
      advertisingId,
      status
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.init();
    }
  };
  stockBut=async(index,val)=>{
    let {isType,formData}=this.state().toJS();
    let list=formData.advertisingRetailConfigs.map((item1,index1)=>
      index1==isType?{...item1,goodsRows:item1.goodsRows.map((item,i)=>index===i?{...item,sortNum:val}:item)}:item1
    );
    this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:list});
  };

    /**
 * 删除选中的商品
 */
     deleteSelectedSku = (i,isType) => {
      let {formData}=this.state().toJS();
      let list=formData.advertisingRetailConfigs.map((item1,index1)=>{
        if(index1==isType){
          item1.goodsRows.splice(i,1);
          item1.chooseSkuIds.splice(i,1);
          return item1;
        }else{
          return item1;
        }
      });
      this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:list});
    };

      /**
 * 修改商品图片
 */
  editImages = (images) => {
    console.log(images, 'imagesimages');
    this.dispatch('imageActor: editImages', images);
  };

  
    /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
    onOkBackFun = (skuIds, rows) => {
      let {isType,formData}=this.state().toJS();
      let t=rows.toJS().map((item,i)=>{
        return formData.advertisingRetailConfigs[Number(isType)].goodsRows.filter(item1=>item1.goodsInfoId==item.goodsInfoId)[0]||{...item,sortNum:0}
      })
      let list=formData.advertisingRetailConfigs.map((item1,index)=>
        index==isType?{...item1,goodsRows:t,chooseSkuIds:skuIds}:item1
      );
      this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:list});
      //关闭弹窗
      this.dispatch('start-set', {
        keys: 'goodsModalVisible',
        value: false
      });
    };

      /**
   * 选择商品弹框的关闭按钮
   */
    onCancelBackFun = () => {
      this.dispatch('start-set', {
        keys: 'goodsModalVisible',
        value: false
      });
    };

    queryBut = async (val) => {
      console.log(val)
      let formObj:any={
        advertisingConfigId: "",
          advertisingId: "",
          advertisingImageUrl: "",
          advertisingRetailGoodsConfigs: [],
          columnsBannerImageUrl: null,
          jumpCode: "",
          jumpName: "",
          jumpType: null,
          imageList:[],
          imageBanneList:[]
      }
      this.dispatch('start-set', { keys:'adTyle', value:val.adTyle });
      if(val.type==0){
        this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:[formObj,formObj,formObj] });
        this.cascaderBut();
      }
      if(val.type==1){
        formObj.chooseSkuIds=[];
        formObj.goodsRows=[];
        this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:[formObj,formObj] });
      }
      this.dispatch('form-set', { keys:'advertisingType', value:val.type });
      this.dispatch('start-set', { keys:'id', value:val.id});
      if(val.id) this.init(val.id,val.type);
    };
    configVOSBut=(isIndex,obj={})=>{
      let {formData}=this.state().toJS();
      let list=formData.advertisingRetailConfigs.map((item,i)=>i==isIndex?{...item,...obj}:item);
      console.log(list)
      this.dispatch('form-set', { keys:'advertisingRetailConfigs', value:list});
    }
}
class StartUp extends Actor {
  defaultState(): Object {
    return {
      query: {},
      id:null,
      adTyle:'',
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      couponList: [],
      formData: {
        advertisingName:'',
        advertisingRetailConfigs:[] as any,
        advertisingType:0
      },
      options: [],
      startList: fromJS([]),
      chooseSkuIds:fromJS([]),
      goodsRows:fromJS([]),
      rChooseSkuIds:fromJS([]),
      rGoodsRows:fromJS([]),
      goodsModalVisible:false,
      isType:0
    };
  }
  @Action('start-set')
  onFormFieldChange(state: IMap, { keys, value }) {
    return state.set(keys, fromJS(value));
  }

  @Action('form-set')
  onFormBut(state: IMap, { keys, value }) {
    return state.setIn(['formData', keys], value);
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
     return state.setIn(['formData', 'images'], images instanceof Array ? fromJS(images) : images);
  }

  @Action('formData-set')
  onqueryBut(state: IMap, value) {
    return state.set('formData', value);
  }

  @Action('init')
  init(state, { startList, total, pageNum }) {
    return state
      .set('startList', startList)
      .set('total', total)
      .set('pageNum', pageNum);
  }
}
