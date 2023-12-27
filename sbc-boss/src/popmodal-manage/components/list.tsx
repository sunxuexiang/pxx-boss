import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history } from 'qmkit';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
import { Popconfirm } from 'antd';
import momnet from 'moment';

type TList = List<any>;
const { Column } = DataGrid;

/**
 * 订单收款单列表
 */
@Relax
export default class PayOrderList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      init: Function;
      deleteModal: Function;
      startPop: Function;
      pausePop: Function;
      current: number;
      fetchModlList: Function;
      prevPopupName: string;
      queryTab: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    queryTab: 'queryTab',
    prevPopupName: 'prevPopupName',
    init: noop,
    deleteModal: noop,
    startPop: noop,
    pausePop: noop,
    current: 'current',
    fetchModlList: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      queryTab,
      current,
      dataList,
      deleteModal,
      startPop,
      pausePop,
      fetchModlList,
      prevPopupName
    } = this.props.relaxProps;
    const deleteText = '确认删除？';
    const pauseText = '确认暂停？';
    const startText = '确认开始？';
    return (
      dataList && (
        <DataGrid
          loading={loading}
          rowKey="payOrderId"
          pagination={{
            pageSize,
            total,
            current: current,
            onChange: (pageNum, pageSize) => {
              fetchModlList({
                pageNum: pageNum - 1,
                pageSize,
                queryTab,
                prevPopupName
              });
            }
          }}
          dataSource={dataList}
        >
          <Column
            title="弹窗名称"
            key="popupName"
            dataIndex="popupName"
            render={(popupName) => <span>{popupName ? popupName : '-'}</span>}
          />
          <Column
            title="投放时间"
            // key="beginTime"
            // dataIndex="beginTime"
            render={(rowInfo) => (
              <span>
                {momnet(rowInfo.beginTime).format('YYYY-MM-DD HH:mm:ss')}-
                {momnet(rowInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Column
            title="仓库名称"
            key="wareName"
            dataIndex="wareName"
            render={(rowInfo) => (
              <span>
                {rowInfo}
              </span>
            )}
          />
          <Column
            title="投放页面"
            key="applicationPageName"
            dataIndex="applicationPageName"
            render={(rowInfo) => this._renderComment(rowInfo)}
          />
          <Column
            title="跳转页面"
            key="jumpPage"
            dataIndex="jumpPage"
            render={(rowInfo) => (
              <span>
                {(rowInfo &&
                  (JSON.parse(rowInfo).info.name ||
                    JSON.parse(rowInfo).info.storeName ||
                    JSON.parse(rowInfo).info.title)) ||
                  '-'}
              </span>
            )}
          />
          <Column
            title="状态"
            key="popupStatus"
            render={(rowInfo) => (
              <span>
                {rowInfo.popupStatus == 1
                  ? '进行中'
                  : rowInfo.popupStatus == 2
                  ? '暂停'
                  : rowInfo.popupStatus == 3
                  ? '未开始'
                  : rowInfo.popupStatus == 4
                  ? '已结束'
                  : ''}
              </span>
            )}
          />
          <Column
            title="操作"
            render={(rowInfo) => (
              <span className="table-operation">
                <a
                  onClick={() =>
                    history.push({
                      pathname: `/popmodal-manage-update/${rowInfo.popupId}`
                    })
                  }
                >
                  编辑
                </a>
                {rowInfo.popupStatus == 1 && (
                  <Popconfirm
                    placement="topLeft"
                    title={pauseText}
                    onConfirm={() => {
                      pausePop(rowInfo.popupId);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <a>暂停</a>
                  </Popconfirm>
                )}
                {rowInfo.popupStatus == 2 && (
                  <Popconfirm
                    placement="topLeft"
                    title={startText}
                    onConfirm={() => {
                      startPop(rowInfo.popupId);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <a>开始</a>
                  </Popconfirm>
                )}
                <Popconfirm
                  placement="topLeft"
                  title={deleteText}
                  onConfirm={() => {
                    deleteModal(rowInfo.popupId);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </DataGrid>
      )
    );
  }
  _renderComment(comment) {
    let newArry = comment.split(';').map((v) => {
      if (v == 'shoppingIndex') {
        v = '商城首页';
      }
      if (v == 'shoppingCart') {
        v = '购物车';
      }
      if (v == 'personalCenter') {
        v = '个人中心';
      }
      if (v == 'memberCenter') {
        v = '会员中心';
      }
      if (v == 'groupChannel') {
        v = '拼团频道';
      }
      if (v == 'seckillChannel') {
        v = '秒杀频道';
      }
      if (v == 'integralMall') {
        v = '积分商城';
      }
      if (v == 'securitiesCenter') {
        v = '领券中心';
      }
      return v;
    });
    return <span>{newArry.join(',')}</span>;
  }
}
