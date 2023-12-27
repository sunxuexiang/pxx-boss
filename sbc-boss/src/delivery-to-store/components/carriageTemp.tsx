import React, { useState, useEffect } from 'react';
import { Table, message, Button, Row, Col } from 'antd';
import { Const } from 'qmkit';
import { fetchTemp, updateTemp, delTemp } from '../webapi';
import TempModal from './tempModal';
import '../index.less';

const FREIGHT_TEMP = {
  0: { unit: '件', label: '件', options: '件数' },
  1: { unit: 'kg', label: '重', options: '重量' },
  2: { unit: 'm³', label: '体积', options: '体积' },
  3: { unit: 'kg', label: '重', options: '重量' }
};

const PLACE_HOLDER = {
  0: { unit: '1-9999', money: '0.00-9999.99' },
  1: { unit: '0.1-9999.9', money: '0.00-9999.99' },
  2: { unit: '0.001-999.999', money: '0.00-9999.99' },
  3: { unit: '0.1-9999.9', money: '0.00-9999.99' }
};

const CarriageTemp = function (props) {
  // 模板Modal 开关
  const [visible, setVisible] = useState(false);
  // 编辑/新增 标识
  const [type, setType] = useState('add');
  // 模板list数据
  const [list, setList] = useState([]);
  // 编辑中的数据
  const [currentData, setCurrent] = useState(null);

  // 获取所有模板数据
  const getAllTemp = async () => {
    const { res } = await fetchTemp();
    if (res && res.code === Const.SUCCESS_CODE) {
      setList(res.context || []);
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getAllTemp();
  }, []);
  // 打开弹窗(新增)
  const add = () => {
    setCurrent(null);
    setVisible(true);
    setType('add');
  };
  // 打开弹窗(编辑)
  const edit = (info) => {
    setCurrent(info);
    setVisible(true);
    setType('edit');
  };
  // 关闭弹窗
  const close = () => {
    setVisible(false);
  };
  // 启用/停用
  const setConfig = async (data) => {
    const params = {
      freightTempId: data.freightTempId,
      defaultFlag: data.defaultFlag === 0 ? 1 : 0
    };
    const { res } = await updateTemp(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      getAllTemp();
    } else {
      message.error(res.message || '');
    }
  };
  // 删除
  const delConfig = async (id) => {
    const { res } = await delTemp(id);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      getAllTemp();
    } else {
      message.error(res.message || '');
    }
  };
  // 获取表头
  const getColumns = (valuationType) => {
    return [
      {
        title: '计价方式',
        dataIndex: 'valuationType',
        key: 'valuationType',
        render: (text) => {
          let result = '';
          switch (text) {
            case 0:
              result = '按件数';
              break;
            case 1:
              result = '按重量';
              break;
            case 2:
              result = '按体积';
              break;
            case 3:
              result = '按重量/件';
              break;
            default:
              break;
          }
          return result;
        }
      },
      {
        title: '配送地区',
        dataIndex: 'destinationAreaName',
        key: 'destinationAreaName',
        render: (text) => (text ? text.split(',') : '')
      },
      {
        title: `首${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
        dataIndex: 'freightStartNum',
        key: 'freightStartNum'
      },
      {
        title: '首费(元)',
        dataIndex: 'freightStartPrice',
        key: 'freightStartPrice'
      },
      {
        title: `续${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
        dataIndex: 'freightPlusNum',
        key: 'freightPlusNum'
      },
      {
        title: '续费(元)',
        dataIndex: 'freightPlusPrice',
        key: 'freightPlusPrice'
      }
    ];
  };
  return (
    <div>
      <Button type="primary" onClick={add}>
        新增运费模板
      </Button>
      <div>
        {list.map((item) => {
          return (
            <Table
              key={item.freightTempId}
              className="dts-content"
              columns={getColumns(item.valuationType)}
              dataSource={item.freightTemplateGoodsExpresses}
              bordered
              pagination={false}
              title={() => {
                return (
                  <Row
                    className="dts-table-title"
                    type="flex"
                    justify="space-between"
                  >
                    <Col>{item.freightTempName}</Col>
                    <Col>
                      <Button type="link" onClick={() => setConfig(item)}>
                        {item.defaultFlag === 0 ? '启用' : '停用'}
                      </Button>
                      <Button type="link" onClick={() => edit(item)}>
                        编辑
                      </Button>
                      {item.defaultFlag === 0 && (
                        <Button
                          type="link"
                          onClick={() => delConfig(item.freightTempId)}
                        >
                          删除
                        </Button>
                      )}
                    </Col>
                  </Row>
                );
              }}
            />
          );
        })}
      </div>
      <TempModal
        FREIGHT_TEMP={FREIGHT_TEMP}
        PLACE_HOLDER={PLACE_HOLDER}
        visible={visible}
        type={type}
        close={close}
        currentData={currentData}
        getAllTemp={getAllTemp}
      />
    </div>
  );
};
export default CarriageTemp;
