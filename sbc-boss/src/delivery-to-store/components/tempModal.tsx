import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Form,
  TreeSelect,
  Input,
  Modal,
  message,
  Button,
  Radio,
  Icon
} from 'antd';
import { Const, FindArea, ValidConst } from 'qmkit';
import { queryDeliveryToStore, saveTemp } from '../webapi';
import * as _ from 'lodash';
import '../index.less';
import Item from 'antd/lib/list/Item';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 22
  }
};
const initData = {
  id: 0,
  // 配送地id(逗号分隔)
  destinationArea: [],
  // 配送地名称(逗号分隔)
  destinationAreaName: ['未被划分的配送地区自动归于默认运费'],
  // 首件/重/体积
  freightStartNum: '',
  // 对应于首件/重/体积的起步价
  freightStartPrice: '',
  // 续件/重/体积
  freightPlusNum: '',
  // 对应于续件/重/体积的价格
  freightPlusPrice: '',
  // 是否默认
  defaultFlag: 1,
  // 是否删除 0: 否   1: 是
  delFlag: 0
};

const TempModal = function (props) {
  const {
    form,
    visible,
    type,
    currentData,
    close,
    getAllTemp,
    FREIGHT_TEMP,
    PLACE_HOLDER
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  // 列表数据
  const [list, setList] = useState([initData]);
  // 计价方式
  const [valuationType, setType] = useState(0);
  const [loading, setLoading] = useState(false);
  // 已选择的地区
  const [selectedArea, setArea] = useState([]);
  // 用以table中form增减时的计数ID
  const num = useRef(1);
  useEffect(() => {
    if (visible) {
      // 每次打开弹窗时 设置默认值
      num.current = 1;
      if (type === 'add') {
        setType(0);
        setArea([]);
      } else {
        setType(currentData.valuationType || 0);
        let areaArr = [];
        const newList = [];
        currentData.freightTemplateGoodsExpresses?.forEach((item, index) => {
          newList.push({ ...item, id: index, oldId: item.id });
          if (index > 0) {
            num.current++;
            areaArr = areaArr.concat(item.destinationArea.split(','));
          }
        });
        setArea(areaArr);
        setList(newList);
      }
    }
  }, [visible]);

  const tProps = {
    treeCheckable: true,
    labelInValue: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '请选择地区',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' }
    // style: {
    //   width: 300
    // }
  };
  // 获取规则
  const _rules = (type, text, flag) => {
    let rules = [];
    if (flag) {
      rules = [
        {
          validator: (_rule, value, callback) => {
            if (value || value == '0') {
              if (!ValidConst.zeroPrice.test(value)) {
                callback('请填写两位小数的合法金额');
              }
              if (!(value < 10000 && value >= 0)) {
                callback('最大值为9999.99');
              }
            } else {
              callback('请输入金额');
            }
            callback();
          }
        }
      ];
    } else {
      rules = [
        {
          required: true,
          message: `请输入${text}${FREIGHT_TEMP[type].label}`
        }
      ];
      if (type == 0) {
        rules = rules.concat([
          {
            validator: (_rule, value, callback) => {
              if (value) {
                if (!ValidConst.noZeroNumber.test(value)) {
                  callback('请填写合法的数字');
                }
                if (!(value <= 9999 && value >= 1)) {
                  callback('请输入1-9999之间的整数');
                }
              }
              callback();
            }
          }
        ]);
      } else if (type == 1 || type == 3) {
        rules = rules.concat([
          {
            validator: (_rule, value, callback) => {
              if (value) {
                if (!ValidConst.singleDecimal.test(value)) {
                  callback('请输入合法的一位小数');
                }
                if (!(value < 10000 && value > 0)) {
                  callback('请输入0.1-9999.9之间的小数');
                }
              }
              callback();
            }
          }
        ]);
      } else {
        rules = rules.concat([
          {
            validator: (_rule, value, callback) => {
              if (value) {
                if (!ValidConst.three.test(value)) {
                  callback('请输入合法的小数');
                }
                if (!(value < 1000 && value > 0)) {
                  callback('请输入0.001-999.999之间的小数');
                }
              }
              callback();
            }
          }
        ]);
      }
    }

    return rules;
  };
  // 添加
  const add = () => {
    const newData = {
      ...initData,
      defaultFlag: 0,
      id: num.current,
      destinationAreaName: []
    };
    num.current++;
    setList(list.concat([newData]));
  };
  //删除
  const remove = (id) => {
    const newList = list.filter((item) => item.id !== id);
    const removeArea = getFieldValue(`destinationArea${id}`).map(
      (area) => area.value
    );
    setArea(selectedArea.filter((area) => !removeArea.includes(area)));
    setList(newList);
  };
  // 设置已选择的地区
  const setSelectedArea = (arr, id) => {
    let result = arr.map((area) => area.value);
    list.forEach((item, index) => {
      if (item.id !== id && index > 0) {
        result = result.concat(
          getFieldValue(`destinationArea${item.id}`).map((area) => area.value)
        );
      }
    });
    setArea(result);
  };
  // 设置配送地区默认值
  const getInitArea = (record) => {
    const result = [];
    if (record.destinationArea && record.destinationAreaName) {
      record.destinationArea.split(',').forEach((item, index) => {
        result.push({
          value: item,
          label: record.destinationAreaName.split(',')[index]
        });
      });
    }
    return result;
  };
  const columns = [
    {
      title: '配送地区',
      dataIndex: 'destinationArea',
      key: 'destinationArea',
      render: (text, record, index) => {
        if (index === 0) {
          return (
            <div>
              默认
              <span style={{ color: '#b5b5b5' }}>
                除指定地区外，其余地区的运费采用“默认运费”
              </span>
            </div>
          );
        } else {
          return (
            <div className="treeSelectBox">
              <FormItem>
                {getFieldDecorator(`destinationArea${record.id}`, {
                  initialValue:
                    type === 'edit' && record.oldId ? getInitArea(record) : [],
                  rules: [{ required: true, message: '请选择地区' }]
                })(
                  <TreeSelect
                    {...tProps}
                    treeData={FindArea.findProvinceCity(
                      selectedArea.filter(
                        (area) =>
                          !getFieldValue(`destinationArea${record.id}`)
                            .map((item) => item.value)
                            .includes(area)
                      )
                    )}
                    filterTreeNode={(input, treeNode) =>
                      treeNode.props.title
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value: any[]) => {
                      setSelectedArea(value, record.id);
                    }}
                  />
                )}
              </FormItem>
            </div>
          );
        }
      }
    },
    {
      title: `首${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
      dataIndex: 'freightStartNum',
      key: 'freightStartNum',
      width: '15%',
      render: (text, record) => {
        return (
          <FormItem>
            {getFieldDecorator(`freightStartNum${record.id}`, {
              initialValue: type === 'edit' && record.oldId ? text : '',
              rules: _rules(valuationType, '首', false)
            })(<Input placeholder={PLACE_HOLDER[valuationType].unit} />)}
          </FormItem>
        );
      }
    },
    {
      title: '首费(元)',
      dataIndex: 'freightStartPrice',
      key: 'freightStartPrice',
      width: '15%',
      render: (text, record) => {
        return (
          <FormItem>
            {getFieldDecorator(`freightStartPrice${record.id}`, {
              initialValue: type === 'edit' && record.oldId ? text : '',
              rules: _rules(valuationType, '', true)
            })(<Input placeholder={PLACE_HOLDER[valuationType].money} />)}
          </FormItem>
        );
      }
    },
    {
      title: `续${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
      dataIndex: 'freightPlusNum',
      key: 'freightPlusNum',
      width: '15%',
      render: (text, record) => {
        return (
          <FormItem>
            {getFieldDecorator(`freightPlusNum${record.id}`, {
              initialValue: type === 'edit' && record.oldId ? text : '',
              rules: _rules(valuationType, '续', false)
            })(<Input placeholder={PLACE_HOLDER[valuationType].unit} />)}
          </FormItem>
        );
      }
    },
    {
      title: '续费(元)',
      dataIndex: 'freightPlusPrice',
      key: 'freightPlusPrice',
      width: '15%',
      render: (text, record) => {
        return (
          <FormItem>
            {getFieldDecorator(`freightPlusPrice${record.id}`, {
              initialValue: type === 'edit' && record.oldId ? text : '',
              rules: _rules(valuationType, '', true)
            })(<Input placeholder={PLACE_HOLDER[valuationType].money} />)}
          </FormItem>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '8%',
      align: 'center',
      render: (_text, record, index) => {
        return index == 0 ? (
          <Icon type="plus" onClick={add} />
        ) : (
          <Icon type="minus" onClick={() => remove(record.id)} />
        );
      }
    }
  ];
  // 保存数据
  const save = () => {
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const freightTemplateGoodsExpressSaveRequests = [];
        const oldIds = [];
        list.forEach((item: any, index) => {
          const opt = {
            destinationArea:
              index === 0
                ? []
                : values[`destinationArea${item.id}`].map((area) => area.value),
            destinationAreaName:
              index === 0
                ? ['未被划分的配送地区自动归于默认运费']
                : values[`destinationArea${item.id}`].map((area) => area.label),
            freightStartNum: values[`freightStartNum${item.id}`],
            freightStartPrice: values[`freightStartPrice${item.id}`],
            freightPlusNum: values[`freightPlusNum${item.id}`],
            freightPlusPrice: values[`freightPlusPrice${item.id}`],
            defaultFlag: item.defaultFlag,
            delFlag: item.delFlag
          } as any;
          if (type === 'edit' && item.oldId) {
            opt.id = item.oldId;
            oldIds.push(item.oldId);
          }
          freightTemplateGoodsExpressSaveRequests.push(opt);
        });
        if (type === 'edit') {
          currentData.freightTemplateGoodsExpresses.forEach((item) => {
            if (!oldIds.includes(item.id)) {
              freightTemplateGoodsExpressSaveRequests.push({
                ...item,
                delFlag: 1,
                destinationArea: item.destinationArea
                  ? item.destinationArea.split(',')
                  : [],
                destinationAreaName: item.destinationAreaName
                  ? item.destinationAreaName.split(',')
                  : []
              });
            }
          });
        }
        const params = {
          freightTempName: values.freightTempName,
          provinceId: 430000,
          cityId: 430100,
          areaId: 430111,
          // 是否包邮(0: 不包邮(买家承担运费) 1: 包邮(卖家承担运费)) 默认0
          freightFreeFlag: 0,
          valuationType: values.valuationType,
          defaultFlag: type === 'edit' ? currentData.defaultFlag : 0,
          // 是否指定条件包邮(0:不指定,1:指定) 默认0
          specifyTermFlag: 0,
          // 运送方式(7:配送到店)
          deliverWay: 7,
          freightTemplateGoodsExpressSaveRequests,
          freightTemplateGoodsFreeSaveRequests: [],
          wareId: 1
        } as any;
        if (type === 'edit') {
          params.freightTempId = currentData.freightTempId;
        }
        setLoading(true);
        const { res } = await saveTemp(params);
        setLoading(false);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('保存成功');
          close();
          getAllTemp();
        } else {
          message.error(res.message || '');
        }
      }
    });
  };
  return (
    <Modal
      visible={visible}
      title={`${type === 'add' ? '新增' : '编辑'}运费模板`}
      centered
      maskClosable={false}
      width={1200}
      destroyOnClose
      onCancel={close}
      onOk={save}
      okText="保存"
      confirmLoading={loading}
    >
      <Form {...formItemLayout} className="dts-form">
        <FormItem label="模板名称">
          {getFieldDecorator('freightTempName', {
            initialValue: type === 'edit' ? currentData.freightTempName : '',
            rules: [{ required: true, message: '请输入模板名称' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="计价方式">
          {getFieldDecorator('valuationType', {
            initialValue: type === 'edit' ? currentData.valuationType : 0,
            rules: [{ required: true, message: '请选择计价方式' }]
          })(
            <Radio.Group onChange={(e) => setType(e.target.value)}>
              <Radio value={0}>按件数</Radio>
              <Radio value={1}>按重量</Radio>
              <Radio value={2}>按体积</Radio>
              <Radio value={3}>按重量/件</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem required label="配送地区">
          {' '}
        </FormItem>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          bordered
          rowKey="id"
        />
      </Form>
    </Modal>
  );
};

const TempModalForm = Form.create<any>()(TempModal);

export default TempModalForm;
