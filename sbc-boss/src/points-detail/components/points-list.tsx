import React from 'react';
import { IList } from 'typings/globalType';
import { Relax, StoreProvider } from 'plume2';
import { DataGrid, noop, Const } from 'qmkit';
import Moment from 'moment';
import AppStore from '../store';
import { Button, Icon, Popconfirm } from 'antd';
import Input from 'antd/lib/input';

const { Column } = DataGrid;
// type 0:普通方式 1:订单相关 2:退单相关
let serviceTypeName = {
  0: { desc: '签到', type: 0 },
  1: { desc: '注册', type: 0 },
  2: { desc: '分享商品', type: 0 },
  3: { desc: '分享注册', type: 0 },
  4: { desc: '分享购买', type: 0 },
  5: { desc: '评论商品', type: 0 },
  6: { desc: '晒单', type: 0 },
  7: { desc: '完善基本信息', type: 0 },
  8: { desc: '绑定微信', type: 0 },
  9: { desc: '添加收货地址', type: 0 },
  10: { desc: '关注店铺', type: 0 },
  11: { desc: '订单完成', type: 1 },
  12: { desc: '订单抵扣', type: 1 },
  13: { desc: '优惠券兑换', type: 1 },
  14: { desc: '积分兑换', type: 1 },
  15: { desc: '退单返还', type: 2 },
  16: { desc: '订单取消返还', type: 1 },
  17: { desc: '过期扣除', type: 0 },
  18: { desc: '客户导入', type: 0 },
  19: { desc: '权益发放', type: 0 },
  20: { desc: '管理员积分调整', type: 0 },
  21: { desc: '账号合并', type: 0 }
};
@Relax
export default class pointsDetailList extends React.Component<any, any> {
  store: AppStore;

  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      isEdit: boolean;
      pointsDetailList: IList;
      init: Function;
      addList: Function;
      updatePoint: Function;
      handlerChangeEdit: Function;
      handlerChangeAvailablePoints: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    pointsDetailList: 'pointsDetailList',
    init: noop,
    addList: noop,
    handlerChangeAvailablePoints: noop,
    isEdit: 'isEdit',
    updatePoint: noop,
    handlerChangeEdit: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      init,
      pointsDetailList,
      addList,
      isEdit,
      handlerChangeAvailablePoints,
      updatePoint,
      handlerChangeEdit
    } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey={(record) => record.id}
        dataSource={pointsDetailList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="交易时间"
          key="opTime"
          dataIndex="opTime"
          render={(opTime) =>
            Moment(opTime)
              .format(Const.TIME_FORMAT)
              .toString()
          }
        />
        <Column title="积分数" key="points" dataIndex="points" />
        <Column
          title="增/减"
          key="type"
          dataIndex="type"
          render={(type) => {
            if (type == 0) {
              return <span style={{ color: '#ea1a24' }}>减少</span>;
            } else if (type == 1) {
              return <span style={{ color: '#3ee209' }}>增加</span>;
            } else {
              return <span style={{ color: '#3ee209' }}>-</span>;
            }
          }}
        />
        <Column
          title="交易内容"
          key="serviceType"
          dataIndex="serviceType"
          render={(serviceType, rowInfo: any) => {
            const info = serviceTypeName[serviceType];
            if (info.type == 0) {
              return info.desc;
            } else if (info.type == 1) {
              return `${info.desc}(订单号:${
                JSON.parse(rowInfo.content).orderNo
              })`;
            } else if (info.type == 2) {
              return `${info.desc}(退单号:${
                JSON.parse(rowInfo.content).returnOrderNo
              })`;
            }
            return '';
          }}
        />
        <Column
          title="积分余额"
          key="pointsAvailable"
          dataIndex="pointsAvailable"
          editable="true"
          render={(_text, _rowData: any, index) => {
            const pointsAvailable = _rowData.pointsAvailable;
            return isEdit === false ? (
              <p style={{ fontSize: 20 }}>
                {index == 0 && pageNum == 1 ? (
                  <div>
                    {pointsAvailable}
                    <Icon type="edit" onClick={() => addList()} />
                  </div>
                ) : (
                  <p>{pointsAvailable}</p>
                )}
              </p>
            ) : (
              <p>
                {index == 0 ? (
                  <p>
                    <Input
                      defaultValue={pointsAvailable}
                      style={{ width: 108, fontSize: 20 }}
                      onChange={(e: any) => {
                        handlerChangeAvailablePoints({
                          key: 'pointsAvailable',
                          value: e.target.value
                        });
                      }}
                    />
                    <br />
                    <Popconfirm
                      title="您确定提交本次修改吗?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => {
                        updatePoint(pointsAvailable);
                      }}
                    >
                      <a href="javascript:void(0);">提交</a>
                    </Popconfirm>
                    &nbsp;&nbsp;
                    <a onClick={() => handlerChangeEdit()}>取消</a>
                  </p>
                ) : (
                  <p style={{ fontSize: 20 }}>{pointsAvailable}</p>
                )}
              </p>
            );
          }}
        />
      </DataGrid>
    );
  }
}
