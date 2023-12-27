import * as React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Icon,
  message,
  Radio,
  InputNumber,
  Select,
  Table
} from 'antd';
import PropTypes from 'prop-types';
import { Store, Relax } from 'plume2';
import styled from 'styled-components';
import { Const, history, QMUpload, Tips, ValidConst } from 'qmkit';
import { fromJS } from 'immutable';
import SelectedGoodsGrid from '../../pageclass-addtl/components/selected-goods-grid';
import GoodsModal from '../../pageclass-addtl/components/modoul/goods-modal';
import StoreModal from './storeModal.tsx';
const FormItem = Form.Item;
const { Option } = Select;

const NumBox = styled.div`
  .chooseNum .has-error .ant-form-explain {
    margin-left: 90px;
  }
`;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const FILE_MAX_SIZE = 5 * 1024 * 1024;
// @Relax
export default class RegisteredAddForm extends React.Component<any, any> {
  // props;
  props: {
    form?: any;
    relaxProps?: {
      // 退货说明
      description: any;
      // 附件信息
      images: any;
      editItem: Function;
      editImages: Function;
    };
  };
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];

    this.state = {
      selectedSkuIds: [],
      // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
      selectedRows: fromJS([]),
      fullGiftLevelList: props.fullGiftLevelList ? props.fullGiftLevelList : [], // 规则长度
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      // 商家广告位列表Modal visible
      storeVisible: false,
      // 选中的商家广告位
      selectStoreRows: []
    };
  }
  static relaxProps = {
    // 退货说明
    description: 'description',
    // 附件信息
    images: 'images'
  };
  componentWillReceiveProps(nextpops) {
    console.log(
      this._store.state().get('activity').toJS(),
      'activityactivity132456'
    );
    const actvie = this._store.state().get('activity').toJS();
    const ids = actvie.selectedRows.map((item) => item.pageCode);
    console.log(ids, 'idsidsids');
    this.setState({
      selectedRows: fromJS(actvie.selectedRows),
      goodsModal: {
        _selectedRows: actvie.selectedRows,
        _selectedSkuIds: ids
      }
    });
  }

  render() {
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    console.log(activity.toJS(), '55555');
    const isSuit = activity.get('jumpLink').toJS().isSuit
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    const images = store.state().get('images').toJS();
    const imageUrl = store.state().get('activity').get('imageUrl');
    const { getFieldDecorator } = form;
    const { skuExists, selectedRows, storeVisible, selectStoreRows } =
      this.state;
    const wareId = store.state().get('activity').get('wareId');
    const dateNum = store.state().get('activity').get('dateNum');
    const activityTitle = store.state().get('activity').get('activityTitle');
    const dateType = store.state().get('activity').get('dateType')
      ? store.state().get('activity').get('dateType').toString()
      : '';
    const columns = [
      {
        title: '图片',
        dataIndex: 'img',
        key: 'img',
        render: (text, record) => {
          return record.advertisingConfigList.map((item, index) => {
            return item.advertisingImage ? (
              <img
                src={item.advertisingImage}
                key={index}
                style={styles.imgItem}
              />
            ) : (
              ''
            );
          });
        }
      },
      {
        title: '名称',
        dataIndex: 'advertisingName',
        key: 'advertisingName'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          if (record.advertisingType == 0) {
            return '通栏推荐位';
          } else if (record.advertisingType == 1) {
            return '分栏推荐位';
          } else {
            return '轮播推荐位';
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Button type="link" onClick={() => this.delSelectStore(record)}>
            删除
          </Button>
        )
      }
    ];
    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label="序号">
            {getFieldDecorator('sortNum', {
              rules: [
                {
                  required: true,
                  message: '请填写序号'
                }
              ],
              onChange: (e) => {
                store.changeFormField({ sortNum: e });
              },
              initialValue: activity.get('sortNum')
            })(
              <InputNumber
                min={0}
                precision={0}
                placeholder="请输入序号"
                style={{ width: 360 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('advertisingName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写活动名称'
                },
                { min: 1, max: 40, message: '活动名称不超过40个字符' }
              ],
              onChange: (e) => {
                store.changeFormField({ advertisingName: e.target.value });
              },
              initialValue: activity.get('advertisingName')
            })(<Input placeholder="请输入活动名称" style={{ width: 360 }} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="通栏图片">
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl,
              rules: [
                {
                  required: true,
                  message: '请上传通栏图片'
                }
              ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  fileList={images}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您通栏图片上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="跳转页面">
            {/* 设置为套装功能跳转 改 是否跳转 10-07 */}
            {getFieldDecorator('isSuit', {
              initialValue: isSuit ? isSuit : 0
            })(
              <Radio.Group
                onChange={(e) => {
                  store.changeFormField({
                    jumpLink: {
                      isSuit: e.target.value
                    }
                  });
                  if (e.target.value === 5) {
                    store.changeFormField({ dateNum: '' });
                    store.changeFormField({ dateType: '1' });
                  }
                }}
              >
                <Radio value={0}>海报页</Radio>
                <Radio value={3}>拆箱散批</Radio>
                <Radio value={2}>直播列表</Radio>
                <Radio value={4}>促销商家</Radio>
                <Radio value={5}>新入驻商家</Radio>
                <Radio value={6}>商家广告位</Radio>
                <Radio value={1}>不跳转</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {isSuit == 0 ? (
            <React.Fragment>
              <FormItem {...formItemLayout} label="跳转链接" required={true}>
                {getFieldDecorator(
                  'jumpLink',
                  {}
                )(
                  <div>
                    <div style={{ display: 'flex' }}>
                      <Button
                        type="primary"
                        icon="plus"
                        onClick={this.openGoodsModal}
                      >
                        添加跳转链接
                      </Button>
                      &nbsp;&nbsp;
                      <div>只能添加1个添加跳转链接</div>
                    </div>
                    <SelectedGoodsGrid
                      selectedRows={selectedRows}
                      skuExists={skuExists}
                      itmelist={[]}
                      deleteSelectedSku={this.deleteSelectedSku}
                      cheBOx={this.cheBOx}
                      purChange={this.purChange}
                    />
                  </div>
                )}
              </FormItem>
            </React.Fragment>
          ) : (
            ''
          )}
          {isSuit === 5 && (
            <FormItem {...formItemLayout} label="入驻时间">
              {getFieldDecorator('dateNum', {
                initialValue: dateNum || '',
                rules: [
                  { required: true, message: '请填写入驻时间' },
                  {
                    pattern: ValidConst.sortNum,
                    message: '请输入0-999的数字'
                  }
                ],
                onChange: (e) => {
                  store.changeFormField({ dateNum: e.target.value });
                }
              })(
                <Input
                  style={{ width: 200 }}
                  addonAfter={
                    <Select
                      style={{ width: 60 }}
                      value={dateType}
                      onChange={(value) =>
                        store.changeFormField({ dateType: value })
                      }
                    >
                      <Option value="1">天</Option>
                      <Option value="2">月</Option>
                    </Select>
                  }
                />
              )}
              <span style={{ paddingLeft: '10px', color: 'red' }}>
                内成功入驻的商家定义为新入驻商家
              </span>
            </FormItem>
          )}

          {/* <FormItem {...formItemLayout} label="跳转链接">
            {getFieldDecorator('jumpLink', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写跳转链接'
                },
              ],
              onChange: (e) => {
                store.changeFormField({ jumpLink: e.target.value });
              },
              initialValue: activity.get('jumpLink')
            })(<Input placeholder='请输入跳转链接' style={{ width: 360 }} />)}
          </FormItem> */}
          {/* 
          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator('coupons', {})(
              <ChooseCoupons
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  store.onChosenCoupons(coupons);
                  this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId) => {
                  store.onDelCoupon(couponId);
                  this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount) =>
                  store.changeCouponTotalCount(index, totalCount)
                }
                type={3}
              />
            )}
          </FormItem> */}

          {isSuit === 6 && (
            <React.Fragment>
              <FormItem {...formItemLayout} label="页面标题">
                {getFieldDecorator('activityTitle', {
                  initialValue: activityTitle || '',
                  rules: [{ required: true, message: '请填写页面标题' }],
                  onChange: (e) => {
                    store.changeFormField({ activityTitle: e.target.value });
                  }
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="跳转链接" required={true}>
                <div>
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="primary"
                      icon="plus"
                      onClick={this.openStoreModal}
                    >
                      添加跳转链接
                    </Button>
                  </div>
                  <Table
                    dataSource={selectStoreRows}
                    columns={columns}
                    rowKey="advertisingId"
                    pagination={false}
                  />
                </div>
              </FormItem>
            </React.Fragment>
          )}

          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button
                onClick={() => this._onSave()}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>取消</Button>
            </Col>
          </Row>
        </Form>
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          // marketingId={marketingId}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          searchForm={{ wareId: wareId }}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
        <StoreModal
          storeVisible={storeVisible}
          selectStoreRows={selectStoreRows}
          closeStoreModal={this.closeStoreModal}
          storeSelectBackFun={this.storeSelectBackFun}
        />
      </NumBox>
    );
  }

  // 编辑时初始化已选中的商家广告位数据
  initSelectStore = (rows) => {
    this.setState({ selectStoreRows: rows });
  };

  // 打开商家广告位选择modal
  openStoreModal = () => {
    this.setState({ storeVisible: true });
  };
  // 关闭商家广告位选择modal
  closeStoreModal = () => {
    this.setState({ storeVisible: false });
  };
  // 商家广告位modal回调
  storeSelectBackFun = (rows) => {
    this.setState({ selectStoreRows: rows });
    this.closeStoreModal();
  };
  // 删除选中的商家广告位
  delSelectStore = (record) => {
    const { selectStoreRows } = this.state;
    const newRows = selectStoreRows.filter(
      (item) => item.advertisingId !== record.advertisingId
    );
    this.setState({ selectStoreRows: newRows });
  };

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;
    // selectedRows.toJS().forEach((item) => {
    //   if (selectedSkuIds.indexOf(item.goodsInfoId) == -1) {
    //     selectedSkuIds.push(item.marketingVO ? item.marketingVO.goodsInfoId : item.goodsInfoId)
    //   }
    // })

    // console.log(
    //   selectedSkuIds,
    //   selectedRows.toJS(),
    //   'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    // );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };
  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    console.log('99999999999999----删除', skuId);
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    const store = this._store as any;

    store.changeFormField({
      jumpLink: {}
    });
    store.changeFormField({
      selectedRows: []
    });
    // console.log(selectedSkuIds, '这是什么', selectedSkuIds.findIndex((item) => item == skuId))
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('pageCode') == skuId)
      )
    });
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    console.log(
      selectedSkuIds,
      selectedRows.toJS(),
      'selectedSkuIds, selectedRows'
    );
    const store = this._store as any;

    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
    const activity = store.state().get('activity');
    console.log(activity.toJS(), '55555');
    const isSuit = activity.get('jumpLink').toJS()
      ? activity.get('jumpLink').toJS().isSuit
      : 0;
    if (selectedSkuIds.length > 0) {
      store.changeFormField({
        jumpLink: {
          isSuit,
          title: selectedRows.toJS()[0].title,
          pageCode: selectedRows.toJS()[0].pageCode
        }
      });
      store.changeFormField({
        selectedRows: [
          {
            title: selectedRows.toJS()[0].title,
            pageCode: selectedRows.toJS()[0].pageCode
          }
        ]
      });
      this.setState({
        selectedSkuIds,
        selectedRows,
        goodsModal: { _modalVisible: false }
      });
      console.log('electedSkuIds, selectedRows', selectedRows.toJS());
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
  };
  purChange = (value, id) => {
    console.log('====================================');
    console.log(value, 'valuevalue');
    console.log('====================================');
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.purchaseNum = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  cheBOx = (id) => {
    console.log(id, '22222222222222');
    const { selectedRows } = this.state;
    console.log(selectedRows.toJS(), '66666666666666');
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.checked = !e.checked;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过5M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    const store = this._store as any;
    store.editImages(fromJS(fileList));
  };

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const { selectStoreRows } = this.state;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs, values) => {
      if (!errs) {
        if (values.isSuit === 6 && selectStoreRows.length < 1) {
          message.error('请选择至少一个跳转链接');
          return;
        }
        // 3.验证通过，保存
        store.save(selectStoreRows);
      }
    });
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };
}
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  } as any,

  avatar: {
    width: 150,
    height: 150
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  } as any,
  imgPlus: {
    width: 88,
    height: 88,
    border: '1px solid #eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  imgItem: {
    width: '90px',
    height: '80px',
    padding: ' 5px',
    border: '1px solid #ddd',
    float: 'left',
    marginRight: '10px',
    background: '#fff',
    borderRadius: '3px'
  }
};
