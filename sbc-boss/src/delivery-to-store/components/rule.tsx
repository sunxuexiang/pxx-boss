import React, { useState, useEffect } from 'react';
import {
  Alert,
  Form,
  InputNumber,
  message,
  Button,
  TreeSelect,
  Tabs,
  Switch
} from 'antd';
import { Const, FindArea } from 'qmkit';
import { queryDeliveryToStore, saveRule } from '../webapi';
import '../index.less';

const { TabPane } = Tabs;

const FormItem = Form.Item;

// 获取省市区数据
const _proviceCityData = FindArea.findProvinceCityData();

// 获取省市区街道数据
const _provinceCityAreaStreetData = FindArea.findProvinceCityAreaStreet();

const DeliveryRule = function (props) {
  const { form } = props;
  const { getFieldDecorator } = form;

  const [currentTab, setCurrnetTab] = useState('');

  // TabList
  const [tabList, setTabList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [proviceCityStateData] = useState(_proviceCityData);
  const [provinceCityAreaStreetStateData, setProvinceCityAreaStreetStateData] =
    useState(_provinceCityAreaStreetData);

  const _transformInfoData = (datas) => {
    let dataArray = [];
    for (const item of datas) {
      const tmpArr = dataArray[item.wareId];
      if (tmpArr) {
        tmpArr.items.push({ ...item });
      } else {
        dataArray[item.wareId] = {
          wareId: item.wareId,
          wareName: item.wareName,
          items: [{ ...item }]
        };
      }
    }
    dataArray = dataArray.filter(Boolean);
    return dataArray;
  };

  // 获取规则配置数据
  const getInfo = async () => {
    const { res } = await queryDeliveryToStore();
    if (res && res.code === Const.SUCCESS_CODE) {
      const dataArray = _transformInfoData(res.context);
      setTabList(dataArray);
      if (dataArray.length > 0) {
        const tmpData = dataArray[0];
        setCurrnetTab(tmpData.wareId);
        _transStreetData(res.context[0].destinationArea);
      }
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getInfo();
  }, []);

  const tProps = {
    treeCheckable: true,
    labelInValue: true,
    showCheckedStrategy: TreeSelect.SHOW_CHILD,
    searchPlaceholder: '请选择城市',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    style: {
      minWidth: 300
    }
  };

  const tProps2 = {
    treeCheckable: true,
    labelInValue: true,
    showCheckedStrategy: TreeSelect.SHOW_CHILD,
    searchPlaceholder: '请选择街道',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    style: {
      minWidth: 300
    }
  };

  // 保存规则
  const save = () => {
    form.validateFields(async (errs, values) => {
      if (!errs) {
        const info = tabList.filter((item) => item.wareId == currentTab)[0];
        const params = info.items.map((info) => {
          let tmp = {
            freightFreeNumber: info.freightFreeNumber,
            destinationType: info.destinationType,
            id: info.id,
            openFlag: info.openFlag,
            wareId: info.wareId
          } as any;
          if (info.destinationType == 6) {
            tmp = {
              ...tmp,
              destinationArea: values.destinationArea.map((item) => item.value),
              destinationAreaName: values.destinationArea.map(
                (item) => item.label
              )
            };
          }
          if (info.destinationType == 7) {
            tmp = {
              ...tmp,
              destinationArea: values.destinationStreet.map(
                (item) => item.value
              ),
              destinationAreaName: values.destinationStreet.map(
                (item) => item.label
              )
            };
          }
          return tmp;
        });

        setLoading(true);
        const { res } = await saveRule({
          freightTemplateDeliveryAreaList: params
        });
        setLoading(false);
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('保存成功');
          getInfo();
        } else {
          message.error(res.message || '');
        }
      }
    });
  };
  const _onTreeSelectChangeed = (value, label, extra, index, item) => {
    if (index == 6) {
      _transStreetData(value);
    }
  };

  const _transStreetData = (datas = []) => {
    const value = (datas || []).map((item) => {
      if (typeof item === 'string') {
        return {
          value: item
        };
      }
      return item;
    });
    const provinces = [];
    const citys = [];
    for (const item of value) {
      if (item.value.endsWith('0000')) {
        provinces.push(item.value);
      } else {
        const item2 = FindArea.findProviceItemWithCityCode(item.value);
        provinces.push(item2.value);
        citys.push(item.value);
      }
    }
    setProvinceCityAreaStreetStateData(
      FindArea.findProvinceCityAreaStreet(provinces, citys)
    );
  };

  const _item5Render = (item) => {
    return (
      <div key={item.destinationType}>
        <FormItem label="支持“配送到店(收费)”配送方式">
          {getFieldDecorator('openFlag', {
            initialValue: item.openFlag === 1,
            valuePropName: 'checked',
            rules: [{ required: true, message: '请选择' }]
          })(<Switch />)}
        </FormItem>
      </div>
    );
  };

  const _item6Render = (item) => {
    const destinationAreaVal = [];
    (item.destinationArea || []).forEach((item2, index) => {
      destinationAreaVal.push({
        label: item.destinationAreaName[index],
        value: item2
      });
    });
    return (
      <FormItem
        key={item.destinationType}
        label={`单笔订单满足 ${item.freightFreeNumber} 件起配覆盖区域:`}
      >
        {getFieldDecorator('destinationArea', {
          initialValue: destinationAreaVal,
          rules: [{ required: true, message: '请选择覆盖区域' }]
        })(
          <TreeSelect
            {...tProps}
            treeData={proviceCityStateData}
            onChange={(val, label, extra) => {
              _onTreeSelectChangeed(val, label, extra, 6, item);
            }}
            filterTreeNode={(input, treeNode) =>
              treeNode.props.title.toLowerCase().indexOf(input.toLowerCase()) >=
              0
            }
          />
        )}
      </FormItem>
    );
  };

  const _item7Render = (item) => {
    const streetInitValue = [];
    (item.destinationArea || []).forEach((item2, index) => {
      streetInitValue.push({
        label: item.destinationAreaName[index],
        value: item2
      });
    });
    return (
      <FormItem
        key={item.destinationType}
        label={`乡镇件满足 ${item.freightFreeNumber} 件起配覆盖区域:`}
      >
        {getFieldDecorator('destinationStreet', {
          initialValue: streetInitValue,
          rules: [{ required: true, message: '请选择乡镇件覆盖区域' }]
        })(
          <TreeSelect
            {...tProps2}
            onChange={(val, label, extra) => {
              _onTreeSelectChangeed(val, label, extra, 7, item);
            }}
            treeData={provinceCityAreaStreetStateData}
            filterTreeNode={(input, treeNode) =>
              treeNode.props.title.toLowerCase().indexOf(input.toLowerCase()) >=
              0
            }
          />
        )}
      </FormItem>
    );
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 }
    }
  };

  return (
    <div>
      <Alert
        message=""
        description={
          <div>
            <p>若开启，则用户在下单时可使用该配送服务，且遵循平台制定的规则</p>
            <p>若关闭，则用户在下单时该配送方式可见不可选</p>
          </div>
        }
        type="info"
      />
      <Tabs
        activeKey={currentTab.toString()}
        onChange={(activeKey) => setCurrnetTab(activeKey)}
      >
        {tabList.map((item) => {
          return (
            <TabPane tab={item.wareName} key={item.wareId.toString()}>
              <Form {...formItemLayout}>
                {item.items.map((subItem) => {
                  if (subItem.destinationType == 5) {
                    return _item5Render(subItem);
                  } else if (subItem.destinationType == 6) {
                    return _item6Render(subItem);
                  } else if (subItem.destinationType == 7) {
                    return _item7Render(subItem);
                  }
                })}
                {
                  <Button
                    style={{
                      position: 'fixed',
                      left: '291px',
                      bottom: '100px'
                    }}
                    type="primary"
                    loading={loading}
                    onClick={save}
                  >
                    保存
                  </Button>
                }
              </Form>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

const DeliveryRuleForm = Form.create()(DeliveryRule);
export default DeliveryRuleForm;
