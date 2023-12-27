import React from 'react';
import { Relax } from 'plume2';
import { InputNumber, Form, Modal, message } from 'antd';
import { noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

@Relax
export default class SortModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      sortModalShow: boolean;
      sortInfo: IMap;

      formData: IMap;
      editFormData: Function;
      onSave: Function;

      sortModalFunction: Function;
      chooseSkuIds: IList;
      setSortGoodsInfo: Function;
      saveSortInfo: Function;
      index: number;
    };
  };

  static relaxProps = {
    sortModalShow: 'sortModalShow',
    sortInfo: 'sortInfo',
    saveSortInfo: noop,

    formData: 'formData',
    editFormData: noop,
    onSave: noop,
    index: 'index',
    sortModalFunction: noop,
    chooseSkuIds: 'chooseSkuIds',
    setSortGoodsInfo: noop
  };

  render() {
    const {
      formData,
      sortModalShow,
      chooseSkuIds,
      setSortGoodsInfo,
      index
    } = this.props.relaxProps;
    if (!sortModalShow) {
      return null;
    }

    const kewords = formData.get('keywords').split(',');
    const chooseSkuNum = chooseSkuIds ? chooseSkuIds.toJS().length : 0;
    const max = kewords.length > chooseSkuNum ? kewords.length : chooseSkuNum;
    const sort = index;
    return (
      <Modal
        title={'设置排序值'}
        width={300}
        maskClosable={false}
        visible={sortModalShow}
        onCancel={this._onCancel}
        onOk={this._onOk}
      >
        <div style={{ textAlign: 'center', marginLeft: -60 }}>
          <span style={{ marginRight: 10 }}>
            <span style={{ color: 'red' }}>*</span>排序:
          </span>
          <InputNumber
            required={true}
            defaultValue={sort}
            max={max}
            onChange={(value) => {
              setSortGoodsInfo({ key: 'sort', value: value });
            }}
          />
        </div>
      </Modal>
    );
  }

  /**
   * 提交表单
   */
  _onOk = () => {
    const { sortInfo, saveSortInfo } = this.props.relaxProps;
    const sort = sortInfo.get('sort');
    if (!sort) {
      message.error('请输入有效的排序值');
      return;
    }
    if (sort <= 0) {
      message.error('请输入有效的排序值');
      return;
    }
    if (!(typeof sort === 'number' && sort % 1 === 0)) {
      message.error('请输入有效的排序值');
      return;
    }
    saveSortInfo();
  };

  /**
   * 关闭弹框
   */
  _onCancel = () => {
    const { sortModalFunction } = this.props.relaxProps;
    sortModalFunction(false);
  };
}
