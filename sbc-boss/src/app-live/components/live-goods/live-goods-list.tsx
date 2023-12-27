import React from 'react';
import { Relax } from 'plume2';
import { noop, DataGrid, history, AuthWrapper } from 'qmkit';
import { Modal, Form, Input, Table, Popconfirm } from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import FormItem from 'antd/lib/form/FormItem';
const defaultImg = require('../../../images/none.png');
const downloadImg = require('../../../images/download.png');
import './live-goods-list.less';

const confirm = Modal.confirm;
const { Column } = Table;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              { required: true, message: '请输入驳回原因' },
              { validator: this.checkComment }
            ]
          })(
            <Input.TextArea
              placeholder="请输入驳回原因"
              autosize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('备注请填写小于100字符'));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create({})(RejectForm);

@Relax
export default class InfoList extends React.Component<any, any> {
  _rejectForm;
  props: {
    relaxProps?: {
      LiveGoodsTotal: number;
      LiveGoodsPageSize: number;
      LiveGoodsDataList: IList;
      LiveGoodsCurrent: number;
      goodsId: string;
      queryLiveGoodsPage: Function;
      onLiveStreamSendMessage: Function;
      onDelGoods: Function;
      onCancelLiveStreamSendMessage: Function;
    };
  };

  static relaxProps = {
    LiveGoodsTotal: 'LiveGoodsTotal',
    LiveGoodsPageSize: 'LiveGoodsPageSize',
    LiveGoodsDataList: 'LiveGoodsDataList',
    LiveGoodsCurrent: 'LiveGoodsCurrent',
    orderRejectModalVisible: 'orderRejectModalVisible',
    goodsId: 'goodsId',
    queryLiveGoodsPage: noop,
    onLiveStreamSendMessage: noop,
    onDelGoods: noop,
    onCancelLiveStreamSendMessage: noop
  };

  render() {
    const {
      LiveGoodsTotal,
      LiveGoodsPageSize,
      LiveGoodsDataList,
      LiveGoodsCurrent,
      queryLiveGoodsPage,

      onLiveStreamSendMessage,
      onDelGoods,
      onCancelLiveStreamSendMessage
    } = this.props.relaxProps;

    return (
      <TableBox>
        <DataGrid
          dataSource={LiveGoodsDataList.toJS()}
          rowKey={(e) => e.goodsInfo.goodsInfoId}
          // expandedRowRender={this._expandedRowRender}
          pagination={{
            total: LiveGoodsTotal,
            pageSize: LiveGoodsPageSize,
            current: LiveGoodsCurrent,
            onChange: (pageNum, pageSize) => {
              queryLiveGoodsPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column
            key="goodsImg"
            dataIndex="goods.goodsImg"
            title="商品图片"
            render={(_row) => {
              return _row ? <img src={_row} style={styles.imgItem} /> : null;
            }}
          />
          <Column
            key="goodsName"
            dataIndex="goods.goodsName"
            title="商品名称"
          />
          <Column
            key="goodsType"
            dataIndex="goods.goodsType"
            title="商品类型"
            render={(_row) => {
              if (_row == 2) {
                return '特价商品';
              } else {
                return '普通商品';
              }
            }}
          />
          <Column
            title="ERP编码"
            dataIndex="goodsInfo.erpGoodsInfoNo"
            key="erpGoodsInfoNo"
            width="15%"
          />
          <Column
            key="goodsInfoNo"
            dataIndex="goodsInfo.goodsInfoNo"
            title="SKU编码"
          />
          <Column
            key="marketPrice"
            dataIndex="goodsInfo.marketPrice"
            title="门店价"
          />
          <Column
            key="vipPrice"
            dataIndex="goodsInfo.vipPrice"
            title="大客户价"
          />
          <Column key="stock" dataIndex="goodsInfo.stock" title="库存" />
          <Column
            key="goodsWareStocks"
            dataIndex="goodsInfo.goodsWareStocks"
            title="所属仓库"
            render={(_row) => {
              if (_row.length) {
                return _row[0].wareName;
              }
            }}
          />
          <Column
            key="addedFlag"
            dataIndex="goodsInfo.addedFlag"
            title="上/下架状态"
            render={(_row) => {
              return _row == 1 ? '上架' : '下架';
            }}
          />
          <Column
            title="操作"
            dataIndex="option"
            key="option"
            render={(_row, rowInfo: any) => {
              return (
                <div>
                  <AuthWrapper functionName="f_app_live_goods_push1">
                    {rowInfo.goodsInfo.explainFlag ? (
                      <a
                        href="javascript:void(0);"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          onCancelLiveStreamSendMessage(
                            rowInfo.goodsInfo.goodsInfoId
                          );
                        }}
                      >
                        取消推送
                      </a>
                    ) : (
                      <a
                        href="javascript:void(0);"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          onLiveStreamSendMessage(
                            1,
                            rowInfo.goodsInfo.goodsInfoId
                          );
                        }}
                      >
                        推送
                      </a>
                    )}
                  </AuthWrapper>
                  {!rowInfo.goodsInfo.explainFlag ? (
                    <AuthWrapper functionName="f_app_live_goods_del1">
                      <Popconfirm
                        title="移除后该商品不参与直播，是否确认该操作"
                        onConfirm={() => {
                          onDelGoods(rowInfo.goodsInfo.goodsInfoId);
                        }}
                        onCancel={() => {}}
                        okText="确定"
                        cancelText="取消"
                      >
                        <a href="javascript:void(0);">移除</a>
                      </Popconfirm>
                    </AuthWrapper>
                  ) : null}
                </div>
              );
            }}
          />
        </DataGrid>
      </TableBox>
    );
  }
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row'
    // alignItems: 'center'
  },
  goodsInfo: {
    flexDirection: 'row',
    marginLeft: 5
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  },

  vipwidth: {
    background: '#ffebc4',
    padding: '0 3px 0 0',
    fontWeight: 500,
    borderRadius: '2px'
  },
  vipprices: {
    width: '40px',
    height: '20px'
  },
  // item: {
  //   float: 'left',
  //   width: '50%',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   margin: '10px 0',
  //   height: 124
  // },
  cell: {
    color: '#999',
    width: 200,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  textCon: {
    width: 120,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box'
    // webkitBoxOrient: 'vertical'
  } as any
} as any;
