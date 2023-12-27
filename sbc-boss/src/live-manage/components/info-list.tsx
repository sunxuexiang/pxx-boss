import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, AuthWrapper } from 'qmkit';
import { Popconfirm, Table, Modal } from 'antd';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';
const defaultImg = require('../img/none.png');

const confirm = Modal.confirm;
@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      // onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
      cateList: IList;
      sourceCateList: IList;
      storeList: IList;
      // onVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    storeList: 'storeList',
    // onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop
    // onVisible: noop,
  };

  render() {
    const { loading, total, pageSize, dataList, current, queryPage } =
      this.props.relaxProps;
    return (
      <Table
        rowKey="biddingId"
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
      title: '直播间图片',
      key: 'imgPath',
      dataIndex: 'imgPath',
      render: (imgPath) =>
        imgPath ? (
          <img style={styles.imgItem} src={imgPath} />
        ) : (
          <img style={styles.imgItem} src={defaultImg} />
        )
    },
    {
      key: 'liveRoomName',
      dataIndex: 'liveRoomName',
      title: '直播间名称'
    },
    {
      key: 'lastLiveTime',
      dataIndex: 'lastLiveTime',
      title: '最近直播时间'
    },
    {
      key: 'storeId',
      dataIndex: 'storeId',
      title: '所属店铺',
      render: (text) => {
        let result = '/';
        (this.props.relaxProps.storeList
          ? this.props.relaxProps.storeList.toJS()
          : []
        ).forEach((item) => {
          if (text === item.storeId) {
            result = item.storeName;
          }
        });
        return result;
      }
    },
    {
      key: 'accountMap',
      dataIndex: 'accountMap',
      title: '直播账号',
      width: 300,
      render: (rowInfo) => this._getElist(rowInfo)
    },
    {
      key: 'companyName',
      title: '厂商',
      dataIndex: 'companyName'
    },
    {
      key: 'brandMap',
      dataIndex: 'brandMap',
      title: '品牌',
      render: (rowInfo) => this._getElist(rowInfo)
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
    // console.log(rowInfo);
    return (
      <div>
        {/* <AuthWrapper functionName={'f_live_manage_edit'}>
          <a style={styles.edit} onClick={() => this._onEdit(rowInfo)}>
            编辑
          </a>
        </AuthWrapper> */}
        <AuthWrapper functionName={'f_live_manage_management'}>
          <Link
            style={styles.edit}
            to={{
              pathname: `/live-manage-list/${rowInfo.liveRoomId}`
            }}
          >
            直播间查看
          </Link>
        </AuthWrapper>
        {/* <AuthWrapper functionName={'f_live_manage_setUp'}>
          <Link style={styles.edit}
            to={{ pathname: `/live-manage-setUp/${rowInfo.liveRoomId}` }}
          >
            设置
          </Link>
        </AuthWrapper> */}
        {/* <AuthWrapper functionName={'f_live_manage_del'}> 
          <a onClick={() => this._onDelete(rowInfo.liveRoomId)}>删除</a>
        </AuthWrapper>  */}
      </div>
    );
  };
  /**
   * 编辑信息
   */
  _onEdit = (rowInfo) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(rowInfo);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确定要删除选中直播间吗?',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
  /**
   * 启用/禁用
   */
  _onVisible = (item) => {
    // const { onVisible } = this.props.relaxProps;
    // onVisible(item);
  };
  _getElist = (item) => {
    if (item) {
      let o = '';
      let e = [];
      for (let key in item) {
        // o += item[key];
        e.push(item[key]);
      }
      o = e.join(',');
      return o || '/';
    } else {
      return '/';
    }
  };
}

const styles = {
  imgItem: {
    width: 48,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  edit: {
    paddingRight: 10
  }
};
