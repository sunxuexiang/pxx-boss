import React from 'react';
import { IList } from 'typings/globalType';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { Icon, Popconfirm } from 'antd';
import Input from 'antd/lib/input';
const { Column } = DataGrid;
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

@Relax
export default class pointsCustomerList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      _total: number;
      _pageNum: number;
      _pageSize: number;
      isEdit: boolean; //积分编辑状态位
      customerId: null;
      customertList: IList;
      initCustomer: Function;
      handlerEdit: Function; //积分修改按钮
      handlerChangeAvailablePoints: Function; //监控积分修改
      handlerUpdatePoint: Function; //请求后端更新积分
      handlerChangeEdit: Function; //更改积分编辑状态位
    };
  };

  static relaxProps = {
    _total: '_total',
    _pageNum: '_pageNum',
    _pageSize: '_pageSize',
    customertList: 'customertList',
    isEdit: 'isEdit',
    customerId: 'customerId',
    initCustomer: noop,
    handlerEdit: noop,
    handlerChangeAvailablePoints: noop,
    handlerUpdatePoint: noop,
    handlerChangeEdit: noop
  };

  render() {
    const {
      _total,
      _pageNum,
      _pageSize,
      initCustomer,
      isEdit,
      customertList,
      handlerEdit,
      customerId,
      handlerChangeAvailablePoints,
      handlerUpdatePoint,
      handlerChangeEdit
    } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey="customerId"
        dataSource={customertList.toJS()}
        pagination={{
          current: _pageNum,
          pageSize: _pageSize,
          total: _total,
          onChange: (pageNum, pageSize) => {
            initCustomer({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="客户账号"
          key="customerAccount"
          dataIndex="customerAccount"
        />
        <Column
          title="账号状态"
          key="customerStatus"
          dataIndex="customerStatus"
          render={(customerStatus) =>
            CUSTOMER_STATUS[customerStatus]
              ? CUSTOMER_STATUS[customerStatus]
              : '-'
          }
        />
        <Column
          title="积分余额"
          key="pointsAvailable"
          dataIndex="pointsAvailable"
          render={(_text, _rowData: any, index) => {
            const pointsAvailable = _rowData.pointsAvailable;

            // alert(_rowData.customerId);
            return isEdit === false ? (
              <p style={{ fontSize: 20 }}>
                <div>
                  {pointsAvailable}
                  <Icon
                    type="edit"
                    onClick={() => {
                      handlerEdit(_rowData.customerId);
                    }}
                  />
                </div>
              </p>
            ) : (
              <p>
                {customerId === _rowData.customerId ? (
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
                    <Popconfirm
                      title="您确定提交本次修改吗"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => {
                        handlerUpdatePoint(pointsAvailable);
                      }}
                    >
                      <a href="javascript:void(0);">提交</a>
                    </Popconfirm>
                    &nbsp;&nbsp;
                    <a onClick={() => handlerChangeEdit()}>取消</a>
                  </p>
                ) : (
                  <p>
                    <p style={{ fontSize: 20 }}>{pointsAvailable}</p>
                  </p>
                )}
              </p>
            );
          }}
        />

        <Column
          title="操作"
          render={(rowInfo: any) => {
            return (
              <AuthWrapper functionName="f_customer_points_d">
                <Link to={`/points-details/${rowInfo.customerId}`}>
                  <span className="ant-dropdown-link">查看</span>
                </Link>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }
}
