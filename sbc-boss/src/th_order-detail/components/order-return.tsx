import React from 'react';
import { IMap, Relax } from 'plume2';
import {
  Table,
} from 'antd';
import {  Const, noop } from 'qmkit';
// import ReceiveAdd from './receive-add';
import { IList } from 'typings/globalType';
import moment from 'moment';


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
    onConfirm: noop
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
      key: 'applyPrice',
    },
    {
      title: ' 退款原因',
      dataIndex: 'refuseReason',
      key: 'refuseReason',
    },
    {
      title: '状态',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: (refundStatus) => {
        if(refundStatus == 2) {
          return '已完成退款'
        }else if(refundStatus == 1) {
          return '待退款'
        }else{
          return '退款失败'
        }
      }
    },
  ];

  render() {
    const {
      // detail,
      payReturn,
      // fetchOffLineAccounts,
      // addReceiverVisible,
      // setReceiveVisible
    } = this.props.relaxProps;
    // const id = detail.get('id');
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
  }
} as any;
