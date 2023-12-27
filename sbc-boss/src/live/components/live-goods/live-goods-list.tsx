import React from 'react';
import { Relax } from 'plume2';
import { noop, DataGrid, history } from 'qmkit';
import { Modal, Form, Input } from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import FormItem from 'antd/lib/form/FormItem';
const defaultImg = require('../../../images/none.png');
const downloadImg = require('../../../images/download.png');
import './live-goods-list.less';

const confirm = Modal.confirm;
const Column = DataGrid;

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
      currentLiveGoodsTab: string;
      LiveGoodsTotal: number;
      LiveGoodsPageSize: number;
      LiveGoodsDataList: IList;
      LiveGoodsCurrent: number;
      // LiveGoodsCheckedIds: IList;
      LiveGoodsRows: IList;
      liveGoodsStoreName: IList;
      orderRejectModalVisible: boolean;
      goodsId: string;
      // onSelect: Function;
      goodsInfoList: IList;
      queryLiveGoodsPage: Function;
      onAudit: Function;
      liveGoodsShowRejectModal: Function;
      hideRejectModal: Function;
      liveGoodsReject: Function;
    };
  };

  static relaxProps = {
    currentLiveGoodsTab: 'currentLiveGoodsTab',
    LiveGoodsTotal: 'LiveGoodsTotal',
    LiveGoodsPageSize: 'LiveGoodsPageSize',
    LiveGoodsDataList: 'LiveGoodsDataList',
    LiveGoodsCurrent: 'LiveGoodsCurrent',
    // LiveGoodsCheckedIds: 'LiveGoodsCheckedIds',
    LiveGoodsRows: 'LiveGoodsRows',
    liveGoodsStoreName: 'liveGoodsStoreName',
    orderRejectModalVisible: 'orderRejectModalVisible',
    goodsId: 'goodsId',
    goodsInfoList: 'goodsInfoList',
    // onSelect: noop,
    queryLiveGoodsPage: noop,
    onAudit: noop,
    liveGoodsShowRejectModal: noop,
    hideRejectModal: noop,
    liveGoodsReject: noop
  };

  render() {
    const {
      currentLiveGoodsTab,
      LiveGoodsTotal,
      LiveGoodsPageSize,
      LiveGoodsDataList,
      LiveGoodsCurrent,
      // LiveGoodsCheckedIds,
      // onSelect,
      queryLiveGoodsPage,
      orderRejectModalVisible,
      goodsInfoList
    } = this.props.relaxProps;

    return (
      <TableBox>
        <DataGrid
          dataSource={LiveGoodsDataList.toJS()}
          rowKey={'liveGoodsListData'}
          pagination={{
            total: LiveGoodsTotal,
            pageSize: LiveGoodsPageSize,
            current: LiveGoodsCurrent,
            onChange: (pageNum, pageSize) => {
              queryLiveGoodsPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
          // rowSelection={{
          //   type: 'checkbox',
          //   selectedRowKeys: LiveGoodsCheckedIds.toJS(),
          //   onChange: (checkedRowKeys, row) => {
          //     onSelect(checkedRowKeys, row);
          //   }
          // }}
        >
          <Column
            key="goodsInfoName"
            dataIndex="goodsInfoName"
            title="商品"
            render={(_row, rowInfo) => {
              const goodsInfo = goodsInfoList.find(
                (e) => e.goodsInfoId == rowInfo.goodsInfoId
              );
              return (
                <div style={styles.item}>
                  <a
                    target="_blank"
                    href={
                      rowInfo.coverImgUrl ? rowInfo.coverImgUrl : defaultImg
                    }
                    download
                  >
                    <div
                      className="imageBox"
                      style={{
                        background:
                          'url(' +
                          (rowInfo.coverImgUrl
                            ? rowInfo.coverImgUrl
                            : defaultImg) +
                          ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center'
                      }}
                    >
                      <div id="downloadImgBox">
                        <img src={downloadImg} id="downloadImg" />
                      </div>
                    </div>
                  </a>
                  <div style={styles.goodsInfo}>
                    <div>{rowInfo.name ? rowInfo.name : '-'}</div>
                    <div style={styles.specText}>
                      {goodsInfo && goodsInfo.specText
                        ? goodsInfo.specText
                        : '-'}
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Column
            key="store"
            dataIndex="store"
            title="所属店铺"
            render={(_row, rowInfo) => {
              const { liveGoodsStoreName } = this.props.relaxProps;
              const storeName = liveGoodsStoreName[rowInfo.storeId];
              return <div>{storeName ? storeName : '--'}</div>;
            }}
          />
          <Column
            key="price"
            dataIndex="price"
            title="价格"
            render={(_row, rowInfo) => {
              let comps = [];
              switch (rowInfo.priceType) {
                case 1:
                  comps = [<div>￥{rowInfo.price}</div>];
                  break;
                case 2:
                  comps = [
                    <div>
                      ￥{rowInfo.price}~{rowInfo.price2}
                    </div>
                  ];
                  break;
                case 3:
                  comps = [
                    <div>
                      ￥{rowInfo.price2}
                      <del
                        style={{
                          color: 'rgba(153, 153, 153, 1)',
                          fontSize: '12px'
                        }}
                      >
                        {rowInfo.price}
                      </del>
                    </div>
                  ];
                  break;
                default:
                  comps = [<div>-</div>];
                  break;
              }
              return comps;
            }}
          />
          <Column key="stock" dataIndex="stock" title="库存" />
          <Column key="url" dataIndex="url" title="商品链接" />
          {currentLiveGoodsTab == '3' && (
            <Column
              title="审核未通过原因"
              key="auditReason"
              dataIndex="auditReason"
              render={(auditReason) => {
                return <div>{auditReason ? auditReason : '-'}</div>;
              }}
            />
          )}
          <Column
            title="操作"
            dataIndex="option"
            key="option"
            render={(_row, rowInfo) => {
              return (
                <div>
                  {currentLiveGoodsTab == '0' && (
                    <a onClick={() => this.props.relaxProps.onAudit(rowInfo)}>
                      提审
                    </a>
                  )}
                  {currentLiveGoodsTab == '0' && (
                    <a
                      style={{ marginLeft: 5 }}
                      onClick={() => this._showRejectedConfirm(rowInfo.id)}
                      href="javascript:void(0)"
                    >
                      驳回
                    </a>
                  )}
                  <a
                    target="_blank"
                    onClick={() =>
                      history.push({
                        pathname: `/goods-detail/${rowInfo.goodsIdForDetails}`
                      })
                    }
                    style={{ marginLeft: 5 }}
                  >
                    查看
                  </a>
                </div>
              );
            }}
          />
        </DataGrid>

        <Modal
          maskClosable={false}
          title="请输入驳回原因"
          visible={orderRejectModalVisible}
          okText="保存"
          onOk={() => this._handleOK()}
          onCancel={() => this._handleCancel()}
        >
          <WrappedRejectForm
            ref={(form) => {
              this._rejectForm = form;
            }}
          />
        </Modal>
      </TableBox>
    );
  }

  /**
   * 驳回订单确认提示
   * @private
   */
  _showRejectedConfirm = (id) => {
    const { liveGoodsShowRejectModal } = this.props.relaxProps;
    liveGoodsShowRejectModal(id, '3');
  };

  /**
   * 处理成功
   */
  _handleOK = () => {
    const { liveGoodsReject, goodsId } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        liveGoodsReject(goodsId, '3', values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  goodsInfo: {
    flexDirection: 'row',
    marginLeft: 5
  },
  specText: {
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px'
  }
} as any;
