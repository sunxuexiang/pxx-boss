import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import { AuthWrapper, checkAuth, Headline, SelectGroup } from 'qmkit';
import { noop, ExportTradeModal, Const } from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';
import { message } from 'antd';
import { fromJS } from 'immutable';
import moment from 'moment';


const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    buyerId: string;
    relaxProps?: {
      onSearch: Function;
      onBatchAudit: Function;
      tab: IMap;
      dataList: IList;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      onExportBySonTrade: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    tab: 'tab',
    dataList: 'dataList',
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    onExportBySonTrade: noop,
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      receiverSelect: 'consigneeName',
      buyerOptions: 'buyerName',
      supplierOptions: 'supplierName',
      providerOptions: 'providerName',
      idOptions: 'id',
      supplierOptionsValue: '',
      providerOptionsValue: '',
      id: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      payOrderNo:'',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      },
      useBalancePrice:null,
      deliverWay: null
    };
  }

  render() {
    const {
      buyerId,
      relaxProps: { onSearch, exportModalData, onExportModalHide }
    } = this.props;

    // const menu = (
    //   <Menu>
    //     <Menu.Item>
    //       <AuthWrapper functionName={'thfOrderList004'}>
    //         <a
    //           target="_blank"
    //           href="javascript:;"
    //           onClick={() => this._handleBatchExport()}
    //         >
    //           批量导出
    //         </a>
    //       </AuthWrapper>
    //     </Menu.Item>
    //   </Menu>
    // );

    return (
      <div>
        {!buyerId && <Headline title="囤货订单列表" />}
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="订单编号"
                onChange={(e) => {
                  this.setState({
                    id: (e.target as any).value
                  });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore={this._renderSupplierOptionSelect()}
                onChange={(e) => {
                  this.setState({
                    supplierOptionsValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="支付单号"
                onChange={(e) => {
                  this.setState({
                    payOrderNo: (e.target as any).value
                  });
                }}
              />
            </FormItem>
            {/*是否使用鲸币*/}
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={null}
                label="是否使用鲸币"
                onChange={(value:any) => {
                  this.setState({
                    useBalancePrice:value
                  });
                }}
              >
                <Option value={null}>全部</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </SelectGroup>
            </FormItem>
            {/*客户名称，客户账号*/}
            {!buyerId && (
              <FormItem>
                <Input
                  addonBefore={this._renderBuyerOptionSelect()}
                  onChange={(e) => {
                    this.setState({
                      buyerOptionsValue: (e.target as any).value
                    });
                  }}
                />
              </FormItem>
            )}

            {/*商品名称、sku编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                onChange={(e) => {
                  this.setState({
                    goodsOptionsValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/*收件人，收件人手机*/}
            {!buyerId && (
              <FormItem>
                <Input
                  addonBefore={this._renderReceiverSelect()}
                  onChange={(e) => {
                    this.setState({
                      receiverSelectValue: (e.target as any).value
                    });
                  }}
                />
              </FormItem>
            )}

            <FormItem>
              <RangePicker
              // showTime
              // format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}

                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                    endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
                  }
                  this.setState({ beginTime: beginTime, endTime: endTime });
                }}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  const {
                    idOptions,
                    buyerOptions,
                    goodsOptions,
                    receiverSelect,
                    id,
                    buyerOptionsValue,
                    goodsOptionsValue,
                    receiverSelectValue,
                    tradeState,
                    beginTime,
                    endTime,
                    supplierOptions,
                    supplierOptionsValue,
                    providerOptions,
                    providerOptionsValue,
                    deliverWay,
                    payOrderNo,
                    useBalancePrice
                  } = this.state;

                  const ts = {} as any;
                  if (tradeState.deliverStatus) {
                    ts.deliverStatus = tradeState.deliverStatus;
                  }

                  if (tradeState.payState) {
                    ts.payState = tradeState.payState;
                  }

                  if (tradeState.orderSource) {
                    ts.orderSource = tradeState.orderSource;
                  }

                  const params = {
                    [idOptions]: id,
                    [buyerOptions]: buyerOptionsValue,
                    tradeState: ts,
                    [goodsOptions]: goodsOptionsValue,
                    [receiverSelect]: receiverSelectValue,
                    [supplierOptions]: supplierOptionsValue,
                    [providerOptions]: providerOptionsValue,
                    beginTime,
                    endTime,
                    deliverWay: deliverWay ? deliverWay : null,
                    payOrderNo:payOrderNo||null,
                    useBalancePrice:useBalancePrice
                  };

                  onSearch(params);
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>

          <div className="handle-bar">
            {/* <AuthWrapper functionName={'thfOrderList004'}>
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </AuthWrapper> */}
            <AuthWrapper functionName={'thfOrderList004'}>
              <Button onClick={() => this._handleBatchExport()}>
                批量导出
              </Button>
            </AuthWrapper>
          </div>
        </div>

        <ExportTradeModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          handleBySonTrade={exportModalData.get('exportBySonTrade')}
          alertInfo={fromJS({
            message: '操作说明:',
            description:
              '为保证效率,每次最多支持' +
              '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'
          })}
          alertVisible={true}
        />
      </div>
    );
  }

  _renderOrderIdOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            idOptions: value
          });
        }}
        value={this.state.idOptions}
        style={{ minWidth: 100 }}
      >
        <Option value="id">订单编号</Option>
        <Option value="providerTradeId">子订单编号</Option>
      </Select>
    );
  };

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            buyerOptions: value
          });
        }}
        value={this.state.buyerOptions}
        style={{ width: 100 }}
      >
        <Option value="buyerName">客户名称</Option>
        <Option value="buyerAccount">客户账号</Option>
      </Select>
    );
  };

  _renderSupplierOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            supplierOptions: value
          });
        }}
        value={this.state.supplierOptions}
      >
        <Option value="supplierName">商家名称</Option>
        <Option value="supplierCode">商家编码</Option>
      </Select>
    );
  };

  _renderProviderOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.setState({
            providerOptions: val
          });
        }}
        value={this.state.providerOptions}
        style={{ width: 110 }}
      >
        <Option value="providerName">供应商名称</Option>
        <Option value="providerCode">供应商编号</Option>
      </Select>
    );
  };

  _renderGoodsOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };

  _renderReceiverSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        value={this.state.receiverSelect}
        style={{ minWidth: 100 }}
      >
        <Option value="consigneeName">收件人</Option>
        <Option value="consigneePhone">收件人手机</Option>
      </Select>
    );
  };



  async _handleBatchExport() {
    // 校验是否有导出订单权限, thfOrderList004 为导出订单权限的功能编号
    const haveAuth = checkAuth('thfOrderList004');
    if (haveAuth) {
      const {
        onExportByParams,
        onExportByIds,
        onExportBySonTrade
      } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的订单',
        byIdsTitle: '导出选中的订单',
        bySonTradesTitle: '导出订单明细',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds,
        disabled: false,
        exportBySonTrade: onExportBySonTrade
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}
