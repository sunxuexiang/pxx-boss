import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { history, util, Const } from 'qmkit';

const GoodsSpecification = (props) => {
  const tableStyle = {
    tableContainer: {
      // paddingRight: 138
    },
    tableCell: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tableImg: {
      width: 60,
      height: 60
    }
  };
  const [tableLoading, setLoading] = useState(false);
  // 规格数据
  const [specificationData, setData] = useState([]);
  // 规格动态表头
  const [activeColums, setActiveColums] = useState([]);
  const specificationColums = [
    {
      title: 'SKU图片',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoImg',
      key: 'goodsInfoImg',
      render: (goodsInfoImg) => {
        return (
          <div style={tableStyle.tableCell}>
            <img style={tableStyle.tableImg} src={goodsInfoImg} />
          </div>
        );
      }
    },
    {
      title: 'SKU编码',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoNo',
      key: 'goodsInfoNo'
    },
    ...activeColums,
    {
      title: '销售价（元）',
      align: 'center' as 'center',
      dataIndex: 'marketPrice',
      key: 'marketPrice'
    },
    {
      title: '数量',
      align: 'center' as 'center',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '条形码',
      align: 'center' as 'center',
      dataIndex: 'goodsInfoBarcode',
      key: 'goodsInfoBarcode'
    },
    {
      title: '上下架状态',
      align: 'center' as 'center',
      dataIndex: 'addedFlag',
      key: 'addedFlag',
      render: (addedFlag) => {
        return addedFlag === 0 ? '下架' : '上架';
      }
    },
    {
      title: '操作',
      align: 'center' as 'center',
      dataIndex: 'operate',
      key: 'operate',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        // 自营商家
        return (
          <Button
            type="link"
            onClick={() => {
              let searchCacheForm =
                JSON.parse(sessionStorage.getItem('searchCacheForm')) || {};
              sessionStorage.setItem(
                'searchCacheForm',
                JSON.stringify({
                  ...searchCacheForm,
                  goodsForm: props.searchForm || {}
                })
              );
              history.push({
                pathname: `/goods-sku-detail/${record.goodsInfoId}`
              });
            }}
          >
            查看
          </Button>
        );
      }
    }
  ];
  useEffect(() => {
    if (props.tableData.length > 0) {
      tableInit();
    }
  }, []);
  const tableInit = () => {
    const allData = [...props.tableData];
    const activeCol = [];
    // 是否存在规格属性数据
    if (allData[0].goodsAttributeKeys) {
      // 根据选择属性添加动态表头
      allData[0].goodsAttributeKeys.forEach((el) => {
        const { attribute } = el;
        const newCol = {
          title: attribute.attribute,
          width: 100,
          align: 'center' as 'center',
          dataIndex: attribute.attributeId,
          key: attribute.attributeId
        };
        activeCol.push(newCol);
      });
      // 根据属性id新增对应key val 数据
      allData.forEach((item) => {
        item.goodsAttributeKeys.forEach((el) => {
          item[el.attribute.attributeId] = el.goodsAttributeValue;
        });
      });
    }
    setActiveColums([...activeCol]);
    setData([...allData]);
  };
  return (
    <div style={tableStyle.tableContainer}>
      <Table
        loading={tableLoading}
        columns={specificationColums}
        dataSource={specificationData}
        rowKey={(record: any) => record.marketId}
        scroll={{ x: true }}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default GoodsSpecification;
