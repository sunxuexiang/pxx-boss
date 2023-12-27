import * as React from 'react';
import { Form, Input, Modal, Button, Alert } from 'antd';
import { Relax, Store } from 'plume2';
import { noop, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { fromJS, Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { msg } from 'plume2';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class PopularModal extends React.Component<any, any> {
  _store: Store;
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }
  props: {
    relaxProps?: {
      popularModalVisible: boolean;
      isAdd: boolean;
      popularModal: Function;
      popularFormData: IMap;
      editPopularFormData: Function;
      doPopularAdd: Function;
      onDataChange: Function;
      changePlatform: Function;
      dataInfo: IMap;
      dataInfoPC: IMap;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    popularModalVisible: 'popularModalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    popularFormData: 'popularFormData',
    popularModal: noop, // 关闭弹窗
    editPopularFormData: noop, //修改from表单数据
    doPopularAdd: noop,
    onDataChange: noop,
    changePlatform: noop,
    dataInfo: 'dataInfo',
    dataInfoPC: 'dataInfoPC'
  };

  render() {
    const { popularModalVisible, isAdd, onDataChange } = this.props.relaxProps;

    const WrapperForm = this.WrapperForm;
    if (!popularModalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={isAdd ? '新增热门搜索词' : '编辑热门搜索词'}
        visible={popularModalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <Alert
          style={{ marginBottom: 15 }}
          message=""
          description={
            <p>
              最多可添加20个热词，配置了落地页的搜索词，点击后会直接跳转页面
            </p>
          }
          type="info"
        />
        <WrapperForm
          ref={(form) => (this._form = form)}
          onDataChange={onDataChange}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { popularModal } = this.props.relaxProps;
    popularModal();
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.examine();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 校验一下
   */
  examine = () => {
    const { doPopularAdd } = this.props.relaxProps;
    doPopularAdd();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      popularFormData: IMap;
      editPopularFormData: Function;
      changePlatform: Function;
      dataInfo: IMap;
      dataInfoPC: IMap;
      linkHrefPath: IMap;
    };
    onDataChange;
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      popularFormData,
      editPopularFormData,
      dataInfo,
      dataInfoPC,
      linkHrefPath,
      changePlatform
    } = this.props.relaxProps;

    const name = popularFormData.get('popularSearchKeyword');
    // const dataInfo = popularFormData.get('relatedLandingPage')
    const { getFieldDecorator } = this.props.form;
    console.log(
      'dataInfo',
      dataInfo.toJS()
      // dataInfo.get('relatedLandingPage')
    );

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="搜索词" hasFeedback>
          {getFieldDecorator('popularSearchKeyword', {
            rules: [
              { required: true, whitespace: true, message: '仅限1-10位字符' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '搜索词');
                }
              }
            ],
            initialValue: name,
            onChange: (e) =>
              editPopularFormData(Map({ popularSearchKeyword: e.target.value }))
          })(<Input placeholder="请输入1-10位字符" />)}
        </FormItem>
        <Form.Item label={'移动端落地页'} {...formItemLayout}>
          {getFieldDecorator(
            'dataInfo',
            {}
          )(
            <Button
              type="primary"
              icon="plus"
              ghost
              onClick={() => {
                changePlatform('weixin');
                const pathArray = linkHrefPath;
                msg.emit('edit:chooseLink', {
                  option: {
                    // includeType: ['goodsList'], //只能选择商品列表信息.. 其他的关闭了.
                    // goodsLinkSupportAutoChecked: true //默认选中
                  },
                  otherInfo: {
                    // isDoublePlatformTpl: false, //是否是双平台模板
                    // platForm: 'pc' //pc || weixin
                  },
                  __data_info: dataInfo,
                  changeVal: (chooseInfo) => {
                    this._changeVal('dataInfo', pathArray, null, chooseInfo);
                  }
                });
              }}
            >
              选择落地页
            </Button>
          )}
          {dataInfo &&
            dataInfo.get('info') &&
            (dataInfo.get('info').get('name') !== undefined ||
              dataInfo.get('info').get('storeName') !== undefined ||
              dataInfo.get('info').get('pathName') !== undefined ||
              dataInfo.get('info').get('title') !== undefined ||
              (dataInfo.get('info').get('goods') &&
                dataInfo
                  .get('info')
                  .get('goods')
                  .get('goodsName') !== undefined) ||
              (dataInfo.get('info').get('goodsInfo') &&
                dataInfo
                  .get('info')
                  .get('goodsInfo')
                  .get('goodsInfoName') !== undefined) ||
              dataInfo.get('info').get('marketingName') !== undefined ||
              dataInfoPC.get('info').get('content') !== undefined ||
              dataInfo.get('info').get('cateName') !== undefined) && (
              <div style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                已选页面：{this._pageInfo(dataInfo)}
              </div>
            )}
        </Form.Item>

        <Form.Item label={'PC端落地页'} {...formItemLayout}>
          {getFieldDecorator(
            'dataInfoPC',
            {}
          )(
            <Button
              type="primary"
              icon="plus"
              ghost
              onClick={() => {
                changePlatform('pc');
                const pathArray = linkHrefPath;
                msg.emit('edit:chooseLink', {
                  option: {
                    // includeType: ['goodsList'], //只能选择商品列表信息.. 其他的关闭了.
                    // goodsLinkSupportAutoChecked: true //默认选中
                  },
                  otherInfo: {
                    // isDoublePlatformTpl: false, //是否是双平台模板
                    platForm: 'pc' //pc || weixin
                  },
                  __data_info: dataInfoPC,
                  changeVal: (chooseInfo) => {
                    this._changeVal('dataInfoPC', pathArray, null, chooseInfo);
                  }
                });
              }}
            >
              选择落地页
            </Button>
          )}
          {dataInfoPC &&
            dataInfoPC.get('info') &&
            (dataInfoPC.get('info').get('name') !== undefined ||
              dataInfoPC.get('info').get('storeName') !== undefined ||
              dataInfoPC.get('info').get('pathName') !== undefined ||
              dataInfoPC.get('info').get('title') !== undefined ||
              (dataInfoPC.get('info').get('goods') &&
                dataInfoPC
                  .get('info')
                  .get('goods')
                  .get('goodsName') !== undefined) ||
              (dataInfoPC.get('info').get('goodsInfo') &&
                dataInfoPC
                  .get('info')
                  .get('goodsInfo')
                  .get('goodsInfoName') !== undefined) ||
              dataInfoPC.get('info').get('marketingName') !== undefined ||
              dataInfoPC.get('info').get('content') !== undefined) && (
              <div style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                已选页面：{this._pageInfo(dataInfoPC)}
              </div>
            )}
        </Form.Item>
      </Form>
    );
  }

  // 替换props
  _changeVal = (field, pathArray, newVal, platFormValueMap) => {
    this.props.onDataChange(field, pathArray, newVal, platFormValueMap);
  };

  _pageInfo = (dataInfo) => {
    let platFormValueMap = dataInfo.toJS();
    let info = platFormValueMap.info;
    if (platFormValueMap.linkKey === 'goodsList') {
      return info.name && '商品' + ' > ' + unescape(info.name);
    } else if (platFormValueMap.linkKey === 'storeList') {
      return info.storeName && '店铺' + ' > ' + unescape(info.storeName);
    } else if (platFormValueMap.linkKey === 'categoryList') {
      let name = '';
      let pathName = info.pathName.split(',');
      pathName.map((v) => {
        name += ' > ' + v;
      });
      return info.pathName && '类目' + name;
    } else if (platFormValueMap.linkKey === 'pageList') {
      return info.title && '页面' + ' > ' + info.title;
    } else if (platFormValueMap.linkKey === 'userpageList') {
      return info.title && '常用功能' + ' > ' + info.title;
    } else if (platFormValueMap.linkKey === 'promotionList') {
      let cateKey = platFormValueMap.info.cateKey;
      if (cateKey === 'preOrder') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '预约' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'preSell') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '预售' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'groupon') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '拼团' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'flash') {
        return (
          info.goods.goodsName &&
          '营销' + ' > ' + '秒杀' + ' > ' + info.goods.goodsName
        );
      } else if (cateKey === 'full') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '满减/折/赠' + ' > ' + info.marketingName
        );
      } else if (cateKey === 'comBuy') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '组合购' + ' > ' + info.marketingName
        );
      } else if (cateKey === 'onePrice') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '打包一口价' + ' > ' + info.marketingName
        );
      } else if (cateKey === 'halfPrice') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '第二件半价' + ' > ' + info.marketingName
        );
      }
    } else if (platFormValueMap.linkKey === 'custom') {
      return info.content && '自定义' + ' > ' + info.content;
    } else if (platFormValueMap.linkKey === 'operationClassifyList') {
      return '运营分类目' + '>' + info.cateName;
    }
  };
}
