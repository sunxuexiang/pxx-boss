import { Action, Actor, IMap, Store } from 'plume2';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import { Const,history } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
// import { image } from 'html2canvas/dist/types/css/types/image';
// import { timeStamp } from 'console';
// import Item from 'antd/lib/list/Item';

export default class AppStore extends Store {
  bindActor(): Actor[] {
    return [new StartUp()];
  }
  checkTime=async()=>{

  };
  columnsBut=async()=>{
    let {formData,tiem,chooseSkuIds,goodsRows,query}=this.state().toJS();
    let m2  = moment(tiem[0]._i||tiem[0])
    let m1= moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    if(m2.diff(m1,'second')<=3000){
      message.error('开始时间不能小于当前时间且须大于当前时间一小时');
      return
    }
    let obj={
      ...formData,
      beginTime:tiem[0]._i||tiem[0],
      endTime:tiem[1]._i||tiem[1],
      hotStyleMomentsConfigs:goodsRows.map(item=>{return {goodsInfoId:item.goodsInfoId,sortNum:item.sortNum}}),
    };
    const res1:any=await webapi.momentsCheckTime({beginTime:obj.beginTime,endTime:obj.endTime,hotId:obj.hotId||null});
    if(res1.res.code!= Const.SUCCESS_CODE){
      message.error(res1.res.message);
    }else{
      const {res}:any=(!query.id||query.type=='copy')? await webapi.saveStart(obj):await webapi.advertising(obj);
      if (res.code != Const.SUCCESS_CODE) {
        message.error(res.message);
      } else {
        message.success(res.message);
        history.push({
          pathname: '/batch-style-moment'
        });
      }
    }
  }
  onAaveStart=async(obj)=>{
  };

  // 详情数据
  init = async (id=this.state().toJS().id,type=0) => {
  };
  goodsSkusBut=async(item)=>{
  }

  // 修改单个值
  onstartChange = (keys, value) => {
    this.dispatch('start-set', { keys, value });
  };
  // 修改fromData对像值
  onFormBut = (keys, value) => {
    this.dispatch('form-set', { keys, value });
  };
  stockBut=async(index,val)=>{
    let {goodsRows}=this.state().toJS();
    let list=goodsRows.map((item1,index1)=>index1==index?{...item1,sortNum:val}:item1);
    console.log(list,'list')
    this.dispatch('start-set', { keys:'goodsRows', value:fromJS(list)});
  };

 //删除选中的商品
     deleteSelectedSku = (i) => {
      let {goodsRows,chooseSkuIds}=this.state().toJS();
      goodsRows.splice(i,1);
      chooseSkuIds.splice(i,1);
      this.dispatch('start-set', { keys:'goodsRows', value:fromJS(goodsRows)});
      this.dispatch('start-set', { keys:'chooseSkuIds', value:fromJS(chooseSkuIds)});
    };

    /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
    onOkBackFun = (skuIds, rows) => {
      let list=rows.toJS().map((item,i)=>{return {...item,sortNum:0}});
      this.dispatch('start-set', { keys:'chooseSkuIds', value:fromJS(skuIds)});
      this.dispatch('start-set', { keys:'goodsRows', value:fromJS(list)});
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
      this.dispatch('start-set', { keys:'query', value:val});
      // this.cascaderBut();
      if(val.id){
        const { res }:any = await webapi.getById({hotId:val.id});
        if (res.code != Const.SUCCESS_CODE) {
          message.error(res.message);
        } else {
          // 数据处理
          let value1=res.context.hotStyleMomentsVO;
          if(val.type=='copy'){//复制数据
            delete value1['hotId'];
            delete value1['createTime'];
            delete value1['updateTime'];
          };
          this.dispatch('start-set', { keys:'formData', value:fromJS(value1)});
          console.log([moment(value1.beginTime,'YYYY-MM-DD HH:mm:ss'),moment(value1.endTime,'YYYY-MM-DD HH:mm:ss')]);
          //处理日期时间
          let times=[moment(value1.beginTime.split(".")[0]),moment(value1.endTime.split(".")[0])];
          this.dispatch('start-set', { keys:'tiem', value:fromJS(times)});
          //处理图片
          let t=value1['bannerImageUrl']?value1['bannerImageUrl'].split('/'):[];
          let imgList=[{ uid: '-1', name:t?t[t.length-1]:'xxxx', url:value1.bannerImageUrl}];
          this.dispatch('start-set', { keys:'imageList', value:fromJS(imgList)});
          //处理商品列表
          let list=value1.hotStyleMomentsConfigs.map((item,i)=>{
             let obj=res.context.goodsInfos.filter(item1=>item1.goodsInfoId==item.goodsInfoId)[0];
             return {...obj,sortNum:item.sortNum,id:item.id};
          });
          this.dispatch('start-set', { keys:'goodsRows', value:fromJS(list)});
          this.dispatch('start-set', { keys:'chooseSkuIds', value:fromJS(value1.hotStyleMomentsConfigs.map(item=>item.goodsInfoId))});
        }
      }
    };
}
class StartUp extends Actor {
  defaultState(): Object {
    return {
      query: {
        type:'',
        id:null
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      formData: {
        hotName:'',
        bannerImageUrl:'',
        beginTime:'',
        endTime:'',
        hotStyleMomentsConfigs:[]
      },
      tiem:[],
      imageList:[],
      chooseSkuIds:[],
      goodsRows:[],
      goodsModalVisible:false,
    };
  }
  @Action('start-set')
  onFormFieldChange(state: IMap, { keys, value }) {
    return state.set(keys, value);
  }

  @Action('form-set')
  onFormBut(state: IMap, { keys, value }) {
    return state.setIn(['formData', keys], value);
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
