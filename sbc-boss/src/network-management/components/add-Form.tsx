import React from 'react';
import { Form, Input,TreeSelect,Cascader } from 'antd';
import moment from 'moment';
import { IMap } from 'typings/globalType';
import { FindArea,ValidConst } from 'qmkit';

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



// const valueMap = {};
// function loops(list, parent?) {
//   return (list || []).map(({ children, value,label}) => {
//     const node:any = (valueMap[value] = {
//       parent,
//       value:{
//         value:value,
//         label:label
//       }
//     });
//     node.children = loops(children, node);
//     return node;
//   });
// }

// loops(FindArea.findProvinceArea([]));

// function getPath(value) {
//   const path = [];
//   let current = valueMap[value];
//   while (current) {
//     path.unshift(current.value);
//     current = current.parent;
//   }
//   return path;
// }

// const lists=_buildFreeAreaDataWithTenCases('')

// function _buildFreeAreaDataWithTenCases(id:any){
//   var Caes = JSON.parse(JSON.stringify(FindArea.findProvinceArea([])));
//   console.log(Caes,'Caes')
//   // Caes.forEach((item,index) => {
//   //     item.disabled = true;
//   //     item.children.forEach(element => {
//   //       element.disabled = true;
//   //       element.children.forEach(el3 => {
//   //         el3.disabled = true;
//   //       });
//   //     });
//   // })
//   return Caes;
// };


export default class AddForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
      changeCityArea:Function;
    };
  };
  
  render() {
    const { formData,changeCityArea } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="网点名称">
          {getFieldDecorator('networkName', {
            rules: [
              { required: true, whitespace: true, message: '请输入网点名称' },
              { max:100, min: 1, message: '1-100个字符' }
            ],
            onChange: (e) =>
              this._changeFormData('networkName', e.target.value),
            initialValue: formData.get('networkName')
          })(
            <Input placeholder="请输入网点名称" />
          )}
          {/*  <Tips title="字段提示信息demo" />*/}
        </FormItem>
        <FormItem {...formItemLayout} label="网点地址">
          {getFieldDecorator('addressList', {
            rules: [
              {
                required: true,
                message: '请选择网点地址'
              }
            ],
            onChange: (value,selectedOptions) =>{
              let list=selectedOptions;
              // let list=getPath(value);
              this._changeFormData('province', list[0]?.value);
              this._changeFormData('city', list[1]?.value);
              this._changeFormData('area', list[2]?.value||'');
              this._changeFormData('town', list[3]?.value||'');
              this._changeFormData('provinceName', list[0]?.label);
              this._changeFormData('cityName', list[1]?.label);
              this._changeFormData('areaName', list[2]?.label||'');
              this._changeFormData('townName', list[3]?.label||'');
              this._changeFormData('addressName',list[0]?.label+list[1]?.label+list[2]?.label+(list[3]?.label||''));
              this._changeFormData('addressList',value);
            },
            initialValue: formData.get('addressList')
          })(
            <Cascader
              options={FindArea.findProvinceArea([])}
              placeholder="请选择地区"
            />
          )}
           {/* // <TreeSelect
            //   style={{ width: '100%' }}
            //   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            //   treeData={lists}
            //   placeholder="请选择地区"
            //   treeNodeLabelProp="label"
            //   treeNodeFilterProp="value"
            // /> */}
        </FormItem>
        
        <FormItem {...formItemLayout} label="详细地址">
          {getFieldDecorator('specificAdress', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入详细地址'
              },
              { max: 200, message: '1-200字符' }
            ],
            onChange: (e) =>
              this._changeFormData('specificAdress', e.target.value),
            initialValue: formData.get('specificAdress')
          })(<Input placeholder="请输入详情地址，不超过200字符" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('contacts', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入联系人'
              },
              { max: 20, message: '最多可输入20个字符' }
            ],
            onChange: (e) =>
              this._changeFormData('contacts', e.target.value),
            initialValue: formData.get('contacts')
          })(<Input placeholder="请输入联系人" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: '请输入联系电话'
              },
              { pattern: ValidConst.phone, message: '请输入正确的联系电话' }
            ],
            onChange: (e) =>
              this._changeFormData('phone', e.target.value),
            initialValue: formData.get('phone')
          })(<Input placeholder="请输入联系电话" />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };

  /**
   * 获取初始化的日期时间
   */
  _getInitDate(dateStr, dateFormat) {
    return dateStr ? moment(dateStr, dateFormat) : null;
  }

  /**
   * 日期时间组件公用属性
   */
  _getDateCommProps(dateFormat) {
    return {
      getCalendarContainer: () => document.getElementById('page-content'),
      allowClear: true,
      format: dateFormat
    };
  }

  /**
   * 不可选的日期
   */
  _disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }




  
}
