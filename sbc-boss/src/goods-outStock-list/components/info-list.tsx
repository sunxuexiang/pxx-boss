import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, AuthWrapper } from 'qmkit';
import { Popconfirm, Table, Avatar } from 'antd';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { IList, IMap } from 'typings/globalType';

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
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
      cateList: IList;
      sourceCateList: IList;
      searchData: IMap;
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
    searchData: 'searchData',
    onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage,
      checkedIds,
      onSelect,
      searchData
    } = this.props.relaxProps;
    const replenishmentFlag = searchData.get('replenishmentFlag') || '';
    return (
      <Table
        rowKey="stockoutId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={replenishmentFlag == '1' ? this._columnsFill : this._columns}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds.toJS(),
          onChange: (checkedRowKeys) => {
            onSelect(checkedRowKeys);
          }
        }}
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
      title: '图片',
      key: 'goodsInfoImg',
      dataIndex: 'goodsInfoImg',
      render: (_text, _rowData: any, index) => {
        return _text ? (
          <Avatar
            style={{ lineHeight: 0 }}
            src={_text}
            shape="square"
            size={64}
          />
        ) : (
          '暂无图片'
        );
      },
      width: 80
    },
    {
      title: '商品名称',
      key: 'goodsName',
      dataIndex: 'goodsName',
      width: 140
    },
    {
      title: 'ERP编码',
      key: 'erpGoodsInfoNo',
      dataIndex: 'erpGoodsInfoNo',
      width: 110
    },
    {
      title: '商品品类',
      key: 'cateName',
      dataIndex: 'cateName',
      width: 100,
      render: (_text, _rowData: any) => {
        return _text;
      }
    },
    {
      title: '销售类型',
      key: 'salesType',
      dataIndex: 'salesType',
      width: 100,
      render: (_text, _rowData: any, index) => {
        return _text == 1 ? '零售' : '批发';
      }
    },
    {
      title: '品牌',
      key: 'brandName',
      dataIndex: 'brandName',
      width: 100,
      render: (_text, _rowData: any, index) => {
        return _text;
      }
    },
    {
      title: '所属仓库',
      key: 'wareName',
      dataIndex: 'wareName',
      width: 100,
      render: (_text, _rowData: any, index) => {
        return _text;
      }
    },
    {
      title: '上架状态',
      key: 'addedFlag',
      dataIndex: 'addedFlag',
      width: 90,
      render: (_text, _rowData: any, index) => {
        return _text == 1 ? '上架' : '下架';
      }
    },
    {
      title: '缺货日期',
      key: 'stockoutTime',
      dataIndex: 'stockoutTime',
      width: 100,
      render: (_text) => {
        return _text ? Moment(_text).format('YYYY-MM-DD').toString() : '';
      }
    },
    {
      title: '缺货天数',
      key: 'stockoutDay',
      dataIndex: 'stockoutDay',
      width: 90,
      color: 'red',
      render: (_text) => {
        return <a href="javascript:void(0);">{_text}天</a>;
      }
    }
  ];

  _columnsFill = [
    {
      title: '图片',
      key: 'goodsInfoImg',
      dataIndex: 'goodsInfoImg',
      render: (_text, _rowData: any, index) => {
        return _text ? (
          <Avatar
            style={{ lineHeight: 0 }}
            src={_text}
            shape="square"
            size={64}
          />
        ) : (
          '暂无图片'
        );
      },
      width: 80
    },
    {
      title: '商品名称',
      key: 'goodsName',
      dataIndex: 'goodsName',
      width: 140
    },
    {
      title: 'ERP编码',
      key: 'erpGoodsInfoNo',
      dataIndex: 'erpGoodsInfoNo',
      width: 110
    },
    {
      title: '商品品类',
      key: 'cateName',
      dataIndex: 'cateName',
      width: 100,
      render: (_text, _rowData: any) => {
        return _text;
      }
    },
    {
      title: '销售类型',
      key: 'salesType',
      dataIndex: 'salesType',
      width: 100,
      render: (_text, _rowData: any, index) => {
        return _text == 1 ? '零售' : '批发';
      }
    },
    {
      title: '品牌',
      key: 'brandName',
      dataIndex: 'brandName',
      width: 100,
      render: (_text, _rowData: any, index) => {
        return _text;
      }
    },
    {
      title: '所属仓库',
      key: 'wareName',
      dataIndex: 'wareName',
      width: 100,
      render: (_text, _rowData: any, index) => {
        return _text;
      }
    },
    {
      title: '上架状态',
      key: 'addedFlag',
      dataIndex: 'addedFlag',
      width: 90,
      render: (_text, _rowData: any, index) => {
        return _text == 1 ? '上架' : '下架';
      }
    },
    {
      title: '缺货日期',
      key: 'stockoutTime',
      dataIndex: 'stockoutTime',
      width: 100,
      render: (_text) => {
        return _text ? Moment(_text).format('YYYY-MM-DD').toString() : '';
      }
    },
    {
      title: '补货日期',
      key: 'replenishmentTime',
      dataIndex: 'replenishmentTime',
      width: 100,
      render: (_text) => {
        return _text ? Moment(_text).format('YYYY-MM-DD ').toString() : '';
      }
    },
    {
      title: '缺货天数',
      key: 'stockoutDay',
      dataIndex: 'stockoutDay',
      width: 90
    }
  ];

  /**
   * 获取操作项
   */
  // _getOption = (rowInfo) => {
  //   const { onDelete } = this.props.relaxProps;
  //   return (
  //     <div>
  //       <AuthWrapper functionName={'f_bidding_delete'}>
  //         {rowInfo.biddingStatus == 0 && (
  //           <Popconfirm
  //             title="确定删除该活动？"
  //             onConfirm={() => onDelete(rowInfo.biddingId)}
  //             okText="确定"
  //             cancelText="取消"
  //           >
  //             <a href="javascript:void(0);">删除</a>
  //           </Popconfirm>
  //         )}
  //         &nbsp;&nbsp;&nbsp;&nbsp;
  //       </AuthWrapper>
  //       <AuthWrapper functionName={'f_bidding_edit'}>
  //         {!rowInfo.biddingStatus && (
  //           <Link
  //             to={{
  //               pathname: `/bidding-add/${rowInfo.biddingId}`,
  //               state: { biddingType: rowInfo.biddingType }
  //             }}
  //           >
  //             编辑
  //           </Link>
  //         )}
  //         &nbsp;&nbsp;&nbsp;&nbsp;
  //       </AuthWrapper>
  //       <AuthWrapper functionName={'f_bidding_find'}>
  //         <Link
  //           to={{
  //             pathname: `/bidding-detail/${rowInfo.biddingId}`,
  //             state: { biddingType: rowInfo.biddingType }
  //           }}
  //         >
  //           查看
  //         </Link>
  //       </AuthWrapper>
  //     </div>
  //   );
  // };
}

const Styles = {
  text: {
    width: 300,
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
