import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import {
  AuthWrapper,
  checkAuth,
  Headline,
  SelectGroup,
  AreaSelect
} from 'qmkit';
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
      warehouseList: IList;
      form: IMap;
      addonBeforeForm: IMap;
      onFormValFieldChange: Function;
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
    warehouseList: 'warehouseList',
    exportModalData: 'exportModalData',
    form: 'form',
    addonBeforeForm: 'addonBeforeForm',
    onFormValFieldChange: noop
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      receiverSelect: 'consigneeName',
      buyerOptions: 'buyerName',
      supplierOptions: 'storeName',
      providerOptions: 'providerName',
      idOptions: 'id',
      supplierOptionsValue: '',
      providerOptionsValue: '',
      business: 'employeeName',
      businessValue: null,
      id: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      wareId: '',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      },
      useBalancePrice: null,
      deliverWay: null,
      payOrderNo: null,
      manageContent: '', // 当前白鲸管家输入框内容
      currentBelugaSelect: 'managerName', // 当前选择白鲸管家类型
      startTime:
        moment().subtract(6, 'months').format('YYYY-MM-DD') + ' ' + '00:00:00',
      endTime: moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
      defaultTime: []
    };
  }

  componentDidMount(): void {
    const {
      relaxProps: { form }
    } = this.props;
    if (!Boolean(form.get('beginTime') && form.get('endTime'))) {
      this.setState({
        defaultTime: [
          moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss'),
          moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss')
        ]
      });
    } else {
      this.setState({
        defaultTime: [
          moment(form.get('beginTime'), 'YYYY-MM-DD HH:mm:ss'),
          moment(form.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
        ]
      });
    }
  }
  render() {
    const {
      buyerId,
      relaxProps: {
        onSearch,
        exportModalData,
        onExportModalHide,
        warehouseList,
        form,
        addonBeforeForm,
        onFormValFieldChange
      }
    } = this.props;
    const tradeState = form.get('tradeState');
    // const menu = (
    //   <Menu>
    //     <Menu.Item>
    //       <AuthWrapper functionName={'fOrderList004'}>
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
        {!buyerId && <Headline title="订单列表" />}
        <div>
          <Form className="filter-content" layout="inline">
            {/*订单编号，子订单编号*/}
            <FormItem>
              <Input
                addonBefore={this._renderOrderIdOptionSelect()}
                value={form.get(addonBeforeForm.get('idOptions'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('idOptions'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   id: (e.target as any).value
                  // });
                }}
              />
            </FormItem>
            {/*支付单号*/}
            <FormItem>
              <Input
                style={{ width: 340 }}
                addonBefore="支付单号"
                value={form.get('payOrderNo')}
                onChange={(e) => {
                  onFormValFieldChange('payOrderNo', (e.target as any).value);
                  // this.setState({
                  //   payOrderNo: (e.target as any).value
                  // });
                }}
              />
            </FormItem>
            {/*商家名称，店铺名称*/}
            <FormItem>
              <Input
                addonBefore={this._renderSupplierOptionSelect()}
                value={form.get(addonBeforeForm.get('supplierOptions'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('supplierOptions'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   supplierOptions: (e.target as any).value
                  // });
                }}
              />
            </FormItem>
            {/*供应商名称，供应商编码*/}
            {/* <FormItem>
              <Input
                addonBefore={this._renderProviderOptionSelect()}
                onChange={(e) => {
                  this.setState({
                    providerOptionsValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>*/}
            {/*客户名称，客户账号*/}
            {!buyerId && (
              <FormItem>
                <Input
                  addonBefore={this._renderBuyerOptionSelect()}
                  value={form.get(addonBeforeForm.get('buyerOptions'))}
                  onChange={(e) => {
                    onFormValFieldChange(
                      addonBeforeForm.get('buyerOptions'),
                      (e.target as any).value
                    );
                    // this.setState({
                    //   buyerOptionsValue: (e.target as any).value
                    // });
                  }}
                />
              </FormItem>
            )}
            {/*是否使用鲸币*/}
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={null}
                value={form.get('useBalancePrice')}
                label="是否使用鲸币"
                onChange={(value: any) => {
                  onFormValFieldChange('useBalancePrice', value);
                  // this.setState({
                  //   useBalancePrice:value
                  // });
                }}
              >
                <Option value={null}>全部</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </SelectGroup>
            </FormItem>
            {/*商品名称、sku编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                value={form.get(addonBeforeForm.get('goodsOptions'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('goodsOptions'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   goodsOptionsValue: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            {/*收件人，手机*/}
            {!buyerId && (
              <FormItem>
                <Input
                  addonBefore={this._renderReceiverSelect()}
                  value={form.get(addonBeforeForm.get('receiverSelect'))}
                  onChange={(e) => {
                    onFormValFieldChange(
                      addonBeforeForm.get('receiverSelect'),
                      (e.target as any).value
                    );
                    // this.setState({
                    //   receiverSelectValue: (e.target as any).value
                    // });
                  }}
                />
              </FormItem>
            )}

            {/*收货地址*/}
            {!buyerId && (
              <FormItem>
                <AreaSelect
                  label="收货地址"
                  changeOnSelect
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) => {
                    onFormValFieldChange('area', value);
                  }}
                />
              </FormItem>
            )}

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                value={tradeState.get('deliverStatus') || ''}
                label="发货状态"
                onChange={(value) => {
                  onFormValFieldChange(
                    'tradeState',
                    fromJS({
                      deliverStatus: value,
                      payState: tradeState.get('payState') || '',
                      orderSource: tradeState.get('orderSource') || ''
                    })
                  );
                  // this.setState({
                  //   tradeState: {
                  //     deliverStatus: value,
                  //     payState: this.state.tradeState.payState,
                  //     orderSource: this.state.tradeState.orderSource
                  //   }
                  // });
                }}
              >
                <Option value="">全部</Option>
                <Option value="NOT_YET_SHIPPED">未发货</Option>
                <Option value="PART_SHIPPED">部分发货</Option>
                <Option value="SHIPPED">全部发货</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={tradeState.get('payState') || ''}
                onChange={
                  (value) => {
                    onFormValFieldChange(
                      'tradeState',
                      fromJS({
                        deliverStatus: tradeState.get('deliverStatus') || '',
                        payState: value,
                        orderSource: tradeState.get('orderSource') || ''
                      })
                    );
                  }
                  // this.setState({
                  //   tradeState: {
                  //     deliverStatus: this.state.tradeState.deliverStatus,
                  //     payState: value,
                  //     orderSource: this.state.tradeState.orderSource
                  //   }
                  // })
                }
                label="付款状态"
                defaultValue=""
              >
                <Option value="">全部</Option>
                <Option value="NOT_PAID">未付款</Option>
                <Option value="UNCONFIRMED">待确认</Option>
                <Option value="PAID">已付款</Option>
              </SelectGroup>
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={tradeState.get('orderSource') || ''}
                defaultValue=""
                label="订单来源"
                onChange={(value) => {
                  onFormValFieldChange(
                    'tradeState',
                    fromJS({
                      deliverStatus: tradeState.get('deliverStatus') || '',
                      payState: tradeState.get('payState') || '',
                      orderSource: value
                    })
                  );
                  // this.setState({
                  //   tradeState: {
                  //     deliverStatus: this.state.tradeState.deliverStatus,
                  //     payState: this.state.tradeState.payState,
                  //     orderSource: value
                  //   }
                  // });
                }}
              >
                <Option value="">全部</Option>
                <Option value="PC">PC订单</Option>
                <Option value="WECHAT">H5订单</Option>
                <Option value="APP">APP订单</Option>
                <Option value="LITTLEPROGRAM">小程序订单</Option>
              </SelectGroup>
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="发货仓"
                defaultValue={null}
                showSearch
                value={form.get('wareId')}
                onChange={(value) => {
                  onFormValFieldChange('wareId', value);
                  // this.setState({ wareId: value })
                }}
              >
                <Option value={null}>全部</Option>
                {warehouseList.toJS().map((v, i) => {
                  return (
                    <Option key={i} value={v.wareId + ''}>
                      {v.wareName}
                    </Option>
                  );
                })}
              </SelectGroup>
            </FormItem>

            <FormItem style={{ display: 'none' }}>
              <Input
                addonBefore={this._renderbusinessOptionSelect()}
                value={form.get(addonBeforeForm.get('business'))}
                onChange={(e) => {
                  onFormValFieldChange(
                    addonBeforeForm.get('business'),
                    (e.target as any).value
                  );
                  // this.setState({
                  //   businessValue: (e.target as any).value
                  // });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={null}
                value={form.get('deliverWay')}
                label="配送方式"
                onChange={(value) => {
                  onFormValFieldChange('deliverWay', value);
                  // this.setState({
                  //   deliverWay: value
                  // });
                }}
              >
                <Option value={null}>全部</Option>
                <Option value="1">托运部</Option>
                <Option value="2">快递到家</Option>
                {/* <Option value="3">自提</Option> */}
                <Option value="4">免费店配</Option>
                {/* <Option value="5">本地配送</Option> */}
                <Option value="6">自提</Option>
                <Option value="7">配送到店(自费)</Option>
                <Option value="8">指定专线</Option>
                <Option value="9">同城配送(自费)</Option>
              </SelectGroup>
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={form.get('activityType')}
                defaultValue={null}
                label="订单类型"
                onChange={(value) => {
                  onFormValFieldChange('activityType', value);
                  // this.setState({
                  //   activityType: value
                  // });
                }}
              >
                <Option value={null}>全部</Option>
                <Option value="0">提货订单</Option>
                <Option value="4">囤货订单</Option>
              </SelectGroup>
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={form.get('refundVoucherImagesFlag')}
                defaultValue={''}
                label="是否上传凭证"
                onChange={(value) => {
                  onFormValFieldChange('refundVoucherImagesFlag', value);
                  // this.setState({
                  //   activityType: value
                  // });
                  // 0否1是
                }}
              >
                <Option value={''}>全部</Option>
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <RangePicker
                // showTime
                showTime={{
                  defaultValue: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('23:59:59', 'HH:mm:ss')
                  ]
                }}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                value={
                  this.state.defaultTime
                  // form.get('beginTime') && form.get('endTime')
                  //   ? [
                  //       moment(form.get('beginTime'), 'YYYY-MM-DD HH:mm:ss'),
                  //       moment(form.get('endTime'), 'YYYY-MM-DD HH:mm:ss')
                  //     ]
                  //   : []
                }
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                    endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
                    this.setState({
                      defaultTime: [
                        moment(beginTime, 'YYYY-MM-DD HH:mm:ss'),
                        moment(endTime, 'YYYY-MM-DD HH:mm:ss')
                      ]
                    });
                  } else {
                    this.setState({
                      defaultTime: []
                    });
                  }

                  onFormValFieldChange('beginTime', beginTime);
                  onFormValFieldChange('endTime', endTime);
                  // this.setState({ beginTime: beginTime, endTime: endTime });
                }}
              />
            </FormItem>
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={form.get('selfManage')}
                defaultValue={''}
                label="是否自营商家"
                onChange={(value) => {
                  onFormValFieldChange('selfManage', value);
                }}
              >
                <Option value={''}>全部</Option>
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </SelectGroup>
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                value={form.get('presellFlag')}
                defaultValue={''}
                label="是否预售订单"
                onChange={(value) => {
                  onFormValFieldChange('presellFlag', value);
                }}
              >
                <Option value={''}>全部</Option>
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </SelectGroup>
            </FormItem>
            {/* 白鲸管家   --start*/}
            <FormItem style={{ display: 'none' }}>
              <Input
                addonBefore={
                  <Select
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    defaultValue={'managerName'}
                    style={{ width: 120 }}
                    onChange={this.belugaOptionSelect}
                  >
                    <Option value="managerName">白鲸管家名称</Option>
                    <Option value="managerAccount">白鲸管家账号</Option>
                  </Select>
                }
                onChange={(e) => {
                  this.belugaContentChange(e.target.value);
                }}
                value={this.state.manageContent}
              />
            </FormItem>
            {/* 白鲸管家   --end*/}
            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  // const {
                  //   idOptions,
                  //   buyerOptions,
                  //   goodsOptions,
                  //   receiverSelect,
                  //   id,
                  //   buyerOptionsValue,
                  //   goodsOptionsValue,
                  //   receiverSelectValue,
                  //   tradeState,
                  //   beginTime,
                  //   endTime,
                  //   supplierOptions,
                  //   supplierOptionsValue,
                  //   providerOptions,
                  //   providerOptionsValue,
                  //   deliverWay,
                  //   wareId,
                  //   business,
                  //   businessValue,
                  //   payOrderNo,
                  //   activityType,
                  //   useBalancePrice
                  // } = this.state;
                  // console.log('business',business,businessValue);
                  const tradeState = form.get('tradeState').toJS();
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
                  onFormValFieldChange('tradeState', fromJS(ts));
                  // const params = {
                  //   [business]:businessValue,
                  //   [idOptions]: id,
                  //   [buyerOptions]: buyerOptionsValue,
                  //   tradeState: ts,
                  //   [goodsOptions]: goodsOptionsValue,
                  //   [receiverSelect]: receiverSelectValue,
                  //   [supplierOptions]: supplierOptionsValue,
                  //   [providerOptions]: providerOptionsValue,
                  //   payOrderNo,
                  //   beginTime,
                  //   endTime,
                  //   deliverWay: deliverWay ? deliverWay : null,
                  //   wareId: wareId || '0',
                  //   activityType:activityType?activityType:null,
                  //   useBalancePrice:useBalancePrice
                  // };

                  onSearch();
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>

          <div className="handle-bar">
            {/* <AuthWrapper functionName={'fOrderList004'}>
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
            <AuthWrapper functionName={'fOrderList004'}>
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

  _renderbusinessOptionSelect = () => {
    const { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          onFormValFieldChange('business', value, 'addonBeforeForm');
          onFormValFieldChange('employeeName', '');
          onFormValFieldChange('employeeAccount', '');
          // this.setState({
          //   business: value
          // });
        }}
        value={addonBeforeForm.get('business')}
        style={{ width: 110 }}
      >
        <Option value="employeeName">业务员名称</Option>
        <Option value="employeeAccount">业务员账号</Option>
      </Select>
    );
  };
  // 白鲸管家查询类型选择
  belugaOptionSelect = async (e) => {
    // 设置当前选择类型
    this.setState({ currentBelugaSelect: e });
    // 更新搜索值
    await this.props.relaxProps.onFormValFieldChange(
      e === 'managerName' ? 'managerAccount' : 'managerName',
      ''
    );
    await this.props.relaxProps.onFormValFieldChange(
      e,
      this.state.manageContent
    );
  };
  // 白鲸管家输入框内容更新
  belugaContentChange = (text) => {
    this.setState({ manageContent: text });
    this.props.relaxProps.onFormValFieldChange(
      this.state.currentBelugaSelect,
      text
    );
  };
  _renderOrderIdOptionSelect = () => {
    let { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          onFormValFieldChange('idOptions', value, 'addonBeforeForm');
          onFormValFieldChange('id', '');
          onFormValFieldChange('providerTradeId', '');
          // this.setState({
          //   idOptions: value
          // });
        }}
        value={addonBeforeForm.get('idOptions')}
        style={{ minWidth: 100 }}
      >
        <Option value="id">订单编号</Option>
        <Option value="providerTradeId">子订单编号</Option>
      </Select>
    );
  };

  _renderBuyerOptionSelect = () => {
    let { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          onFormValFieldChange('buyerOptions', value, 'addonBeforeForm');
          onFormValFieldChange('buyerName', '');
          onFormValFieldChange('buyerAccount', '');
          // this.setState({
          //   buyerOptions: value
          // });
        }}
        value={addonBeforeForm.get('buyerOptions')}
        style={{ width: 100 }}
      >
        <Option value="buyerName">客户名称</Option>
        <Option value="buyerAccount">客户账号</Option>
      </Select>
    );
  };

  _renderSupplierOptionSelect = () => {
    let { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          onFormValFieldChange('supplierOptions', value, 'addonBeforeForm');
          onFormValFieldChange('storeName', '');
          onFormValFieldChange('supplierName', '');
          // this.setState({
          //   supplierOptions: value
          // });
        }}
        value={addonBeforeForm.get('supplierOptions')}
      >
        <Option value="storeName">店铺名称</Option>
        <Option value="supplierName">商家名称</Option>
      </Select>
    );
  };

  _renderProviderOptionSelect = () => {
    let { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormValFieldChange('providerOptions', val, 'addonBeforeForm');
          onFormValFieldChange('providerName', '');
          onFormValFieldChange('providerCode', '');
          // this.setState({
          //   providerOptions: val
          // });
        }}
        value={addonBeforeForm.get('providerOptions')}
        style={{ width: 110 }}
      >
        <Option value="providerName">供应商名称</Option>
        <Option value="providerCode">供应商编号</Option>
      </Select>
    );
  };

  _renderGoodsOptionSelect = () => {
    let { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormValFieldChange('goodsOptions', val, 'addonBeforeForm');
          onFormValFieldChange('skuName', '');
          onFormValFieldChange('skuNo', '');
          // this.setState({
          //   goodsOptions: val
          // });
        }}
        value={addonBeforeForm.get('goodsOptions')}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };

  _renderReceiverSelect = () => {
    let { addonBeforeForm, onFormValFieldChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormValFieldChange('receiverSelect', val, 'addonBeforeForm');
          onFormValFieldChange('consigneeName', '');
          onFormValFieldChange('consigneePhone', '');
          // this.setState({
          //   receiverSelect: val
          // })
        }}
        value={addonBeforeForm.get('receiverSelect')}
        style={{ minWidth: 100 }}
      >
        <Option value="consigneeName">收件人</Option>
        <Option value="consigneePhone">收件人手机</Option>
      </Select>
    );
  };

  /**
   * 批量审核确认提示
   * @private
   */
  _showBatchAudit = () => {
    const { onBatchAudit, dataList } = this.props.relaxProps;
    const checkedIds = dataList
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (checkedIds.length == 0) {
      message.error('请选择需要操作的订单');
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: '审核',
      content: '确认审核已选择订单？',
      onOk() {
        onBatchAudit();
      },
      onCancel() {}
    });
  };

  async _handleBatchExport() {
    // 校验是否有导出订单权限, fOrderList004 为导出订单权限的功能编号
    const haveAuth = checkAuth('fOrderList004');
    if (haveAuth) {
      const { onExportByParams, onExportByIds, onExportBySonTrade } =
        this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的订单',
        byIdsTitle: '导出选中的订单',
        // bySonTradesTitle: '只导出子订单',
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
