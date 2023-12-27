import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Icon,
  Descriptions,
  Modal,
  Radio,
  Cascader,
  Card,
  message
} from 'antd';
import { noop,  QMUpload,Tips,history,Const } from 'qmkit';
import { Relax } from 'plume2';
import {cateIdOrErpGoodsInfoNo}from '../webapi';
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
@Relax
export default class Fromsa extends Component<any, any> {
  static relaxProps = {
    options:'options',
    advertisingName:'advertisingName',
    formData:'formData',
    adTyle:'adTyle',
    init: noop,
    onFormBut:noop,
    editImages:noop,
    configVOSBut:noop,
    bannerBut:noop
  };
  
  state = {
    visible: false,
    radio: 0,
    cateId:null,
    optionsItem:[],
    selectItem:{},
    isIndex:0,
    goodsVo:null,
    imageList:[
    ],
    obj:{
      jumpCode:'',
      jumpName:'',
      jumpType:null,
      selectItem:{}
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    // this.props.relaxProps.onAaveStart();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.relaxProps.bannerBut();
        console.log('Received values of form: ', values);
      }
    });
  };
  onChange =(eve,optionsItem)=>{
    this.setState({
      optionsItem,
      cateId:eve
    })
  };

  render() {
    const { formData,options,onFormBut,adTyle } = this.props.relaxProps;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    const { getFieldDecorator } = this.props.form;
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
                <Card size="small" key={i} style={styles.margins}>
                  <FormItem label={`图${i+1}`}>
                  <QMUpload
                      name="uploadFile"
                      style={styles.box}
                      onChange={(fileEntity)=>this._editImages(i,fileEntity)}
                      action={
                        Const.HOST + '/uploadResource?resourceType=IMAGE'
                      }
                      fileList={item.imageList}
                      listType={'picture-card'}
                      accept={'.jpg,.jpeg,.png,.gif'}
                      beforeUpload={this._checkUploadFile}
                    >
                      {item.imageList?.length< 1 ? (
                        <Icon type="plus" style={styles.plus} />
                      ) : null}
                      {/* (<img src={item.advertisingImageUrl} alt="" style={{ width: '100%',height:'100%' }} />) */}
                    </QMUpload>
                    <Tips title="建议尺寸：688*318，最大1mb，支持的图片格式：jpg、png、jpeg、gif" />
                  </FormItem>
                  
                  <FormItem label={`图${i+1}跳转连接`}>
                    <Button type="primary"
                      onClick={() => this.setState({ visible: true,radio:0,isIndex:i })}>添加</Button>
                      {this.descriptionsBut(i,item)}
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
        <Modal
          title="输入跳转连接"
          visible={this.state.visible}
          onOk={() =>this.onOKBut() }
          onCancel={() => this.setState({ visible: false,radio:null })}
        >
          <Form  className="login-form">
            <FormItem label="类型">
              <Radio.Group
                onChange={(e) =>
                  this.setState({
                    radio:e.target.value 
                  })
                }
                value={this.state.radio}
              >
                <Radio value={0}>三级类目</Radio>
                <Radio value={1}>商品详情页</Radio>
              </Radio.Group>
            </FormItem>
            {this.state.radio == 0 ? (
              <FormItem label="三级类目">
                <Cascader options={options.toJS()} showSearch fieldNames={{label:'cateName',value:'cateId',children:'goodsCateList'}} onChange={this.onChange} placeholder="请选择三级类目" />
              </FormItem>
            ) : (
              <FormItem label="商品编号">
                <Input placeholder="请输入ERP编号或条形码" value={this.state.goodsVo} onChange={(e)=>this.setState({
                  goodsVo:e.target.value
                })} />
              </FormItem>
            )}
          </Form>
        </Modal>
      </div>
    );
  }

  descriptionsBut=(isIndex,item)=>{
    if(item.jumpType==0){
      return (
        <Descriptions title="" layout="vertical" bordered size="small">
                  <Descriptions.Item label="类型">分类</Descriptions.Item>
                  <Descriptions.Item label="类目名称">
                  {item.jumpName}
                  </Descriptions.Item>
                  <Descriptions.Item label="操作">
                    <Button onClick={()=>this.props.relaxProps.configVOSBut(isIndex,this.state.obj)} >移除</Button>
                  </Descriptions.Item>
         </Descriptions>
      )
    }
    if(item.jumpType==1){
      return (
        <Descriptions title="" column={{ xs: 5, sm: 5, md: 5}} layout="vertical" bordered size="small">
                  <Descriptions.Item  label="类型">商品</Descriptions.Item>
                  <Descriptions.Item label="SPU编码/条形码">
                    {item.jumpCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="商品图片">
                    <img src={item.selectItem?.goodsInfoImg} style={{width:'80px',height:'80px'}} alt="" />
                  </Descriptions.Item>
                  <Descriptions.Item label="商品名称">
                    {item.jumpName}
                  </Descriptions.Item>
                  <Descriptions.Item label="操作">
                  <Button onClick={()=>this.props.relaxProps.configVOSBut(isIndex,this.state.obj)} >移除</Button>
                  </Descriptions.Item>
        </Descriptions>
      )
    }

  }

  onOKBut=async()=>{
    if(this.state.radio==0&&!this.state.cateId){
      message.error('请选择类目');
      return
    }
    if(this.state.radio==1&&!this.state.goodsVo){
      message.error('请选择商品');
      return
    }

    let obj={
      jumpCode:this.state.radio==0?this.state.cateId[2]:this.state.goodsVo,
      jumpType:this.state.radio
    }
    const { res }: any = await cateIdOrErpGoodsInfoNo(obj);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      let obj1={
        selectItem:this.state.radio==0?this.state.optionsItem[2]:res.context,
        jumpName:this.state.radio==0?this.state.optionsItem[2].cateName:res.context.goodsInfoName
      }
      this.props.relaxProps.configVOSBut(this.state.isIndex,{...obj,...obj1});
      this.setState({
        visible:false,
      });
    }
  }

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
    _editImages = (i,{ file, fileList }) => {
      let list=fileList.length?fileList.slice(-1):[]
      this.setState({isIndex:i});
      if (file.status == 'error') {
        message.error('上传失败');
        this.props.relaxProps.configVOSBut(i,{imageList:[]});
        return
      }
      if(file.status=='removed'){
        this.props.relaxProps.configVOSBut(i,{advertisingImageUrl:'',imageList:[]})
      }
      if(file.status=='done'){
        let obj={
          imageList:list,
          advertisingImageUrl:list[0].response.join()
        }
        this.props.relaxProps.configVOSBut(i,{...obj,imageList:list});
      }
      if(file.status="uploading"){
        this.props.relaxProps.configVOSBut(i,{imageList:list});
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
