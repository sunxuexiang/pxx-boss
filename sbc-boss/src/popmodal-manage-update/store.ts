import { Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import momnet from 'moment';
import { ValidConst, history } from 'qmkit';
import EditActor from './actor/edit-actor';
import { message } from 'antd';
export default class AppStore extends Store {
  bindActor() {
    return [new EditActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }
  onWareHousePage = async () => {
    let { res }: any = await webapi.wareHousePage({
      pageNum: 0,
      pageSize: 10000,
      defaultFlag:1
    });
    if (res.code === 'K-000000') {
      this.dispatch('start-from', {
        key: 'warehouseList',
        value: fromJS(res.context?.wareHouseVOPage?.content || [])
      });
    } else {
      message.error(res.message);
    }
  };

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (param?) => {
    const res: any = await webapi.fetchModalDetail({ popupId: param });
    this.dispatch('changeInfo:setInfo', res.res.context.popupAdministrationVO);
    // console.log('params', param);
    this.dispatch('changeInfo:setId', param);
  };

  submit = async (value) => {
    const query = this.state();
    let popupUrl = '';
    if (query.toJS().images.length > 0) {
      popupUrl = query.get('images')[0].response[0];
    }
    let radioKey = query.get('radioKey');
    let radioTimes = query.get('radioTimes');
    let wareId = query.get('wareId');
    let launchFrequency = '';
    if (radioKey == 1) {
      // console.log(ValidConst.numbezz.test(radioTimes));
      if (!ValidConst.numbezz.test(radioTimes))
        return message.error('弹出频次需输入大于0的整数！');
      launchFrequency = `${radioKey},${radioTimes}`;
    } else {
      launchFrequency = `${radioKey}`;
    }
    let params = {
      ...query.toJS(),
      popupUrl,
      launchFrequency
    };
    if (query.toJS().applicationPageName.length == 0)
      return message.error('请选择应用界面！');
    if (query.toJS().beginTime == '' || query.toJS().endTime == '')
      return message.error('请选择投放时间！');
    if (momnet(query.toJS().beginTime).isBefore(new Date()))
      return message.error('开始时间不得早于当前时间');
    if (query.toJS().popupName == '') return message.error('请填写弹窗名称！');
    if (popupUrl == '') return message.error('请选择背景图片！');
    if (launchFrequency == '') return message.error('请选择弹出频次！');
    if (!wareId) return message.error('请选择仓库！');
    const res = (await webapi.updateModal(params)) as any;
    if (res.res.code == 'K-000000') {
      message.success('修改成功！');
      history.push('/popmodal-manage');
    } else {
      message.error('修改失败');
    }
  };
  onChangeRadio = (index: number) => {
    this.dispatch('changeInfo:radioKey', index);
  };
  onChangeJumpPage = (index: any) => {
    // console.log(index);
    this.dispatch('changeInfo:JumpPage', JSON.stringify(index));
  };
  onChange = (key, value) => {
    this.dispatch('start-from', { key, value });
  };
  onChangePopupName = (index: any) => {
    // console.log(index);
    this.dispatch('changeInfo:popupName', index);
  };
  onChangeTimes = (index: number) => {
    this.dispatch('changeInfo:times', index);
  };
  //上传图片
  onChangeFile = (index: any) => {
    // console.log('index', index);
    this.dispatch('changeInfo:images', index);
  };
  //选择应用页面
  onChangeCheckBox = (index: any) => {
    // console.log(index);
    this.dispatch('changeInfo:applicationPageName', index);
  };
  //选择投放时间
  onChangeDate = (index: any) => {
    let beginTime = index[0]
      ? momnet(index[0]._d).format('YYYY-MM-DD HH:mm:ss')
      : '';
    let endTime = index[1]
      ? momnet(index[1]._d).format('YYYY-MM-DD HH:mm:ss')
      : '';
    // console.log('beginTime', beginTime);
    this.dispatch('changeInfo:changeTime', { beginTime, endTime });
  };
  //修改是否全屏展示
  changeIsFull = (index: number) => {
    // console.log(index);
    this.dispatch('changeInfo:isFull', index);
  };
}
