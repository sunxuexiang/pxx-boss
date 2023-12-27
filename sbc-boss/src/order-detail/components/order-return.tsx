import React from 'react';
import { IMap, Relax } from 'plume2';
import { Icon, Table, message } from 'antd';
import { AuthWrapper, QMUpload, Const, noop, checkAuth } from 'qmkit';
import UpdataImg from './updataImg';
// import ReceiveAdd from './receive-add';
import { IList } from 'typings/globalType';
import moment from 'moment';
import { fill } from 'lodash';
const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};
const FILE_MAX_SIZE = 2 * 1024 * 1024;
/**
 * 订单收款记录
 */
@Relax
export default class OrderReceive extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      payReturn: IList;
      onSavePayOrder: Function;
      destroyOrder: Function;
      fetchOffLineAccounts: Function;
      addReceiverVisible: boolean;
      setReceiveVisible: Function;
      onConfirm: Function;
      onPayReturnEditImages: Function;
      onDelPayReturnEditImages: Function;
      onUploadImg: Function;
    };
  };

  /*state: {
    addReceiverVisible: boolean;
  }*/

  constructor(props) {
    super(props);
    /*this.state = {
      addReceiverVisible: false
    }*/
  }

  static relaxProps = {
    detail: 'detail',
    payReturn: 'payReturn',
    destroyOrder: noop,
    fetchOffLineAccounts: noop,
    addReceiverVisible: 'addReceiverVisible',
    setReceiveVisible: noop,
    onConfirm: noop,
    onPayReturnEditImages: noop,
    onDelPayReturnEditImages: noop,
    onUploadImg: noop
  };

  //收款列表
  receiveColumns = [
    {
      title: '退款流水号',
      dataIndex: 'payOrderNo',
      key: 'payOrderNo'
    },
    {
      title: ' 退款时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) =>
        createTime &&
        moment(createTime)
          .format(Const.TIME_FORMAT)
          .toString()
    },
    {
      title: '退款金额',
      dataIndex: 'applyPrice',
      key: 'applyPrice'
    },
    {
      title: ' 退款原因',
      dataIndex: 'refuseReason',
      key: 'refuseReason'
    },
    {
      title: '退款凭证',
      dataIndex: 'manualRefundImgVOList',
      key: 'manualRefundImgVOList',
      width: 600,
      render: (manualRefundImgVOList, row) => {
        const { onUploadImg } = this.props.relaxProps;
        return (
          <UpdataImg
            value={manualRefundImgVOList || []}
            row={row}
            onUploadImg={onUploadImg}
          />
          // <QMUpload
          //     style={styles.box}
          //     name="uploadFile"
          //     fileList={row?.manualRefundImgVOList || []}
          //     action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
          //     listType="picture-card"
          //     accept={'.jpg,.jpeg,.png,.gif'}
          //     disabled={checkAuth('fOrderDetailReturn')?false:true}
          //     onChange={(fileEntity)=>this._editImages(row,fileEntity)}
          //     beforeUpload={this._checkUploadFile}
          //   >
          //     {(row?.manualRefundImgVOList || []).length < 3 ? (
          //       <Icon type="plus" style={styles.plus} />
          //     ) : null}
          //   </QMUpload>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: (refundStatus) => {
        if (refundStatus == 2) {
          return '已完成退款';
        } else if (refundStatus == 1) {
          return '待退款';
        } else {
          return '退款失败';
        }
      }
    }
  ];

  render() {
    const { detail, payReturn } = this.props.relaxProps;
    const id = detail.get('id');
    // let payRecordList = payReturn.filter((param) => param.payOrderId != null);
    console.log('payReturn----', payReturn);

    return (
      <div style={styles.container}>
        <div>
          <Table
            columns={this.receiveColumns}
            dataSource={payReturn.toJS()}
            pagination={false}
            bordered
          />
        </div>
      </div>
    );
  }

  /**
   * 改变图片
   */
  _editImages = (row, { file, fileList }) => {
    // console.log(file, 'file');
    // console.log('-----', fileList);
    // console.log('1111', row);
    // console.log('2222', file);
    // const {onPayReturnEditImages} = this.props.relaxProps as any;
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }

    //删除图片
    if (file.status == 'removed') {
      this.props.relaxProps.onDelPayReturnEditImages(row, fileList, file);
      return;
    }

    this.props.relaxProps.onPayReturnEditImages(row, fileList, file);
    // this.onChangeForm('images', fileList);
  };

  /**
   * 检查文件格式以及文件大小
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  addReceive: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 15
  },
  orderInfo: {
    display: 'flex',
    flexGrow: 7,
    alignItems: 'center'
  },
  addReceiveButton: {
    display: 'flex',
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  orderNum: {
    fontSize: 14
  } as any,
  attachment: {
    width: 30,
    height: 30
  },
  attachmentView: {
    maxWidth: 500,
    maxHeight: 400
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
} as any;
