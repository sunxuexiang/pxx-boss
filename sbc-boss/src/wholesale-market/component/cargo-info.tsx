import { Table, Form, Input, Button, Row, Col, Cascader } from 'antd';
import { produce } from 'immer';
import { FindArea } from 'qmkit';
import React, { useEffect, useState } from 'react';
import { findSiteList } from '../webapi';

export default function CargoInfoModal(props) {
  const { currentMarketInfo, form } = props;

  const [tProps, setTProps] = useState({
    treeData: FindArea.getCityDatas(currentMarketInfo.cityId)
    // treeCheckable: false,
    // showCheckedStrategy: TreeSelect.SHOW_CHILD,
    // labelInValue: true,
    // style: {
    //   width: 120
    // }
  });

  useEffect(() => {
    setTProps(
      produce(tProps, (draft) => {
        draft.treeData = FindArea.getCityDatas(currentMarketInfo.cityId);
      })
    );
  }, [currentMarketInfo]);

  const columns = [
    {
      title: '接货点名称',
      dataIndex: 'siteName',
      key: 'siteName',
      render: (text, record) => {
        return (
          <Form.Item>
            {form.getFieldDecorator(`siteName-${record.key}`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入接货点名称' }]
            })(<Input />)}
          </Form.Item>
        );
      }
    },
    {
      title: '所在市区街道',
      dataIndex: 'streetCode',
      key: 'streetCode',
      render: (text, record) => {
        return (
          <Form.Item>
            {form.getFieldDecorator(`streetCode-${record.key}`, {
              initialValue: record.streetCode
                ? [`${record.districtCode}`, `${record.streetCode}`]
                : [],
              rules: [{ required: true, message: '请选择街道' }]
            })(
              // <TreeSelect {...tProps} />
              <Cascader options={tProps.treeData} allowClear={false} />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => {
        return (
          <Form.Item>
            {form.getFieldDecorator(`address-${record.key}`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入详细地址' }]
            })(<Input />)}
          </Form.Item>
        );
      }
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      render: (text, record) => {
        return (
          <Form.Item>
            {form.getFieldDecorator(`contactPerson-${record.key}`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入联系人姓名' }]
            })(<Input />)}
          </Form.Item>
        );
      }
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      render: (text, record) => {
        return (
          <Form.Item>
            {form.getFieldDecorator(`contactPhone-${record.key}`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入联系电话' }]
            })(<Input />)}
          </Form.Item>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'opera',
      key: 'opera',
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              deleteRowData(record);
            }}
          >
            删除
          </Button>
        );
      }
    }
  ];

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getDatas();
  }, [currentMarketInfo]);

  const getDatas = async () => {
    try {
      const { res } = await findSiteList({
        siteType: 1,
        siteOwnerId: currentMarketInfo.marketId
      });
      // @ts-ignore
      const datas = res.data;
      if (Array.isArray(datas)) {
        setDataSource(
          datas.map((item, index) => {
            item.key = index;
            return item;
          })
        );
      }
    } catch (error) {}
  };

  const addRowData = () => {
    setDataSource(
      produce(dataSource, (draft) => {
        draft.push({
          key: `${draft.length == 0 ? 0 : +draft[draft.length - 1].key + 1}`,
          streetCode: '',
          address: '',
          contactPerson: '',
          contactPhone: ''
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
    <Row>
      <Col span={23}>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Col>
      <Col span={1}>
        <Button
          type="link"
          style={{ fontSize: 20, fontWeight: 500 }}
          onClick={addRowData}
        >
          +
        </Button>
      </Col>
    </Row>
  );
}
