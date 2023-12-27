import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Tooltip } from 'antd';
import { DataGrid, noop, AuthWrapper } from 'qmkit';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';

const { Column } = DataGrid as any;
const defaultImg = require('../img/none.png');

/**
 * 企业购商品审核状态 0:普通商品 1:待审核 2:已审核通过 3:审核不通过 4:禁止企业购
 * @type {{"0": string; "1": string; "2": string; "3": string; "4": string}}
 */
const GOODS_AUDIT_TYPE = {
  1: '待审核',
  2: '已审核',
  3: '审核未通过'
};

@withRouter
@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      goodsCateList: IList;
      goodsBrandList: IList;
      companyInfoList: IList;
      selectedSkuKeys: IList;
      total: number;
      pageNum: number;
      form: any;
      sortedInfo: IMap;
      onFormFieldChange: Function;
      onSelectChange: Function;
      init: Function;
      setSortedInfo: Function;
      checkSwapInputGroupCompact: Function;
      onChecked: Function;
      onFieldChange: Function;
      switchShowModal: Function;
      enterpriseSetting: IMap;
    };
  };

  static relaxProps = {
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    goodsCateList: 'goodsCateList',
    goodsBrandList: 'goodsBrandList',
    companyInfoList: 'companyInfoList',
    selectedSkuKeys: 'selectedSkuKeys',
    total: 'totalCount',
    pageNum: 'pageNum',
    form: 'form',
    sortedInfo: 'sortedInfo',
    onFormFieldChange: noop,
    onSelectChange: noop,
    init: noop,
    setSortedInfo: noop,
    checkSwapInputGroupCompact: noop,
    onChecked: noop,
    // 设置驳回企业购的skuId
    onFieldChange: noop,
    // 显示/关闭弹窗
    switchShowModal: noop,
    // 企业设置
    enterpriseSetting: 'enterpriseSetting'
  };

  render() {
    const {
      goodsCateList,
      goodsBrandList,
      goodsInfoList,
      companyInfoList,
      selectedSkuKeys,
      total,
      pageNum,
      onSelectChange,
      init,
      sortedInfo,
      onChecked,
      onFieldChange,
      switchShowModal,
      enterpriseSetting
    } = this.props.relaxProps;
    // 表格排序
    const sortInfo = sortedInfo.toJS();

    return (
      <DataGrid
        className="resetTable"
        rowKey={(record) => record.goodsInfoId}
        // rowSelection={{
        //   selectedRowKeys: selectedSkuKeys.toJS(),
        //   onChange: (selectedRowKeys) => {
        //     onSelectChange(selectedRowKeys);
        //   },
        //   getCheckboxProps: (record) => ({
        //     disabled: record.enterPriseAuditState !== 1
        //   })
        // }}
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
        dataSource={goodsInfoList.toJS()}
        pagination={{
          total,
          current: pageNum + 1,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="商品"
          key="goodsInfoId"
          render={(rowInfo) => {
            const dataResult = this._dealData(rowInfo);
            return (
              <div key={dataResult.goodsInfoId} style={styles.item}>
                <div>
                  <img
                    src={
                      dataResult.goodsInfoImg
                        ? dataResult.goodsInfoImg
                        : defaultImg
                    }
                    style={styles.imgItem}
                  />
                </div>
                <div style={styles.content}>
                  <div className="line-two" style={styles.name}>
                    {dataResult.goodsInfoName}
                  </div>
                  <div className="line-two" style={styles.spec}>
                    {dataResult.currentGoodsSpecDetails}
                  </div>
                  <div style={styles.spec}>{dataResult.goodsInfoNo}</div>
                </div>
              </div>
            );
          }}
        />
        <Column
          title="商家"
          dataIndex="companyInfoId"
          key="companyInfoId"
          className="nameBox"
          width={200}
          render={(rowInfo) => {
            const companyInfo = companyInfoList.find(
              (info) => info.get('companyInfoId') == rowInfo
            );
            return companyInfo ? (
              <div>
                <p>{companyInfo.get('supplierName')}</p>
                <p>{companyInfo.get('companyCode')}</p>
              </div>
            ) : (
              '-'
            );
          }}
        />
        <Column
          title="平台类目"
          dataIndex="cateId"
          key="cateId"
          render={(rowInfo) => {
            return goodsCateList
              .filter((v) => {
                return v.get('cateId') == rowInfo;
              })
              .getIn([0, 'cateName']);
          }}
        />
        <Column
          title="品牌"
          dataIndex="brandId"
          key="brandId"
          render={(rowInfo) => {
            return (
              goodsBrandList
                .filter((v) => {
                  return v.get('brandId') == rowInfo;
                })
                .getIn([0, 'brandName']) || '-'
            );
          }}
        />
        <Column
          title="门店价"
          dataIndex="marketPrice"
          key="marketPrice"
          sorter={true}
          sortOrder={sortInfo.columnKey === 'marketPrice' && sortInfo.order}
          render={(marketPrice) =>
            marketPrice == null ? 0.0 : marketPrice.toFixed(2)
          }
        />
        <Column
          title={
            enterpriseSetting
              ? enterpriseSetting.get('enterprisePriceName')
              : '企业价'
          }
          dataIndex="enterPrisePrice"
          key="enterPrisePrice"
          sorter={true}
          sortOrder={sortInfo.columnKey === 'enterPrisePrice' && sortInfo.order}
          render={(enterPrisePrice) =>
            enterPrisePrice == null ? 0.0 : enterPrisePrice.toFixed(2)
          }
        />
        <Column
          title="库存"
          dataIndex="stock"
          key="stock"
          sorter={true}
          sortOrder={sortInfo.columnKey === 'stock' && sortInfo.order}
        />
        <Column
          title="上下架"
          dataIndex="addedFlag"
          key="addedFlag"
          render={(rowInfo) => {
            if (rowInfo == 0) {
              return '下架';
            }
            if (rowInfo == 2) {
              return '部分上架';
            }
            return '上架';
          }}
        />
        <Column
          title="审核状态"
          key="enterPriseAuditState"
          render={(rowInfo) => {
            const {
              enterPriseAuditState,
              enterPriseGoodsAuditReason
            } = rowInfo;
            return (
              <div>
                <p>{GOODS_AUDIT_TYPE[enterPriseAuditState]}</p>
                {enterPriseAuditState === 3 && (
                  <Tooltip
                    placement="topLeft"
                    title={enterPriseGoodsAuditReason}
                  >
                    <a href="javascript:;">原因</a>
                  </Tooltip>
                )}
              </div>
            );
          }}
        />
        <Column
          title="操作"
          key="goodsId"
          render={(rowInfo) => {
            return (
              <div>
                {rowInfo.enterPriseAuditState === 1 && (
                  <AuthWrapper functionName="f_enterprise_goods_audit">
                    <div>
                      <a
                        style={{ marginRight: 10 }}
                        onClick={() => onChecked(rowInfo.goodsInfoId)}
                      >
                        审核
                      </a>
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          onFieldChange(
                            'forbidGoodsInfoId',
                            rowInfo.goodsInfoId
                          );
                          switchShowModal(true);
                        }}
                      >
                        驳回
                      </a>
                    </div>
                  </AuthWrapper>
                )}
                {(rowInfo.enterPriseAuditState === 3 ||
                  rowInfo.enterPriseAuditState === 2) &&
                  '-'}
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 拼装商品信息
   * @param rowInfo
   * @returns {{goodsInfoId: any; goodsInfoNo: any; goodsInfoName: any; goodsInfoImg: any; currentGoodsSpecDetails: string}}
   * @private
   */
  _dealData = (rowInfo) => {
    const { goodsInfoSpecDetails } = this.props.relaxProps;
    const {
      goodsInfoId,
      goodsInfoNo,
      goodsInfoName,
      goodsInfoImg,
      specDetailRelIds
    } = rowInfo;
    const currentGoodsSpecDetails =
      goodsInfoSpecDetails &&
      goodsInfoSpecDetails
        .filter((v) => specDetailRelIds.indexOf(v.get('specDetailRelId')) != -1)
        .map((v) => {
          return v.get('detailName');
        })
        .join(' ');
    const dataResult = {
      goodsInfoId: goodsInfoId,
      goodsInfoNo: goodsInfoNo,
      goodsInfoName: goodsInfoName,
      goodsInfoImg: goodsInfoImg,
      currentGoodsSpecDetails: currentGoodsSpecDetails || '-'
    };
    return dataResult;
  };

  /**
   * 列表排序
   * @param _pagination
   * @param _filters
   * @param sorter
   * @private
   */
  _handleOnChange = (pagination, _filters, sorter) => {
    let currentPage = pagination.current;
    const {
      init,
      onFormFieldChange,
      setSortedInfo,
      pageNum,
      checkSwapInputGroupCompact
    } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    // let currentPage = pagination.current;
    //如果是翻页触发table数据变化 不重新排序
    if (pageNum != currentPage - 1) {
      return;
    }
    if (
      sorter.columnKey != sortedInfo.columnKey ||
      sorter.order != sortedInfo.order
    ) {
      currentPage = 1;
    }
    onFormFieldChange({
      key: 'sortColumn',
      value: sorter.columnKey ? sorter.columnKey : 'createTime'
    });
    onFormFieldChange({
      key: 'sortRole',
      value: sorter.order === 'ascend' ? 'asc' : 'desc'
    });
    this.setState({ pageNum: currentPage - 1 });
    setSortedInfo(sorter.columnKey, sorter.order);
    checkSwapInputGroupCompact();
    init();
  };
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '10px 0',
    height: 124
  },
  content: {
    width: 200,
    marginLeft: 5,
    textAlign: 'left'
  },
  name: {
    color: '#333',
    fontSize: 14
  },
  spec: {
    color: '#999',
    fontSize: 12
  },
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
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
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical'
  }
} as any;
