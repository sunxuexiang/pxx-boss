import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Icon,
  Card,
  message
} from 'antd';
import { noop,  QMUpload,Tips,history,Const } from 'qmkit';
import { fromJS } from 'immutable';
import { Relax } from 'plume2';
import SelectedGoodsGrid from './selected-goods-grid';
import {LsGoodsModal } from 'biz';
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
@Relax
export default class Fromsa extends Component<any, any> {
  static relaxProps = {
    goodsModalVisible:'goodsModalVisible',
    isType:'isType',
    formData:'formData',
    adTyle:'adTyle',
    onCancelBackFun:noop,
    onOkBackFun:noop,
    init: noop,
    onFormBut:noop,
    columnsBut:noop,
    configVOSBut:noop
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
  render() {
    const { goodsModalVisible,onFormBut,isType,
      onCancelBackFun,formData,adTyle
     } = this.props.relaxProps;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    const { getFieldDecorator } = this.props.form;
    const cnfList=formData.get('advertisingRetailConfigs');
    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItem label="名称">
          {getFieldDecorator('advertisingName', { 
              initialValue: formData.get('advertisingName'),
              onChange: (e) => {
                onFormBut('advertisingName', e.target.value);
              },
              rules: [
                { required: true, message: '名称不能为空', whitespace: true }
              ]
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          {
            formData.get('advertisingRetailConfigs').map((item,i)=>
            <Card size="small"  style={styles.margins} key={i}>
            <FormItem label={`${!i?'左':'右'}图`}>
              {getFieldDecorator(`advertisingImageUrl${i}`, { 
                  initialValue: item.advertisingImageUrl,
                  rules: [
                    { required: true, message: '图片不能为空' }
                  ]
                })(
                  <div>
                    <QMUpload
                     name="uploadFile"
                     style={styles.box}
                     onChange={(fileEntity)=>this._editImages({index:i,name:'imageList'},fileEntity)}
                     action={
                       Const.HOST + '/uploadResource?resourceType=IMAGE'
                     }
                     fileList={item.imageList}
                     listType={'picture-card'}
                     accept={'.jpg,.jpeg,.png,.gif'}
                     beforeUpload={this._checkUploadFile}
                   >
                     {item.imageList.length < 1 ? (
                       <Icon type="plus" style={styles.plus} />
                     ) : null}
                   </QMUpload>
                   <Tips title="建议尺寸：346*216，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
                  </div>
                )}
           </FormItem>
           <FormItem label={`${!i?'左':'右'}图banner`}>
            {getFieldDecorator(`columnsBannerImageUrl${i}`, { 
                initialValue: item.columnsBannerImageUrl,
                rules: [
                  { required: true, message: '图片不能为空' }
                ]
              })(
                <div>
                  <QMUpload
                      name="uploadFile"
                      style={styles.box}
                      onChange={(fileEntity)=>this._editImages({index:i,name:'imageBanneList'},fileEntity)}
                      action={
                        Const.HOST + '/uploadResource?resourceType=IMAGE'
                      }
                      fileList={item.imageBanneList}
                      listType={'picture-card'}
                      accept={'.jpg,.jpeg,.png,.gif'}
                      beforeUpload={this._checkUploadFile}
                    >
                      {item.imageBanneList.length < 1 ? (
                        <Icon type="plus" style={styles.plus} />
                      ) : null}
                    </QMUpload>
                    <Tips title="建议尺寸：710*212，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
                </div>
              )}
                 
             </FormItem>
                 <FormItem label={`${!i?'左':'右'}图跳转商品`}>
                 {getFieldDecorator('chooseSkuIds', {
                     initialValue: cnfList[isType].chooseSkuIds,
                     rules: [{ required: true, message: '请选择商品' }]
                   })(<SelectedGoodsGrid type={i} />)}
             </FormItem>
           </Card>
            )
          }
            <FormItem labelAlign="right">
              <Button onClick={()=>history.goBack()}> {adTyle!='dis'?'取消':'返回'} </Button>
              {
                adTyle!='dis'?<Button style={styles.maLeft} type="primary" htmlType="submit">保存</Button>:''
              }
            </FormItem>
        </Form>
        <div style={{width: '100%'}}>
          <LsGoodsModal
            limitNOSpecialPriceGoods={true}
            showValidGood={true}
            isCouponList={12}
            visible={goodsModalVisible}
            selectedSkuIds={cnfList[isType].chooseSkuIds}
            selectedRows={cnfList[isType].goodsRows}
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
    _editImages = ({index,name},{ file, fileList }) => {
    
      let list=fileList.length?fileList.slice(-1):[]
      if (file.status == 'error') {
        message.error('上传失败');
        this.props.relaxProps.configVOSBut(index,name=='imageList'?{imageList:[]}:{imageBanneList:[]});
        return
      }
      if(file.status=='removed'){
        let obj=name=='imageList'?{advertisingImageUrl:'',imageList:[]}:{columnsBannerImageUrl:'',imageBanneList:[]}
        this.props.relaxProps.configVOSBut(index,obj)
      }
      if(file.status=='done'){
        let obj={
          imageList:list,
          advertisingImageUrl:list[0].response.join()
        }
        let obj1={
          imageBanneList:list,
          columnsBannerImageUrl:list[0].response.join()
        }
        this.props.relaxProps.configVOSBut(index,name=='imageList'?obj:obj1);
      }
      if(file.status="uploading"){
        this.props.relaxProps.configVOSBut(index,name=='imageList'?{imageList:list}:{imageBanneList:list});
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
