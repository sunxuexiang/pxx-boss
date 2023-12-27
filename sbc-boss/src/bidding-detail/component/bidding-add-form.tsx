import * as React from 'react';
import SelectedGoodsGrid from './selected-goods-grid';

import {
  Button,
  Col,
  DatePicker,
  Form,
  message,
  Row,
  Select,
  TreeSelect,
  Tree
} from 'antd';
import { Const, history, noop, QMMethod, ValidConst } from 'qmkit';
import moment from 'moment';

import * as webapi from '../webapi';
import { IList, IMap } from '../../../typings/globalType';
import { GoodsBiddingModal } from 'biz';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

export default class BiddingAddForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
      chooseSkuIds: IList;
      loading: boolean;
      goodsModalVisible: boolean;
      goodsRows: IList;
      onCancelBackFun: Function;
      onOkBackFun: Function;
      onSave: Function;
      addFlag: boolean;
      biddingType: number;
      cateList: IList;

      sortModalFunction: Function;
      setSortGoodsInfo: Function;
    };
  };

  static relaxProps = {
    chooseSkuIds: 'chooseSkuIds',
    loading: 'loading',
    formData: 'formData',
    editFormData: noop,
    goodsModalVisible: 'goodsModalVisible',
    goodsRows: 'goodsRows',
    addFlag: 'addFlag',
    onCancelBackFun: noop,
    onOkBackFun: noop,
    onSave: noop,
    biddingType: 'biddingType',
    cateList: 'cateList',

    sortModalFunction: noop,
    setSortGoodsInfo: noop
  };

  state = {
    currentTime: null
  };

  render() {
    const {
      formData,
      editFormData,
      loading,
      goodsModalVisible,
      chooseSkuIds,
      goodsRows,
      onCancelBackFun,
      addFlag,
      biddingType,
      cateList
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const keywordsList = formData.get('keywords')
      ? formData.get('keywords').split(',')
      : [];
    const cateWordsList =
      (keywordsList &&
        keywordsList.map((id) => {
          return { value: id };
        })) ||
      [];
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          // 一二级类目不允许选择
          return (
            <TreeNode
              key={item.get('cateId')}
              disabled={true}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
        {biddingType ? (
          <FormItem {...formItemLayout} label="分类">
            {getFieldDecorator('keywords', {
              initialValue: cateWordsList,
              rules: [
                { required: true, message: '请选择分类' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorCateWords(rule, value, callback);
                  }
                }
              ],
              onChange: this.storeCateChange
            })(
              <TreeSelect
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                treeCheckable={true}
                showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                treeCheckStrictly={true}
                placeholder="请选择分类"
                notFoundContent="暂无分类"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                showSearch={false}
                disabled={true}
              >
                {loop(cateList)}
              </TreeSelect>
            )}
          </FormItem>
        ) : (
          <FormItem {...formItemLayout} label="关键字">
            {getFieldDecorator('keywords', {
              initialValue: keywordsList,
              rules: [
                { required: true, message: '请输入关键字' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorKeyWords(rule, value, callback);
                  }
                }
              ]
            })(
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                mode="tags"
                style={{ width: '50%' }}
                placeholder="请输入关键字"
                tokenSeparators={[',']}
                onChange={(value) => this.editFormKeyWords(value)}
                disabled={true}
              />
            )}
          </FormItem>
        )}

        <FormItem {...formItemLayout} label="起止时间">
          {getFieldDecorator('time', {
            rules: [
              { required: true, message: '请选择起止时间' },
              {
                validator: (_rule, value, callback) => {
                  if (
                    value &&
                    moment(new Date())
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .unix() > value[0].unix()
                  ) {
                    callback('开始时间不能早于现在');
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                editFormData({
                  key: 'startTime',
                  value: dateString[0] + ':00'
                });
                editFormData({
                  key: 'endTime',
                  value: dateString[1] + ':00'
                });
              }
            },
            initialValue: formData.get('startTime') &&
              formData.get('endTime') && [
                moment(formData.get('startTime')),
                moment(formData.get('endTime'))
              ]
          })(
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format={Const.DATE_FORMAT}
              placeholder={['起始时间', '结束时间']}
              showTime={{ format: 'HH:mm' }}
              disabled={true}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="选择商品"
          style={{ width: '100%' }}
        >
          {this.chooseGoods().dom}
        </FormItem>
        <Row type="flex" justify="start">
          <Col span={3} />
          <Col span={10}>
            <Button onClick={() => history.push('/bidding')}>返回</Button>
          </Col>
        </Row>
        <GoodsBiddingModal
          showValidGood={true}
          // 是否仅勾选上架商品
          checkAddedGood={false}
          visible={goodsModalVisible}
          selectedSkuIds={chooseSkuIds.toJS()}
          selectedRows={goodsRows.toJS()}
          skuLimit={keywordsList.length}
          onOkBackFun={this._onOkBackFun}
          onCancelBackFun={onCancelBackFun}
          companyType={3}
        />
      </Form>
    );
  }

  editFormKeyWords = (value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key: 'keywords', value: value.toString() });
  };

  handleEndOpenChange = (open) => {
    if (open) {
      this.setState({ currentTime: moment() });
    }
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.currentTime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  /**
   * 修改店铺分类
   */
  storeCateChange = (value, _label, extra) => {
    const { editFormData } = this.props.relaxProps;
    const chooseCateIds = value.map((v) => {
      return v.value;
    });
    editFormData({ key: 'keywords', value: chooseCateIds.toString() });
  };

  /**
   * 提交方法
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    let {
      chooseSkuIds,
      onSave,
      formData,
      goodsRows,
      cateList
    } = this.props.relaxProps;
    let errorObject = {};
    const { form } = this.props;
    form.resetFields();
    form.validateFieldsAndScroll((err) => {
      if (Object.keys(errorObject).length != 0) {
        form.setFields(errorObject);
        this.setState({ loading: false });
      } else {
        if (!err) {
          const biddingId = formData.get('biddingId');
          const keywords = formData.get('keywords').split(',');
          if (keywords.length < chooseSkuIds.toJS().length) {
            message.error(`最多添加${keywords.length}个商品`);
            return;
          }
          this.setState({ loading: true });
          //1.后台校验重复关键字
          webapi
            .validateKeywords({
              keywords: keywords,
              biddingId: biddingId
            })
            .then(({ res }) => {
              if (res.code == Const.SUCCESS_CODE) {
                const repeatKeyword = res.context.validateResult;
                if (repeatKeyword.length > 0) {
                  if (ValidConst.noChinese.test(repeatKeyword[0])) {
                    //分类
                    const cate = cateList
                      .filter((c) => c.get('cateId') === repeatKeyword[0])
                      .first();
                    message.error(
                      `${cate.get('cateName')} 已选择，重新选择分类`
                    );
                  } else {
                    //关键词
                    message.error(
                      `${repeatKeyword.toString()} 已存在，请删除后再保存`
                    );
                  }
                } else {
                  //2.商品已经选择 + 时间已经选择 => 判断  竞价活动下，商品是否重复
                  webapi
                    .validateGoods({
                      goodsInfoIds: chooseSkuIds,
                      biddingId: biddingId
                    })
                    .then(({ res }) => {
                      if (res.code == Const.SUCCESS_CODE) {
                        if (res.context.validateResult.length > 0) {
                          const repeatSkuId = res.context.validateResult[0];
                          const goodsInfo = goodsRows
                            .filter((g) => g.get('goodsInfoId') == repeatSkuId)
                            .first();
                          message.error(
                            `${goodsInfo.get(
                              'goodsInfoName'
                            )} 商品活动时间冲突，请删除后再保存`
                          );
                          this.setState({ loading: false });
                        } else {
                          onSave();
                        }
                      }
                    });
                }
              }
            });
        }
      }
    });
  };

  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const { chooseSkuIds } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return {
      dom: getFieldDecorator('chooseSkuIds', {
        initialValue: chooseSkuIds.toJS(),
        rules: [{ required: true, message: '请选择商品' }]
      })(<SelectedGoodsGrid form={this.props.form} />)
    };
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    this.props.form.resetFields('goods');
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows,
      goodsModal: { _modalVisible: false }
    });
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    const { onOkBackFun, editFormData } = this.props.relaxProps;

    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    editFormData({ key: 'goodsInfoIds', value: skuIds });
    onOkBackFun(skuIds, rows);
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
}
