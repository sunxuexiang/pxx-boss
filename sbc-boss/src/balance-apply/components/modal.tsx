import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form,Alert} from 'antd';
import { noop,ExportModal } from 'qmkit';
import { IList } from 'typings/globalType';
import { IMap } from 'plume2/es5/typings';
// import { fromJS } from 'immutable';
import ModalDis from './modal-dis';
import ModalService from './modal-service';
import ModalFinancial from './modal-financial';
import { WrappedFormUtils } from 'antd/lib/form/Form';


const ModalServiceForm = Form.create({})(ModalService);
const ModalFinancialForm = Form.create({})(ModalFinancial);

@Relax
export default class BalanceModal extends React.Component<any, any> {
  _form?:any;
  _formFinancial?:any;
  props: {
    relaxProps?: {
      isFinancialVisible: boolean;
      // pageRow: any;
      financialVisibleBut: Function;
      onActorFiledChange:Function;
      receivableList:IList;
      forms:IMap;
      isServiceVisible:boolean;
      serviceVisibleBut:Function;
      exportModalData:any;
      onExportModalHide:Function;
      confirmLoading: boolean;
      setButtonLoading: Function;
    };
  };
  static relaxProps = {
    isFinancialVisible: 'isFinancialVisible',
    exportModalData: 'exportModalData',
    forms:'forms',
    receivableList:'receivableList',
    financialVisibleBut: noop,
    onActorFiledChange:noop,
    isServiceVisible:'isServiceVisible',
    serviceVisibleBut:noop,
    onExportModalHide:noop,
    confirmLoading: 'confirmLoading',
    setButtonLoading: noop,
  };

  render() {
    const { isServiceVisible,serviceVisibleBut,onActorFiledChange,exportModalData,onExportModalHide,confirmLoading,setButtonLoading,
      isFinancialVisible,financialVisibleBut} = this.props.relaxProps;
   
    return (
    <div>
      {/* 详情 */}
        <ModalDis />
        {/* 客服审核 */}
        <Modal
          title="客服审核"
          visible={isServiceVisible}
          destroyOnClose
          onOk={(e)=>{
            // e.preventDefault();
            const form = this._form as WrappedFormUtils;
            form.validateFields(null,(err, values) => {
              if (!err) {
                serviceVisibleBut();
              }
            });
          }}
          onCancel={()=>{
            setButtonLoading(false)
            onActorFiledChange('isServiceVisible',false);
          }}
          okText="确认"
          cancelText="取消"
        >
        <Alert
            message=""
            description={
            <div>
                <p>  请先确认用户提现金额和用户收款账户。 </p>
                <p> 点击保存后，流程将流转至财务确认金额打款至客户账户。</p>
                <p>如果不通过审核或者有特殊原因请进行备注。 </p>
            </div>
            }
            type="info"
          />
          <div style={{marginBottom:'20px'}}></div>
          <ModalServiceForm ref={(form) => (this._form = form)} />
        </Modal>
          {/* 财务审核   */}
        <Modal
          title="财务审核"
          visible={isFinancialVisible}
          confirmLoading={confirmLoading}
          destroyOnClose
          onOk={(e)=>{
            const form1 = this._formFinancial as WrappedFormUtils;
            setButtonLoading(true)
            form1.validateFields(null,(err, values) => {
              console.log(values);
              if (!err) {
                financialVisibleBut();
              }
            });
          }}
          onCancel={()=>{
            onActorFiledChange('isFinancialVisible',false);
          }}
          okText="确认"
          cancelText="取消"
        >
        <Alert  message=""
            description={
              <div> 请先确认已经线下打款成功后再保存审核记录</div>
            } type="info" />
          <div style={{marginBottom:'20px'}}></div>
          <ModalFinancialForm ref={(form) => (this._formFinancial = form)} />
        </Modal>
        {/* 导出     */}
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          handleByAll={exportModalData.get('exportByAll')}
        />
    </div>
    );
  }

}
