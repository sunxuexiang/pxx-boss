import React from 'react';
import { Table, Button, Tag } from 'antd';
import { AuthWrapper, Headline, history, FindArea } from 'qmkit';
import './index.less';

const WaybillDetail = (props) => {
  const data = props?.location?.state?.data || '';
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, _record, index) => index + 1
    },
    {
      title: 'SKU编码',
      dataIndex: 'skuNo'
    },
    {
      title: '商品名称',
      dataIndex: 'skuName'
    },
    // {
    //   title: '规格',
    //   dataIndex: 'spec'
    // },
    // {
    //   title: '生产日期',
    //   dataIndex: 'productionDate'
    // },
    {
      title: '数量',
      dataIndex: 'quantity'
    },
    {
      title: '已发货数',
      dataIndex: 'haveDeliveryNum'
    }
  ];
  const goBack = () => {
    history.push({
      pathname: '/waybill-list',
      state: {
        page: props?.location?.state?.page || 1
      }
    });
  };

  const showStatus = (status) => {
    let result = '--';
    switch (status) {
      case 20:
        result = '待商家送货';
        break;
      case 30:
        result = '待揽收';
        break;
      case 31:
        result = '已揽件';
        break;
      case 40:
        result = '待签收';
        break;
      case 50:
        result = '已完成';
        break;
      case 60:
        result = '已作废';
        break;
      default:
        break;
    }
    return result;
  };

  const showRule = (info) => {
    if (info) {
      let detail = JSON.parse(JSON.parse(info));
      return (
        <React.Fragment>
          {detail.defaultArea && (
            <span style={{ marginRight: '12px' }}>默认运费</span>
          )}
          {!detail.defaultArea &&
            detail.areaCodes.map((item) => (
              <Tag key={item.value} color="orange">
                {item.label}
              </Tag>
            ))}
          <span>{`3箱起配${detail.start}元/箱，乡镇件5箱起配加收${detail.increase}元/单票`}</span>
        </React.Fragment>
      );
    }
    return '--';
  };

  return (
    <AuthWrapper functionName={'f_waybill_detail'}>
      <div className="container">
        <Headline title="运单详情" />
        <div className="waybill-detail-conent">
          <p>运单状态： {showStatus(data?.order?.status)}</p>
          <p>运单号： {data?.order?.id || '--'}</p>
          <p>承运商名称： {data?.order?.senderName || '--'}</p>
          <p>销售订单： {data?.trade?.tradeOrderId || '--'}</p>
          <p>商家名称： {data?.trade?.storeName || '--'}</p>
          <p>下单时间： {data?.order?.tradeTime || '--'}</p>
          <p>
            第三方发货单号： {data?.order?.thirdPartyDeliveryOrderNo || '--'}
          </p>
          <p>
            收件人详细地址：{' '}
            {`
            ${FindArea.findProviceName(data?.order?.receiverProvinceCode)}
            ${FindArea.findCity(data?.order?.receiverCityCode)}
            ${FindArea.findArea(data?.order?.receiverDistrictCode)}
            ${FindArea.findStreet(data?.order?.receiverStreetCode)}
            ${data?.order?.receiverAddress || '-'}
          `}
          </p>
          <p>收件人姓名： {data?.order?.receiverName || '--'}</p>
          <p>收件人电话： {data?.order?.receiverPhone || '--'}</p>
          <p>发件人姓名： {data?.order?.senderName || '--'}</p>
          <p>发件人电话： {data?.order?.senderPhone || '--'}</p>
          <p>订单提货点名称： {data?.order?.pickupSiteName || '--'}</p>
          <p>
            运单金额： {data?.order?.amount ? `${data?.order?.amount}元` : '--'}
          </p>
          <p>运单总件数： {data?.order?.quantity || '--'}</p>
          <p>是否乡镇件： {data?.order?.villageFlag === 1 ? '是' : '否'}</p>
          <p>
            是否跨商家凑单门槛：{' '}
            {data?.order?.isDoubleStore === 1 ? '是' : '否'}
          </p>
          <p>计算运费规则： {showRule(data?.order?.freightRule)}</p>
        </div>
        <Table dataSource={data.items} columns={columns} pagination={false} />
        <Button
          className="waybill-detail-backBtn"
          type="primary"
          onClick={goBack}
        >
          返回
        </Button>
      </div>
    </AuthWrapper>
  );
};

export default WaybillDetail;
