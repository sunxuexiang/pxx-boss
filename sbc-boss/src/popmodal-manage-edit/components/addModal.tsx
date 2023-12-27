import React from 'react';
import { Relax } from 'plume2';
import { noop, AuthWrapper, Const } from 'qmkit';
import { message, Row, Col, Button } from 'antd';
import moment from 'moment';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';
import PropTypes from 'prop-types';
const bgImg = require('../img/bg.png');
const modalClose = require('../img/modal-close.png');
const tuozhuai = require('../img/tuozhuai.png');
const FILE_MAX_SIZE = 500 * 1024;

const SortItem = SortableElement(({ children }) => children);
const LargeImgList = SortableContainer(({ children }) => {
  return <div className="">{children}</div>;
});

/**
 * 订单收款单列表
 */
@Relax
export default class AddModal extends React.Component<any, any> {
  _store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      popupName: '',
      launchFrequency: ''
    };
  }
  props: {
    modalName: '';
    relaxProps?: {
      loading: boolean;
      dataLists: [];
      submit;
      setSorLabel;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataLists: 'dataLists',
    submit: noop,
    setSorLabel: noop
  };

  render() {
    const { submit, dataLists } = this.props.relaxProps;
    return (
      <div>
        <Row>
          <Col span={8}>
            <div className="left-state">
              <img className="leftBg" src={bgImg} />
              <div className="leftModal">
                <div>
                  {dataLists.length > 0 && (
                    <img className="leftModalBg" src={dataLists[0].popupUrl} />
                  )}
                </div>
                <div className="modalClose">
                  <img src={modalClose} />
                </div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="right-state">
              <div className="title">{this.props.modalName}</div>
              <div className="form-state">
                <div className="from-title">当前弹窗页面</div>
                以下为当前页面进行中、未开始、暂停中的弹窗，你可通过拖拽排列优先级，为了保证用户体验，请勿同时设置超过2个弹窗，系统弹窗优先级最高。
              </div>
              <LargeImgList
                useWindowAsScrollContainer={true}
                axis="y"
                onSortEnd={this.onSortEnd}
                onSortStart={this.onSortStart}
              >
                {dataLists.map((v, index) => {
                  return (
                    <SortItem key={`item-${index}`} index={index}>
                      <div className="form-state">
                        <div className="modal-state-list">
                          <img className="modal-bg" src={v.popupUrl} />
                          <img className="modal-tz" src={tuozhuai} />
                          <div className="modal-state-list-desc">
                            <div className="modal-name">{v.popupName}</div>
                            <div className="modal-time">
                              {v.popupStatus == 1 && (
                                <div className="modal-tag tag-start">
                                  进行中
                                </div>
                              )}
                              {v.popupStatus == 2 && (
                                <div className="modal-tag tag-pause">
                                  暂停中
                                </div>
                              )}
                              {v.popupStatus == 3 && (
                                <div className="modal-tag tag-nostart">
                                  未开始
                                </div>
                              )}

                              <div className="modal-range">
                                {moment(v.beginTime).format(Const.TIME_FORMAT)}-
                                {moment(v.endTime).format(Const.TIME_FORMAT)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SortItem>
                  );
                })}
              </LargeImgList>

              <AuthWrapper functionName={'f_points_setting_edit'}>
                <div className="bar-button">
                  <Button
                    type="primary"
                    onClick={() => (location.href = '/popmodal-manage')}
                  >
                    保存
                  </Button>
                </div>
              </AuthWrapper>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    let _goodsinfo = this.props.relaxProps.dataLists as any;
    _goodsinfo = arrayMove(_goodsinfo, oldIndex, newIndex);
    this.props.relaxProps.setSorLabel(_goodsinfo);
  };

  onSortStart = (sort, event) => {};
  onChange = () => {};
  /**
   * 检查文件格式以及文件大小
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
        message.error('文件大小不能超过50KB');
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
      return;
    }
    if (file.status == 'done' || fileList.length == 0) {
      this._store.onChangeFile(fileList);
    }
  };
  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList.map((file) => {
      return {
        uid: file.uid,
        status: file.status,
        url: file.response ? file.response[0] : file.url
      };
    });
  };
}

const styles = {
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
