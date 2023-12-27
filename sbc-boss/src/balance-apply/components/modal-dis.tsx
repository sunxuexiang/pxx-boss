import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form,Icon } from 'antd';
import { noop, Const,QMUpload } from 'qmkit';
import moment from 'moment';
import { IList } from 'typings/globalType';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
    lg: { span: 5 },
    xl: { span: 5 },
    xxl: { span: 5 }
  },
  wrapperCol: {
    sm: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 }
  }
};

@Relax
export default class ModalDis extends React.Component<any, any> {
  props: {
    relaxProps?: {
      isVisible: boolean;
      pageRow: any;
      onActorFiledChange: Function;
      receivableList: IList;
    };
  };
  static relaxProps = {
    isVisible: 'isVisible',
    pageRow: 'pageRow',
    receivableList: 'receivableList',
    onActorFiledChange: noop
  };

  render() {
    const { isVisible, pageRow, receivableList }: any = this.props.relaxProps;
    // console.log(pageRow, 'pageRowpageRowpageRow',isVisible);
    return (
      <Modal
        title="查看详情"
        visible={isVisible}
        destroyOnClose
        onOk={this.confirm}
        onCancel={this.hideModal}
        okText="确认"
        cancelText="取消"
      >
        <div>
          <Form>
            <FormItem {...formItemLayout} label="当前状态：">
              {this.extractStatus(pageRow?.get('extractStatus') || 1)}
            </FormItem>
            <FormItem {...formItemLayout} label="提现申请时间：">
              {pageRow?.get('applyTime')}
            </FormItem>
            <FormItem {...formItemLayout} label="用户账号：">
              {pageRow.get('customerWallet')?.get('customerAccount') || '无'}{' '}
              &nbsp; &nbsp;
            </FormItem>
            <FormItem {...formItemLayout} label="收款账户：">
              {pageRow?.get('bankBranch')} &nbsp;&nbsp;{' '}
              {pageRow?.get('bankName')} &nbsp;&nbsp; {pageRow?.get('bankCode')}
            </FormItem>
            <FormItem {...formItemLayout} label="提现金额：">
              {pageRow?.get('applyPrice')} &nbsp;&nbsp;&nbsp;&nbsp; 到账金额：
              {pageRow?.get('arrivalPrice') || '无'}
            </FormItem>
            <FormItem {...formItemLayout} label="转账账户：">
              {pageRow?.get('accountId')
                ? receivableList
                    .toJS()
                    .filter(
                      (item) => item.accountId == pageRow?.get('accountId')
                    )[0]?.accountName || '无'
                : '无'}
            </FormItem>
            <FormItem {...formItemLayout} label="转账日期：">
              {pageRow?.get('transferDate')
                ? moment(pageRow?.get('transferDate')).format(Const.TIME_FORMAT)
                : '无'}
            </FormItem>
            <FormItem {...formItemLayout} label="客服审核：">
              &nbsp;&nbsp; 审核人：
              {pageRow
                ?.get('customerServiceTicketsFormLogVo')
                ?.get('auditStaffName')}
              &nbsp;&nbsp; 审核时间：
              {moment(
                pageRow
                  ?.get('customerServiceTicketsFormLogVo')
                  ?.get('auditTime')
              ).format(Const.TIME_FORMAT)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {pageRow?.get('customerServiceTicketsFormLogVo')?.get('remark')}
            </FormItem>
            {pageRow?.get('financialTicketsFormLogVo') && (
              <FormItem {...formItemLayout} label="财务审核：">
                &nbsp;&nbsp; 审核人：
                {pageRow
                  ?.get('financialTicketsFormLogVo')
                  ?.get('auditStaffName')}{' '}
                &nbsp;&nbsp; 审核时间：
                {moment(
                  pageRow?.get('financialTicketsFormLogVo')?.get('auditTime')
                ).format(Const.TIME_FORMAT)}
              </FormItem>
            )}
            {pageRow?.get('financialTicketsFormLogVo') && (
              <FormItem {...formItemLayout} label="备注">
                {pageRow?.get('financialTicketsFormLogVo')?.get('remark')}
              </FormItem>
            )}
            {pageRow?.get('financialTicketsFormLogVo') && (
              <FormItem {...formItemLayout} label="打款凭证">
                <QMUpload
                  style={styles.box}
                  name="uploadFile"
                  fileList={(pageRow.get('ticketsFormPaymentVoucherImgList')?.toJS()||[]).map((item,index)=>{
                      return {
                        uid:index,
                        status: 'done',
                        name: 'image.png',
                        url:item
                      }
                  })}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  accept={'.jpg,.jpeg,.png,.gif'}
                  disabled={true}
                  // onChange={this._editImages}
                  // beforeUpload={this._checkUploadFile}
                >
                  {/* {(pageRow.get('ticketsFormPaymentVoucherImgList')?.toJS() || []).length < pageRow.get('ticketsFormPaymentVoucherImgList')?.toJS().length ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null} */}
                </QMUpload>
              </FormItem>
            )}
          </Form>
        </div>
      </Modal>
    );
  }
  extractStatus = (extractStatus) => {
    if (extractStatus == '1') {
      return '待审核';
    } else if (extractStatus == '2') {
      return '待打款';
    } else if (extractStatus == '3') {
      return '已完成';
    } else if (extractStatus == '4') {
      return '已拒绝';
    } else if (extractStatus == '5') {
      return '打款失败';
    } else if (extractStatus == '6') {
      return '用户撤回';
    }
  };
  confirm = (eve) => {
    // console.log('确定操作');
    // console.log(this.props.relaxProps.pageRow);
    this.props.relaxProps.onActorFiledChange('isVisible', false);
  };
  hideModal = (eve) => {
    this.props.relaxProps.onActorFiledChange('isVisible', false);
  };
}


const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};