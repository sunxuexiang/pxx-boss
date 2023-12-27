import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop,Const } from 'qmkit';
import { IList } from 'typings/globalType';
import { Modal, Switch, Table } from 'antd';
import moment from 'moment';
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
      onPauseById:Function;
      onTerminationById:Function;
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
    onchangeStart: noop,
    onPauseById:noop,
    onTerminationById:noop,
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      startList,
      deleteCoupon,
      init,
      onPauseById,
      onTerminationById
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
        <Column  title="名称" dataIndex="hotName" key="hotName" />
        <Column  title="起止时间" dataIndex="beginTime" key="beginTime"
             render={(text, record:any) =>{
              return (
                <div>
                  <div>{moment(record.beginTime).format(Const.TIME_FORMAT).toString()}</div>
                  <div>至</div>
                  <div>{moment(record.endTime).format(Const.TIME_FORMAT).toString()}</div>
                </div>
              ) 
            }}
         />
         <Column  title="数量" dataIndex="hotStyleMomentsConfigs" key="hotStyleMomentsConfigs" 
            render={(text, record:any) =>{
              return record.hotStyleMomentsConfigs.length||0
            }}
          />
        <Column
          title="详情页banner"
          dataIndex="bannerImageUrl"
          key="bannerImageUrl"
          render={(text, record:any) =>
            record.bannerImageUrl ? (
              <img src={record.bannerImageUrl}  style={styles.imgItem} />
            ) : ('')
          }
        />
        <Column title="状态" 
        dataIndex="status"
         key="status"
         render={(text, record:any) =>{
           let list=['全部','进行中','暂停中','未开始','已结束','进行中&未开始','终止']
            return list[Number(record.status)];
          }}
          />
        <Column
          title="操作"
          key="operate"
          dataIndex="isFree"
          render={(text, record:any) => {
            return (
              <div className="operation-box">
                {record.status==3 && (
                  <Link to={`/batch-style-moment-dis/edit/${record.hotId}`}>编辑</Link>
                )}
                 {record.status==3 && (
                  <span className='sp-but mal color-red' onClick={()=>{this.onChange(record.hotId)}} >提前开始</span>
                )}
                {(record.status==1||record.status==2) && (
                  <span className='sp-but mal color-red' onClick={()=>{
                    Modal.confirm({
                      title: '温馨提示',
                      content: `此操作会将当前场次生效并应用于APP 同时将“进行中”的场次【${record.isPause?'启动':'暂停'}】，请谨慎操作！`,
                      onOk:()=>{
                        onPauseById(record.hotId,record.isPause?0:1)
                      }
                    });
                  }} >{record.isPause?'启动':'暂停'}</span>
                )}
                {record.status==1 && (
                  <span className='sp-but mal color-red' onClick={()=>{
                    Modal.confirm({
                      title: '温馨提示',
                      content: `此操作会将当前场次生效并应用于APP 同时将【终止该活动】，请谨慎操作！`,
                      onOk:()=>{
                        onTerminationById(record.hotId)
                      }
                    });
                  }} >终止</span>
                )}
                {(record.status!=1||record.status!=4) && (
                  <Link to={`/batch-style-moment-dis/dis/${record.hotId}`}>查看</Link>
                )}
                {record.status && (
                  <Link to={`/batch-style-moment-dis/copy/${record.hotId}`}>复制</Link>
                )}
                {/* <span className='sp-but mal'>复制</span> */}
                {/* <Popconfirm
                  title="确定删除该启动页？"
                  onConfirm={() => deleteCoupon((record as any).advertisingId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);">删除</a>
                </Popconfirm> */}
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
  // 状态修改
  onChange = (hotId) => {
    const { onchangeStart } = this.props.relaxProps;
    Modal.confirm({
      title: '温馨提示',
      content: '此操作会将当前场次生效并应用于APP 同时将原有“进行中”的场次自动结束，请谨慎操作！',
      onOk:()=>{
        onchangeStart(hotId);
      }
    });
  };
  FunisLink(record) {
    return `/batch-style-moment-dis/${(record as any).advertisingType}/${
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
