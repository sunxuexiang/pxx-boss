import { Button, Modal, Row, Table, message } from 'antd';
import { BreadCrumb, Headline } from 'qmkit';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ForwardingAddUpdateTemplete from './components/addUpdateTemplete';
import {
  carrierFreightTemplateList,
  editCarrierFreightTemplateStatus,
  saveCarrierFreightTemplate
} from './webapi';
const TableDiv = styled.div`
  margin-top: 20px;
  #freightTempName {
    width: 50%;
  }
  .ant-table-thead > tr > th {
    background-color: #fff;
  }
  .ant-table-title {
    background-color: #fafafa;
  }
`;

export default function FreightTemplete(props) {
  const [dataSource, setDataSource] = useState([]);

  const { record } = props.location.state
    ? props.location.state
    : { record: null };

  const [editData, setEditData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: '配送地址',
      dataIndex: 'areaCodes',
      key: 'areaCodes',
      render: (text, record) => {
        if (Array.isArray(text)) {
          return text
            .map((item) => {
              return item.label;
            })
            .join(',');
        }
        return '默认除指定地区外，其余地区的运费采用“默认运费”';
      }
    },
    {
      title: '收费标准',
      dataIndex: 'carrierAccount',
      key: 'carrierAccount',
      render: (text, record) => {
        return `5箱起配 ${record.start} 元/箱，乡镇件10箱起配加收 ${record.increase} 元/单票`;
      }
    }
  ];

  useEffect(() => {
    _loadTempleteList();
  }, []);

  const _loadTempleteList = async () => {
    try {
      const { res } = (await carrierFreightTemplateList(record.id)) as any;
      if (res.total) {
        setDataSource(res.rows);
      }
    } catch (error) {}
  };

  const _stopOpenTemplete = async (item) => {
    try {
      const { res } = (await editCarrierFreightTemplateStatus({
        id: item.id,
        status: item.status == 1 ? 0 : 1
      })) as any;
      if (res.code == 200) {
        message.success('操作成功');
        _loadTempleteList();
      } else {
        message.error(res.message || res.msg || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const _modifyTemplete = async (item) => {
    setEditData(item);
    setModalVisible(true);
  };

  const _addTemplate = async () => {
    setEditData({});
    setModalVisible(true);
  };

  const modalRef = useRef(null);

  const _confirmModal = async () => {
    const form = modalRef.current;
    form.validateFields((err, value) => {
      if (!err) {
        _saveFormModalData(value);
      }
    });
  };

  const _saveFormModalData = async (data) => {
    const isEdit = Object.keys(editData).length > 0;
    try {
      let tempName = '';
      const arr = [];
      Object.keys(data).forEach((key) => {
        const val = data[key];
        if (key == 'name') {
          tempName = val;
        } else {
          const [keyName, arrIdx] = key.split('-');
          if (arr[arrIdx]) {
            const item = arr[arrIdx];
            arr[arrIdx] = {
              ...item,
              [keyName]: val,
              isDefaultArea: +arrIdx > 0 ? 'false' : 'true'
            };
          } else {
            arr[arrIdx] = {
              [keyName]: val
            };
          }
        }
      });
      const newArr = arr.filter(Boolean);
      const part = {
        costRule: JSON.stringify(newArr),
        name: tempName,
        carrierId: record.id
      };
      if (isEdit) {
        // @ts-ignore
        part.id = editData.id;
      }
      await saveCarrierFreightTemplate(part, isEdit);
      message.success(`${isEdit ? '编辑' : '新增'}成功`);
      _loadTempleteList();
    } catch (error) {
      message.error(`${isEdit ? '编辑' : '新增'}失败`);
    } finally {
      setModalVisible(false);
    }
  };

  const _cancelModal = async () => {
    setModalVisible(false);
  };

  const tableHeader = (item) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{item.name}</span>
        <div>
          <Button type="link" onClick={() => _stopOpenTemplete(item)}>
            {item.status == 1 ? '停用' : '启用'}
          </Button>
          <Button type="link" onClick={() => _modifyTemplete(item)}>
            编辑
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <BreadCrumb />
      <div className="container">
        {/* 头部标题 */}
        <Headline title="运费模版" />
        <Row>
          <Button type="primary" onClick={_addTemplate}>
            新增运费模版
          </Button>
          <TableDiv>
            {dataSource.map((item) => {
              const datas = JSON.parse(item.costRule);
              return (
                <Table
                  key={item.id}
                  title={() => tableHeader(item)}
                  bordered={true}
                  pagination={false}
                  dataSource={datas}
                  columns={columns}
                />
              );
            })}
          </TableDiv>
        </Row>
      </div>
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        width={1000}
        title={`${Object.keys(editData).length ? '编辑' : '新增'}运费模版 (${
          record.carrierName
        })`}
        visible={modalVisible}
        onOk={_confirmModal}
        onCancel={_cancelModal}
        okText="确认"
        cancelText="取消"
      >
        <ForwardingAddUpdateTemplete
          ref={modalRef}
          editData={editData}
          record={record}
        />
      </Modal>
    </div>
  );
}
