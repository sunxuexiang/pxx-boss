import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm, Switch } from 'antd';
const { Column } = DataGrid;

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
    onchangeStart: noop,
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
        <Column title="名称" dataIndex="advertisingName" key="advertisingName" />
        <Column
          title="图片"
          dataIndex="imageUrl"
          key="imageUrl"
          render={(imageUrl) => {
            return imageUrl ? <img src={imageUrl} style={styles.imgItem} /> : ''
          }
          }
        />
        <Column
          title="跳转链接"
          dataIndex="mofangName"
          key="mofangName"
        />
        <Column
          title="状态"
          render={(value) => {
            if (!value.status) {
              return <Popconfirm
                title="此操作会将其他已启用的数据自动更新为禁用，请确认！"
                // onCancel={() => {
                //   if (isOnclick == 'auto') {
                //     isOnclick = 'none';
                //   }
                //   this._renderConfirmMenu(id, activityType,orderCode);
                // }}
                onConfirm={() => {
                  this.onChange(value.advertisingId, true);
                }}
                okText="确认"
                cancelText="取消"
              >
                {/* style={{pointerEvents: isdisabled}} */}
                <Switch checked={value.status ? value.status : false} />

              </Popconfirm>
            } else {
              return <Switch checked={value.status ? value.status : false} onChange={(e) => {
                this.onChange(value.advertisingId, e)
              }} />
            }
          }}
        />
        <Column
          title="操作"
          key="operate"
          dataIndex="isFree"
          render={(text, record) => {
            return (
              <div className="operation-box">

                {!(record as any).status &&
                  <Link to={this.FunisLink(record)}>
                    编辑
                  </Link>
                }

                <Popconfirm
                  title="确定删除该启动页？"
                  onConfirm={() => deleteCoupon((record as any).advertisingId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);">删除</a>
                </Popconfirm>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
  // 状态修改
  onChange = (id, e = false) => {
    const { onchangeStart } = this.props.relaxProps;
    onchangeStart(id, e ? 1 : 0);
  }
  FunisLink(record) {
    return `/start-add/${(record as any).advertisingId}`
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
  } as any,
}