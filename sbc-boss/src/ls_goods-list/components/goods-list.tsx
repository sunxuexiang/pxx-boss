import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, Const, checkAuth } from 'qmkit';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';

const { Column } = DataGrid as any;
const defaultImg = require('../img/none.png');

@withRouter
@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      goodsPageContent: IList;
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      goodsCateList: IList;
      goodsBrandList: IList;
      changeForbidGoodsId: Function;
      switchShowModal: Function;
      forbidSaleFunc: Function;
      total: number;
      onFormFieldChange: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      pageSize:number;
      expandedRowKeys: IList;
      importStandard: IList;
      addToGoodsLibrary: Function;
      switchShowModal2: Function;
      onFieldChange: Function;
      searchBrandLink: Function;
      selectedSpuKeys: IList;
      onSelectChange: Function;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    goodsCateList: 'goodsCateList',
    goodsBrandList: 'goodsBrandList',
    changeForbidGoodsId: noop, //禁售spuId
    switchShowModal: noop, //切换是否显示禁售原因弹框
    forbidSaleFunc: noop, //禁售
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    pageSize:'pageSize',
    expandedRowKeys: 'expandedRowKeys', //正展开的spuIdList
    importStandard: [],
    addToGoodsLibrary: noop,
    switchShowModal2: noop,
    onFieldChange: noop,
    searchBrandLink: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    onSelectChange: noop
  };

  render() {
    const {
      goodsCateList,
      goodsBrandList,
      goodsPageContent,
      total,
      pageNum,
      pageSize,
      expandedRowKeys,
      changeForbidGoodsId,
      switchShowModal,
      addToGoodsLibrary,
      switchShowModal2,
      onFieldChange,
      searchBrandLink,
      selectedSpuKeys,
      onSelectChange
    } = this.props.relaxProps;

    return (
      <DataGrid
        //@ts-ignore
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
        pagination={{ 
          total, 
          current: pageNum + 1,
          pageSize:pageSize,
          showSizeChanger:true,
          showQuickJumper:true,
          pageSizeOptions:["10","40","60","80","100"],
          onChange: this._getData,
          onShowSizeChange:(current,pageSize)=>{
            this._getData(1,pageSize);
          }
        }}
        rowSelection={{
          selectedRowKeys: selectedSpuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          }
        }}
      >
        <Column
          title="排序"
          dataIndex="goodsSeqNum"
          key="goodsSeqNum"
          render={(goodsSeqNum) => (goodsSeqNum ? goodsSeqNum : '-')}
        />
        <Column
          title="图片"
          dataIndex="goodsImg"
          key="goodsImg"
          render={(img) =>
            img ? (
              <img src={img} style={styles.imgItem} />
            ) : (
              <img src={defaultImg} style={styles.imgItem} />
            )
          }
        />
        <Column
          title="商品名称"
          dataIndex="goodsName"
          key="goodsName"
          className="nameBox"
          width={200}
        />
        <Column title="SPU编码" dataIndex="goodsNo" key="goodsNo" />
        <Column
          title="销售类型"
          key="saleType"
          render={(rowInfo) => {
            const { saleType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {saleType == 0 ? '批发' : '零售'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title={
            <p>
              门店价
              <br />
              设价方式
            </p>
          }
          key="marketPrice"
          render={(rowInfo) => {
            const { marketPrice, priceType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {marketPrice == null ? 0.0 : marketPrice.toFixed(2)}
                </p>
                <p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>
              </div>
            );
          }}
        />
         <Column
          title={
            <span>
              大客户价
              {/*<br />*/}
              {/*设价方式*/}
            </span>
          }
          key="vipPrice"
          render={(rowInfo) => {
            const { vipPrice ,marketPrice} = rowInfo;
            return (
              <div>
                <p style={styles.vipwidth}>
                 <img  style={styles.vipprices} src="https://cjdbj.oss-accelerate.aliyuncs.com/mini/listVip.png" /> ￥{vipPrice == null ? marketPrice.toFixed(2) : vipPrice.toFixed(2)}
                </p>
                {/*<p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>*/}
              </div>
            );
          }}
        />
        <Column
          title="商品类目"
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
          title="商品类型"
          key="goodsType"
          render={(rowInfo) => {
            const { goodsType } = rowInfo;
            if (goodsType == 2) {
              return '特价商品';
            } else {
              return '普通商品';
            }
          }}
        />
         <Column
          title="囤货状态"
          key="purchaseNum"
          render={(rowInfo) => {
            const { marketingId,purchaseNum } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {marketingId > 0 && purchaseNum <= 0 ? '等货中' : marketingId > 0 && purchaseNum > 0 ? '囤货中' : marketingId > 0 && purchaseNum == 0 ? '已囤完' : '非囤货商品' }
                  {/* ? '囤货商品' : marketingId <= 0 ? '普通商品' : '' */}
                </p>
              </div>
            );
          }}
        />
        <Column
          title="特价"
          key="specialPrice"
          render={(rowInfo) => {
            const { goodsType, specialPrice } = rowInfo;
            if (goodsType == 2) {
              return specialPrice.toFixed(2);
            } else {
              return '-';
            }
          }}
        />
        <Column
          title="批次号"
          key="goodsInfoBatchNo"
          render={(rowInfo) => (
            <span>
              {rowInfo.goodsInfoBatchNo ? rowInfo.goodsInfoBatchNo : '-'}
            </span>
          )}
        />

        <Column title="所属商家" dataIndex="supplierName" key="supplierName" />
        <Column
          title="操作"
          key="goodsId"
          render={(rowInfo) => {
            return checkAuth('f_goods_detail_1-ls') ||
              checkAuth('f_goods_2-ls') ||
              checkAuth('f_add_to_goods_library_1-ls') ? (
              <div>
                <div>
                  <AuthWrapper functionName="f_goods_edit_sort-ls">
                    <a
                      href="javascript:;"
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        rowInfo.brandId && searchBrandLink(rowInfo.brandId);
                        onFieldChange('goodsInfo', rowInfo);
                        onFieldChange('goodsSeqNum', rowInfo.goodsSeqNum);
                        switchShowModal2(true);
                      }}
                    >
                      编辑排序
                    </a>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_goods_detail_1-ls">
                    <Link
                      to={`/ls_goods-detail/${rowInfo.goodsId}/${pageNum}`}
                      style={{ marginRight: 10 }}
                    >
                      查看
                    </Link>
                  </AuthWrapper>
                  {/* <AuthWrapper functionName="f_goods_2-ls">
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        changeForbidGoodsId(rowInfo.goodsId);
                        switchShowModal(true);
                      }}
                    >
                      禁售
                    </a>
                  </AuthWrapper> */}
                </div>
                <AuthWrapper functionName="f_add_to_goods_library_1-ls">
                  {rowInfo.addToGoodsLibrary && (
                    <div>
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          addToGoodsLibrary(rowInfo.goodsId);
                        }}
                      >
                        加入商品库
                      </a>
                    </div>
                  )}
                </AuthWrapper>
              </div>
            ) : (
              '-'
            );
          }}
        />
      </DataGrid>
    );
  }

  _expandedRowRender = (record, index) => {
    const { goodsInfoList, goodsInfoSpecDetails } = this.props.relaxProps;

    const currentGoods = goodsInfoList.filter((v) => {
      return record.goodsInfoIds.indexOf(v.get('goodsInfoId')) != -1;
    });

    return currentGoods
      .map((goods, i) => {
        const currentGoodsSpecDetails = goodsInfoSpecDetails
          .filter(
            (v) =>
              goods.get('specDetailRelIds').indexOf(v.get('specDetailRelId')) !=
              -1
          )
          .map((v) => {
            return v.get('detailName');
          })
          .join(' ');

        return (
          <div key={`${index}_${i}`} style={styles.item}>
            <div style={{ marginLeft: 17 }}>
              <img
                src={
                  goods.get('goodsInfoImg')
                    ? goods.get('goodsInfoImg')
                    : defaultImg
                }
                style={styles.imgItem}
              />
              <AuthWrapper functionName="f_goods_sku_detail_1-ls">
                <Link
                  style={{ marginTop: 5, display: 'block' }}
                  to={`/ls_goods-sku-detail/${goods.get('goodsInfoId')}`}
                >
                  查看
                </Link>
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>规格：</label>
                <span className="specification" style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU编码：</label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>门店价：</label>
                {goods.get('marketPrice') != null
                  ? goods.get('marketPrice').toFixed(2)
                  : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>上下架：</label>
                {goods.get('addedFlag') == 0 ? '下架' : '上架'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>条形码：</label>
                {goods.get('goodsInfoBarcode')
                  ? goods.get('goodsInfoBarcode')
                  : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>库存：</label>
                {goods.get('stock')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>大客户价：</label>
                {goods.get('vipPrice')
                  ? goods.get('vipPrice').toFixed(2)
                  : goods.get('marketPrice').toFixed(2)}
              </div>
            </div>
          </div>
        );
      })
      .toJS();
  };

  //通过图标点击显示SKU
  _showSkuByIcon = (index) => {
    const { onShowSku } = this.props.relaxProps;
    let goodsIds = List();
    if (index != null && index.length > 0) {
      index.forEach((value, key) => {
        goodsIds = goodsIds.set(key, value);
      });
    }
    onShowSku(goodsIds);
  };

  _getData = (pageNum, pageSize) => {
    const { onFormFieldChange, onPageSearch } = this.props.relaxProps;
    onFormFieldChange({ key: 'pageNum', value: --pageNum });
    onFormFieldChange({ key: 'pageSize', value: pageSize });
    onPageSearch();
  };
}

const styles = {
  vipwidth: {
    background: '#ffebc4',
    padding: '0 3px 0 0',
    fontWeight: 500,
    borderRadius: '2px',
  },
  vipprices: {
    width: '40px',
    height: '20px'
  },
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
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
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
