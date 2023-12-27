import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Icon,
  Card,
  message,
  DatePicker 
} from 'antd';
import moment from 'moment';
import { noop,  QMUpload,Tips,history,Const } from 'qmkit';
import { fromJS } from 'immutable';
import { Relax } from 'plume2';
import SelectedGoodsGrid from './selected-goods-grid';
import {LsGoodsModal } from 'biz';
import { datePickerOptions } from 'src/points-setting/date-picker';
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const { MonthPicker, RangePicker } = DatePicker;
@Relax
export default class Fromsa extends Component<any, any> {
  static relaxProps = {
    goodsModalVisible:'goodsModalVisible',
    imageList:'imageList',
    formData:'formData',
    chooseSkuIds:'chooseSkuIds',
    goodsRows:'goodsRows',
    tiem:'tiem',
    query:'query',
    onCancelBackFun:noop,
    onOkBackFun:noop,
    onFormBut:noop,
    columnsBut:noop,
    configVOSBut:noop,
    onstartChange:noop
  };
  state = {
    value:null,
    images:[],
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.relaxProps.columnsBut()
      }
    });
  };
  validateTiem =(rule, value, callback)=>{
    
  };
  render() {
    const { goodsModalVisible,onFormBut,imageList,query,
      onCancelBackFun,formData,chooseSkuIds,tiem,onstartChange,goodsRows
     } = this.props.relaxProps;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    const { getFieldDecorator } = this.props.form;
    function disabledDate(current) {
      return current && current < moment().startOf('day');
      // return current && current < moment().endOf('day');
    }
    
    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItem label="名称">
          {getFieldDecorator('hotName', { 
              initialValue: formData.get('hotName'),
              onChange: (e) => {
                onFormBut('hotName', e.target.value);
              },
              rules: [
                { required: true, message: '名称不能为空', whitespace: true }
              ]
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          <FormItem label="起止时间">
          {getFieldDecorator('tiem', { 
              initialValue: tiem.toJS(),
              onChange: (e,t) => {
                console.log(e)
                console.log(t)
                onstartChange('tiem', fromJS(t));
              },
              onCalendarChange:(e)=>{
                console.log(e)
              },
              rules: [
                { required: true, message: '时间不能为空' },
                // {validator:(rule, value:any, callback)=>{
                //   // console.log(rule)
                //   console.log(tiem.toJS())
                //   console.log(value)
                //   if(value){
                //     let m2  = moment(value[0]._i||value[0])
                //     let m1= moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
                //     console.log(m2,m1)
                //     console.log(m2.diff(m1,'second'))
                //     if(m2.diff(m1,'second')<=3000){
                //       callback('开始时间不能小于当前时间且须大于当前时间一小时');
                //     }
                //   }
                //   callback();
                // },required: true}
              ]
            })(
              <RangePicker
                disabledDate={disabledDate}
                // defaultValue={tiem.toJS()}
                showTime={{
                  // hideDisabledOptions: true,
                  defaultValue: [moment('00.00.00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            )}
          </FormItem>
          <FormItem label="详情页面banner">
          {getFieldDecorator('bannerImageUrl', { 
              initialValue: formData.get('bannerImageUrl'),
              rules: [
                { required: true, message: '图片不能为空' }
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
                      fileList={imageList.toJS()}
                      listType={'picture-card'}
                      accept={'.jpg,.jpeg,.png,.gif'}
                      beforeUpload={this._checkUploadFile}
                    >
                      {imageList.toJS().length < 1 ? (
                        <Icon type="plus" style={styles.plus} />
                      ) : null}
                    </QMUpload>
                    <Tips title="请将您通栏图片上传,建议尺寸：710*296，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
              </div>
            )}
            
           </FormItem>
           <FormItem label='商品列表'>
                 {getFieldDecorator('chooseSkuIds', {
                     initialValue: chooseSkuIds,
                     rules: [{ required: true, message: '请选择商品' }]
                   })(<SelectedGoodsGrid  />)}
             </FormItem>
            <FormItem labelAlign="right">
              <Button onClick={()=>history.goBack()}> {query.type!='dis'?'取消':'返回'} </Button>
              {query.type!='dis'?
                <Button style={styles.maLeft} type="primary" htmlType="submit">保存</Button>
                :''
              }
            </FormItem>
        </Form>
        <div style={{width: '100%'}}>
          <LsGoodsModal
            limitNOSpecialPriceGoods={true}
            showValidGood={true}
            isCouponList={12}
            visible={goodsModalVisible}
            selectedSkuIds={chooseSkuIds.toJS()}
            selectedRows={goodsRows.toJS()}
            onOkBackFun={this._onOkBackFun}
            onCancelBackFun={onCancelBackFun}
          />
        </div>
      </div>
    );
  }
  _onOkBackFun = (skuIds, rows) => {
    // this.props.form.setFieldsValue({
    //   chooseSkuIds: skuIds
    // });
    // console.log(this.props.type);
    this.props.relaxProps.onOkBackFun(skuIds,fromJS(rows));
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
      let list=fileList.length?fileList.slice(-1):[];
      if (file.status == 'error') {
        message.error('上传失败');
        this.props.relaxProps.onstartChange('imageList',fromJS([]));
        return
      }
      if(file.status=='removed'){
        this.props.relaxProps.onstartChange('imageList',fromJS([]));
        this.props.relaxProps.onFormBut('bannerImageUrl','');
      }
      if(file.status=='done'){
        this.props.relaxProps.onstartChange('imageList',fromJS(list));
        this.props.relaxProps.onFormBut('bannerImageUrl',list[0].response.join());
      }
      if(file.status="uploading"){
        this.props.relaxProps.onstartChange('imageList',fromJS(list));
      }
     
    };
}
const styles = {
  margins: {
    marginBottom: 10
  } as any,
  maLeft: {
    marginLeft: 10
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
