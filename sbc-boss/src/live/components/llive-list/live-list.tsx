import React from 'react';
import { Relax } from 'plume2';
import { noop, history, Const } from 'qmkit';
import { Table, Switch } from 'antd';
import { IList } from 'typings/globalType';
import Moment from 'moment';

const styles = {
  edit: {
    paddingRight: 10
  },
  liveGoods: {
    width: 40,
    height: 40,
    marginLeft: 5
  }
} as any;

@Relax
export default class LiveList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number; //当前页
      storeName: IList; //所属店铺列表
      liveListGoodsDataList: IList; //直播商品列表
      queryPage: Function; //分页查数据
      changeRecommend: Function; //改变推荐状态
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    storeName: 'storeName',
    liveListGoodsDataList: 'liveListGoodsDataList',
    queryPage: noop,
    changeRecommend: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '直播标题',
      render: (rowInfo) => {
        return <div>{rowInfo ? rowInfo : '-'}</div>;
      }
    },
    {
      key: 'startTime',
      dataIndex: 'startTime',
      title: '直播时间',
      render: (time, rowInfo) => {
        return (
          <div>
            <div>
              {Moment(time)
                .format(Const.TIME_FORMAT)
                .toString() + '~'}
            </div>
            <div>
              {Moment(rowInfo.endTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </div>
          </div>
        );
      }
    },
    {
      key: 'anchorName',
      dataIndex: 'anchorName',
      title: '主播昵称',
      render: (rowInfo) => {
        return <div>{rowInfo ? rowInfo : '-'}</div>;
      }
    },
    {
      key: 'store',
      dataIndex: 'store',
      title: '所属店铺',
      render: (_row, rowInfo) => {
        const { storeName } = this.props.relaxProps;
        const name = storeName[rowInfo.storeId];
        return <div>{name ? name : '-'}</div>;
      }
    },
    {
      key: 'liveGoods',
      dataIndex: 'liveGoods',
      title: '直播商品',
      render: (_row, rowInfo) => {
        const { liveListGoodsDataList } = this.props.relaxProps;
        const data = liveListGoodsDataList.toJS()[rowInfo.roomId].slice(0, 5);
        return (
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            {data.length > 0
              ? data.map((item) => {
                  return (
                    <img src={item.coverImgUrl} style={styles.liveGoods} />
                  );
                })
              : '-'}
          </div>
        );
      }
    },
    {
      key: 'liveStatus',
      dataIndex: 'liveStatus',
      title: '直播状态', // 0: 直播中, 3: 未开始, 4: 已结束, 5: 禁播, 1: 暂停中, 2: 异常, 6: 已过期
      render: (status) => {
        let liveStatus = '-';
        switch (status) {
          case 0:
            liveStatus = '直播中';
            break;
          case 1:
            liveStatus = '暂停中';
            break;
          case 2:
            liveStatus = '异常';
            break;
          case 3:
            liveStatus = '未开始';
            break;
          case 4:
            liveStatus = '已结束';
            break;
          case 5:
            liveStatus = '禁播';
            break;
          case 6:
            liveStatus = '已过期';
            break;
          default:
            break;
        }

        return liveStatus;
      }
    },
    {
      key: 'recommend',
      dataIndex: 'recommend',
      title: '推荐',
      render: (recommend, rowInfo) => {
        return (
          <div>
            <Switch
              checked={recommend}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={(e) =>
                this.props.relaxProps.changeRecommend(
                  e.valueOf(),
                  rowInfo.roomId
                )
              }
            />
          </div>
        );
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        {/*<AuthWrapper functionName={'f_xxx'}>*/}
        <a
          style={styles.edit}
          onClick={() =>
            history.push({ pathname: `/live-detail/${rowInfo.id}` })
          }
        >
          查看
        </a>
        {/*</AuthWrapper>*/}
      </div>
    );
  };
}
