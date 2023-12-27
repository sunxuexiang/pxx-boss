import * as React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Icon,
  message,
  DatePicker,
  Radio
} from 'antd';
import PropTypes from 'prop-types';
import { Store, Relax } from 'plume2';
import styled from 'styled-components';
import { Const, history, QMMethod, ValidConst, QMUpload, Tips } from 'qmkit';
import moment from 'moment';
import { fromJS } from 'immutable';
import SelectedGoodsGrid from '../../pageclass-addtl/components/selected-goods-grid';
import { SketchPicker } from 'react-color';

import GoodsModal from '../../pageclass-addtl/components/modoul/goods-modal';
import reactCSS from 'reactcss';

const FormItem = Form.Item;


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
      allSubjectColorPicker: false,
      tagButtonColorPicker: false
    }
  }
  static relaxProps = {
    // 退货说明
    description: 'description',
    // 附件信息
    images: 'images',
  }
  componentWillReceiveProps(nextpops) {
    // console.log(this._store.state().get('activity').toJS(), 'activityactivity132456');
    const actvie = this._store.state().get('activity').toJS();
    const ids = actvie.selectedRows.map((item) => item.pageCode);
    // console.log(ids, 'idsidsids')
    this.setState({
      selectedRows: fromJS(actvie.selectedRows), goodsModal: {
        _selectedRows: actvie.selectedRows,
        _selectedSkuIds: ids
      }
    })
  }

  render() {
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    console.log(activity.toJS(), '55555');
    const isSuit = activity.get('jumpLink').toJS().isSuit ? activity.get('jumpLink').toJS().isSuit : 0;
    const tiem = activity.get('tiem') ? activity.get('tiem') : 0;
    const images = store.state().get('images').toJS();
    const imageUrl = store.state().get('activity').get('imageUrl');
    const { getFieldDecorator } = form;
    const { skuExists, selectedRows } = this.state;
    const tagButtonColor = activity.get('tagButtonColor');
    const allSubjectColor = activity.get('allSubjectColor');



    const styles = reactCSS({
      default: {
        allSubjectColor: {
          background: allSubjectColor
        },
        tagButtonColor: {
          background: tagButtonColor
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          left: '15px',
          top: '-320px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });

    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label=" 名称">
            {getFieldDecorator('advertisingName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写名称'
                },
              ],
              onChange: (e) => {
                store.changeFormField({ advertisingName: e.target.value });
              },
              initialValue: activity.get('advertisingName') + ''
            })(
              <Input
                placeholder="请输入名称"
                style={{ width: 360 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="是否设置跳转链接">
            {getFieldDecorator('isSuit', {
              initialValue: isSuit ? isSuit : 0
            })(<Radio.Group onChange={(e) => {
              store.changeFormField({
                jumpLink: {
                  isSuit: e.target.value,
                }
              });
            }}
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>)}
          </FormItem>

          <FormItem {...formItemLayout} label="启动页图片">
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl,
              rules: [
                {
                  required: true,
                  message: '请上传启动页图片'
                }
              ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages}
                  action={
                    Const.HOST + '/uploadResource?resourceType=IMAGE'
                  }
                  fileList={images}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images.length < 1 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将启动页图片上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
          </FormItem>



          {
            isSuit == 1 ? <React.Fragment>
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
            </React.Fragment> : ''
          }

          <FormItem
            {...formItemLayout}
            required={true}
            label="启动页背景色号"
            hasFeedback
          >
            <Row>
              <Col span={24}>
                <div className="clearfix item-bg-edit">
                  <span
                    className="bj-color"
                    style={styles.allSubjectColor}
                    onClick={() => this.handleBjClick('allSubjectColor')}
                  />
                  <span
                    className="colorSetting"
                    onClick={() => {
                      store.changeFormField({ allSubjectColor: '#f7f7f7' });
                    }
                    }
                  >
                    重置
                  </span>
                  {this.state.allSubjectColorPicker && (
                    <div style={styles.popover}>
                      <div
                        style={styles.cover}
                        onClick={() => this.handleBjClose('allSubjectColor')}
                      />
                      <SketchPicker
                        color={allSubjectColor}
                        onChange={(c) =>
                          this.handleBjChange(c, 'allSubjectColor')
                        }
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="生效时间">
            {getFieldDecorator('tiem', {
              initialValue: tiem ? tiem : 0
            })(<Radio.Group onChange={(e) => {
              store.changeFormField({ tiem: e.target.value });
            }}
            >
              <Radio value={0}>立即生效</Radio>
              <Radio value={1}>固定时间</Radio>
            </Radio.Group>)}
          </FormItem>
          {
            tiem == 1 && <FormItem {...formItemLayout} label="发放时间">
              {getFieldDecorator('effectDate', {
                rules: [
                  { required: true, message: '请选择发放时间' },
                  {
                    validator: (_rule, value, callback) => {
                      if (
                        value &&
                        moment()
                          .add(-5, 'minutes')
                          .second(0)
                          .unix() > moment(value).unix()
                      ) {
                        callback('发放时间不能早于现在');
                      } else {
                        callback();
                      }
                    }
                  }
                ],
                onChange: (date, dateString) => {
                  if (date) {
                    console.log(dateString, 'dateStringdateString');

                    store.changeFormField({
                      effectDate: dateString
                    });
                  }
                },
                initialValue: activity.get('effectDate')
                  ? moment(activity.get('effectDate'))
                  : null
              })(
                <DatePicker
                  getCalendarContainer={() =>
                    document.getElementById('page-content')
                  }
                  allowClear={false}
                  disabledDate={(current) => {
                    return (
                      (current && current < moment().add(-1, 'minutes')) ||
                      (current && current > moment().add(3, 'months'))
                    );
                  }}
                  // format={Const.DATE_FORMAT}
                  placeholder={'发放时间'}
                // showTime={{ defaultValue: moment('HH:mm:ss') }}
                />
              )}
            </FormItem>
          }
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
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
      </NumBox>
    );
  }
  // 打开颜色卡
  handleBjClick = (type) => {
    if (type == 'allSubjectColor') {
      this.setState({
        allSubjectColorPicker: !this.state.allSubjectColorPicker
      });
    } else {
      this.setState({ tagButtonColorPicker: !this.state.tagButtonColorPicker });
    }
  };
  // 选中颜色
  handleBjChange = (color, type) => {
    const hex = color.hex;
    const store = this._store as any;
    // const colorRGBA =
    //   'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
    store.changeFormField({ allSubjectColor: hex });
  };
  // 关闭颜色卡
  handleBjClose = (type) => {
    if (type == 'allSubjectColor') {
      this.setState({ allSubjectColorPicker: false });
    } else {
      this.setState({ tagButtonColorPicker: false });
    }
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
    console.log('99999999999999----删除', skuId)
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
    const isSuit = activity.get('jumpLink').toJS() ? activity.get('jumpLink').toJS().isSuit : 0
    if (selectedSkuIds.length > 0) {
      store.changeFormField({
        jumpLink: {
          isSuit,
          title: selectedRows.toJS()[0].title,
          pageCode: selectedRows.toJS()[0].pageCode
        }
      });
      store.changeFormField({
        selectedRows: [{
          title: selectedRows.toJS()[0].title,
          pageCode: selectedRows.toJS()[0].pageCode
        }]
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
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs) => {
      if (!errs) {
        // 3.验证通过，保存
        store.save();
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
  }
};
