import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor(), new FormActor()];
  }

  //获取招商经理列表
  getManagerList = async () => {
    const { res } = await webapi.fetchManagerList();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch(
        'list:managerList',
        fromJS(res.context?.employeeList || [])
      );
    } else {
      message.error(res.message || '');
    }
  };

  //获取已签署合同列表数据
  getContractList = async (type) => {
    const contract = this.state().get(type).toJS();
    const query = this.state()
      .get(type === 'waitList' ? 'waitForm' : 'form')
      .toJS();
    const param = {
      ...query,
      pageNum: contract.currentPage - 1,
      pageSize: contract.pageSize,
      status: type === 'waitList' ? 0 : 1
    };
    param.beginTime = param.beginTime || null;
    param.endTime = param.endTime || null;
    this.dispatch('list:loading', { type, loading: true });
    const { res } = await webapi.fetchContractList(param);
    if (res && res.code === Const.SUCCESS_CODE && res.context) {
      this.dispatch('listActor:init', {
        type,
        res: res.context.pageVo
      });
    } else {
      message.error(res.message || '');
    }
    this.dispatch('list:loading', { type, loading: false });
  };

  //获取合同模板列表数据
  getTemplateList = async (isPerson) => {
    this.dispatch('list:loading', { type: 'template', loading: true });
    const { res } = await webapi.fetchTemplateList({ isPerson });
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('listActor:tempInit', {
        key: isPerson === 1 ? 'personList' : 'companyList',
        dataList: fromJS(res.context || [])
      });
      this.dispatch('list:loading', { type: 'template', loading: false });
    } else {
      message.error(res.message || '');
    }
  };

  // 页面change事件
  pageChange = ({ type, current }) => {
    this.transaction(() => {
      this.dispatch('list:currentPage', { type, current });
      this.getContractList(type);
    });
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  onWaitFormChange = ({ field, value }) => {
    this.dispatch('waitForm:field', { field, value });
  };

  togglePadMoadl = (visible) => {
    this.dispatch('list:visible', visible);
  };

  showPdf = (src, title) => {
    this.transaction(() => {
      this.dispatch('list:visible', true);
      this.dispatch('list:pdfTitle', title);
      // const res = webapi.viewPDF(src);
      // console.log(res, 'showPdf')
      if (src) {
        setTimeout(() => {
          (window as any).PDFObject.embed(src, '#pdf-view');
        }, 10);
      }
      // setTimeout(() => {
      //   (window as any).PDFObject.embed(
      //     `${Const.HOST}/fadada/viewPDF?url=${src}`,
      //     '#pdf-view'
      //   );
      // }, 10);
    });
  };

  uploadUrl = async (params) => {
    const { res } = await webapi.fadadaUpload(params);
    return res;
  };

  //修改合同模板启用状态
  changeTempSatus = async (id, isPerson) => {
    this.dispatch('list:loading', { type: 'template', loading: true });
    const { res } = await webapi.updateStatus({
      contractFlag: 1,
      contractId: id,
      isPerson
    });
    this.dispatch('list:loading', { type: 'template', loading: false });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('状态修改成功');
      this.getTemplateList(isPerson);
    } else {
      message.error(res.message || '');
    }
  };

  //删除合同模板
  delTemp = async (contractId, isPerson) => {
    const { res } = await webapi.delContract({ contractId });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.getTemplateList(isPerson);
    } else {
      message.error(res.message || '');
    }
  };

  //获取所有批发市场
  getAllMarkets = async () => {
    const { res } = await webapi.getMarketData({ pageNum: 0, pageSize: 10000 });
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('form:marketsList', fromJS(res.context?.content || []));
    } else {
      message.error(res.message || '');
    }
  };
}
