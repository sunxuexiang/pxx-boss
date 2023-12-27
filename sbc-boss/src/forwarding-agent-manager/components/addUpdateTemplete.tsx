import { Button, Col, Form, Icon, Input, Row, Table, TreeSelect } from 'antd';
import { produce } from 'immer';
import { FindArea } from 'qmkit';
import React, { useEffect, useState } from 'react';

const _areaData = FindArea.findProvinceCityAreaStreet2();

function ForwardAddUpdateTemplete(props) {
  const { form, editData } = props;

  const defaultPrefix = '默认';
  const defaultSuffix = '除指定地区外，其余地区的运费采用“默认运费”';

  const [tProps] = useState({
    treeData: _areaData,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    labelInValue: true,
    style: {
      width: 200
    }
  });

  const columns = [
    {
      title: '配送地区',
      dataIndex: 'areaCodes',
      key: 'areaCodes',
      render: (text, record) => {
        return record.key == 0 ? (
          <span>
            {defaultPrefix}
            <span style={{ color: 'lightgray' }}>{defaultSuffix}</span>
          </span>
        ) : (
          <Form.Item>
            {form.getFieldDecorator(`areaCodes-${record.key}`, {
              rules: [{ required: true, message: '请选择街道' }]
            })(<TreeSelect {...tProps} />)}
          </Form.Item>
        );
      }
    },
    {
      title: '收费标准',
      dataIndex: 'moneyStyle',
      key: 'moneyStyle',
      render: (text, record) => {
        return (
          <Row>
            <span style={{ lineHeight: '30px', marginRight: '5px' }}>
              5箱起配
            </span>
            <Form.Item>
              {form.getFieldDecorator(`start-${record.key}`, {
                initialValue: record.money,
                rules: [{ required: true, message: '必填项' }]
              })(<Input style={{ width: 60 }} />)}
            </Form.Item>
            <span
              style={{
                lineHeight: '30px',
                marginLeft: '5px',
                marginRight: '5px'
              }}
            >
              元/箱，乡镇10箱起配加收
            </span>
            <Form.Item>
              {form.getFieldDecorator(`increase-${record.key}`, {
                initialValue: record.extMoney,
                rules: [{ required: true, message: '必填项' }]
              })(<Input style={{ width: 60 }} />)}
            </Form.Item>
            <span style={{ lineHeight: '30px', marginLeft: '5px' }}>
              元/单票
            </span>
          </Row>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'opera',
      key: 'opera',
      render: (text, record) => {
        return record.key == 0 ? (
          <Button
            type="link"
            onClick={() => {
              addRowData();
            }}
          >
            <Icon type="plus"></Icon>
          </Button>
        ) : (
          <Button
            type="link"
            onClick={() => {
              deleteRowData(record);
            }}
          >
            <Icon type="delete"></Icon>
          </Button>
        );
      }
    }
  ];

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const nums = Object.keys(editData).length;
    if (nums > 0) {
      const { form } = props;
      form.setFieldsValue({
        name: editData.name
      });
      const items = JSON.parse(editData.costRule);
      addRowData(items);
    } else {
      addRowData();
    }
  }, [editData]);

  const addRowData = (mutilRowData = null) => {
    if (mutilRowData) {
      setDataSource(
        produce(dataSource, (draft) => {
          mutilRowData.forEach((item, index) => {
            draft.push({
              key: `${index}`,
              streets: [],
              money: item.money,
              extMoney: item.extMoney
            });
          });
        })
      );
      const { form } = props;
      setTimeout(() => {
        mutilRowData.forEach((item, index) => {
          form.setFieldsValue({
            [`start-${index}`]: item.start,
            [`increase-${index}`]: item.increase,
            [`areaCodes-${index}`]: item.areaCodes
          });
        });
      }, 0);
      return;
    }
    setDataSource(
      produce(dataSource, (draft) => {
        const key = draft.length == 0 ? 0 : +draft[draft.length - 1].key + 1;
        draft.push({
          key: `${key}`,
          streets: [],
          money: '',
          extMoney: ''
        });
      })
    );
  };

  const deleteRowData = (record) => {
    setDataSource(
      produce(dataSource, (draft) => {
        let idx = findIndex(draft, record);
        if (idx >= 0) {
          draft.splice(idx, 1);
        }
      })
    );
  };

  /**
   * 查找index
   * @param draft 需要查找的数组
   * @param record 元素对象
   * @returns number
   */
  const findIndex = (draft, record) => {
    let index = -1;
    for (let i = 0; i < draft.length; i++) {
      const element = draft[i];
      if (element.key == record.key) {
        index = i;
        break;
      }
    }
    return index;
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            label="模版名称"
          >
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入模版名称' }]
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <div>
          <span style={{ color: 'red' }}>*</span> 收费标准：
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Row>
    </div>
  );
}
const ModalForm = Form.create({ name: 'addUpdateTemplete' })(
  ForwardAddUpdateTemplete
) as any;
export default ModalForm;
