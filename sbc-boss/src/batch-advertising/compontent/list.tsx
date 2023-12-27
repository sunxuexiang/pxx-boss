import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm, Switch, Table } from 'antd';
const Column = Table.Column;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      startList: IList;
      deleteCoupon: Function;
      init: Function;
      copyCoupon: Function;
      onchangeStart: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    startList: 'startList',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop,
    onchangeStart: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      startList,
      deleteCoupon,
      init,
      copyCoupon
    } = this.props.relaxProps;
    console.log(startList.toJS(), 'startListstartList');

    return (
      <DataGrid
        rowKey={(record) => record.advertisingId}
        dataSource={startList.toJS()}
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
          title="图片"
          dataIndex="advertisingImageUrl"
          key="advertisingImageUrl"
          render={(text, record:any,index) =>
            record.advertisingRetailConfigs.map((item, i) => {
              return item.advertisingImageUrl ? (
                <img src={item.advertisingImageUrl} key={i} style={styles.imgItem} />
              ) : (
                ''
              );
            })
          }
        />
        <Column
          title="名称" dataIndex="advertisingName" key="advertisingName"
        />
        <Column title="类型" 
        dataIndex="mofangName"
         key="mofangName"
         render={(text, record:any,index) =>{
            return !record.advertisingType?'通栏':'分栏'
          }}
          />

        <Column
          title="状态"
          render={(text,value:any) => {
            if (!value.status) {
              return (
                <Popconfirm
                  title="该类型下存在已启用的广告，启用该条广告后，原来已启用的广告将会自动关闭"
                  onConfirm={() => {
                    this.onChange(value.advertisingId, true,value.advertisingType);
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <Switch checked={value.status ? true : false} />
                </Popconfirm>
              );
            } else {
              return (
                <Switch
                  checked={value.status ? true : false}
                  onChange={(e) => {
                    this.onChange(value.advertisingId, e,value.advertisingType);
                  }}
                />
              );
            }
          }}
        />
        <Column title="创建时间" dataIndex="createTime" key="createTime" />
        <Column
          title="操作"
          key="operate"
          dataIndex="isFree"
          render={(text, record) => {
            return (
              <div className="operation-box">
                {!(record as any).status && (
                  <Link to={this.FunisLink(record,'edit')}>编辑</Link>
                )}
                {(record as any).status!=0?(
                  <Link to={this.FunisLink(record,'dis')}>查看</Link>
                ):''}
                {!(record as any).status&&<Popconfirm
                  title="删除后不可恢复，请确认"
                  onConfirm={() => deleteCoupon((record as any).advertisingId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);">删除</a>
                </Popconfirm>}
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
  // 状态修改
  onChange = (id, e = false,type) => {
    const { onchangeStart } = this.props.relaxProps;
    onchangeStart(id, e ? 1 : 0,type);
  };
  FunisLink(record,type) {
    return `/batch-advertising-dis/${type}/${(record as any).advertisingType}/${
      (record as any).advertisingId
    }`;
  }
}
const styles = {
  imgItem: {
    width: '90px',
    height: '80px',
    padding: ' 5px',
    border: '1px solid #ddd',
    float: 'left',
    marginRight: '10px',
    background: '#fff',
    borderRadius: '3px'
  } as any
};
