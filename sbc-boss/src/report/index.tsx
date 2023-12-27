import React from 'react';
import { Table, DatePicker, Select } from 'antd';
import { SelectGroup, TreeSelectGroup } from 'qmkit';
import { Headline, BreadCrumb, Const, util } from 'qmkit';
import { message } from 'antd';
import { Button, Radio } from 'antd';
import moment from 'moment';
import styled from 'styled-components';

const { Option } = Select;

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const { RangePicker } = DatePicker;
const list = [
  {
    name: '囤货总数数据',
    url: 'pickGoods/pileAndTradeStatistics'
  },
  {
    name: '商品囤货总数据（实时）新',
    url: 'pickGoods/statisticNewPileTradeTotal'
  },
  {
    name: '客户销售数据前50',
    url: 'pickGoods/getBuyRankingList'
  },
  {
    name: '客户销售数据后30',
    url: 'pickGoods/getBuyRankingList'
  },
  {
    name: '商品提货数据',
    url: 'pickGoods/statisticPickUpLog'
  },
  {
    name: '等货中商品（实时）',
    url: 'pickGoods/getInventory',
    isDisbled: true
  },
  {
    name: '商品囤货未提数据（实时）',
    url: 'pickGoods/statisticRecordItemPriceNumNoPile',
    store: true,
    isDisbled: true
  },
  {
    name: '客户囤货未提数据（实时）',
    url: 'pickGoods/statisticRecordItemPriceNumNoPileUser',
    store: true,
    isDisbled: true
  },
  {
    name: '商品囤货未提数据（实时）新',
    url: 'pickGoods/statisticNewPileTradeNoPile',
    // store: true,
    // isDisbled: true
  },
  {
    name: '客户囤货未提数据（实时）新',
    url: 'pickGoods/statisticNewPileTradeNoPileUser',
    // store: true,
    // isDisbled: true
  },
  {
    name: '商品上下架状态数据表',
    url: 'goods/spu/exportGoodsbyTimeAndStaus/params/',
    isDisbled: true,
    isGoodstopBotom: true
  }
];
let time = null;
function onChang(date, dateString) {
  console.log(dateString);
  console.log(dateString[0] == dateString[1]);
  time = dateString;
}
export default class MYcomponent extends React.Component {
  state = {
    added_flag: 0
  };
  render() {
    return (
      <div>
        <BreadCrumb />
        {list.map((item, index) => {
          return (
            <div style={styles.nvaitme} key={index}>
              <div style={styles.tile}>{item.name}</div>
              {/* <Table dataSource={dataSource} columns={columns} /> */}
              <div style={styles.navti}>
                {/* <Space direction="vertical"> */}
                <div style={styles.navti}>
                  {/* onChange={onChang} */}
                  请选择日期:{' '}
                  <RangePicker
                    disabledDate={this.disabledDate}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss')
                      ]
                    }}
                    onChange={onChang}
                    onOk={this.qrscofi}
                    disabled={item.isDisbled ? true : false}
                  />
                  {item.isGoodstopBotom && (
                    <SelectBox style={{ marginLeft: '20px' }}>
                      <SelectGroup
                        getPopupContainer={() =>
                          document.getElementById('page-content')
                        }
                        label="上下架"
                        defaultValue="下架"
                        showSearch
                        onChange={(value) => {
                          console.log(value);

                          this.setState({ added_flag: value });
                        }}
                      >
                        <Option value="0">下架</Option>
                        <Option value="1">上架</Option>
                        {/* <Option value="2">部分上架</Option> */}
                      </SelectGroup>
                    </SelectBox>
                  )}
                </div>
                {/* </Space> */}
                <Button style={styles.botn} type="primary" shape="round">
                  <a
                    target="_blank"
                    onClick={this.exports(item.url, index, item.store,item.isDisbled)}
                  >
                    导出
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  qrscofi = (e) => {
    console.log(time);
  };
  disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }
  //D导出
  exports = (dataType, index, store,isDisbled?) => {
    return (evet) => {
      if (store) {
        let base64 = new util.Base64();
        const token = (window as any).token;
        let resBody = JSON.stringify({
          // beginTime: time[0],
          // endTime: time[1],
          // sort: 'des',
          // size: 30,
          token: token
        });
        let encrypted = base64.urlEncode(resBody);
        // 新窗口下载
        const exportHrefs = Const.HOST + `/${dataType}/${encrypted}`;
        // console.log(exportHref);
        window.open(exportHrefs);
        return;
      }
      console.log(dataType, index);
      if(!isDisbled){
        if (time == null && index != 4 && index != 7) {
          message.error('请选择时间');
          return;
        }
        if (index != 4 && index != 7) {
          if (time[0] == '' && time[1] == '') {
            message.error('请选择时间');
            return;
          }
        }
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(dataType);
          // 参数加密
          let base64 = new util.Base64();
          const token = (window as any).token;
          if (token) {
            let result;
            if (dataType == 'pickGoods/getBuyRankingList') {
              //客户销售数据
              console.log('09999999999999');
              if (index == 2) {
                result = JSON.stringify({
                  beginTime: time[0],
                  endTime: time[1],
                  sort: 'asc',
                  size: 30,
                  token: token
                });
              } else {
                result = JSON.stringify({
                  beginTime: time[0],
                  endTime: time[1],
                  sort: 'desc',
                  size: 50,
                  token: token
                });
              }
            } else if (dataType == 'pickGoods/getInventory') {
              const exportHref = Const.HOST + `/${dataType}/`;
              window.open(exportHref);
              return;
            }
            if (dataType == 'goods/spu/exportGoodsbyTimeAndStaus/params/') {
              result = JSON.stringify({
                // beginTime: time[0],
                // endTime: time[1],
                token: token,
                added_flag: this.state.added_flag
              });
            } else {
              result = JSON.stringify({
                beginTime: time[0],
                endTime: time[1],
                token: token
              });
            }
            console.log(result);
            let encrypted = base64.urlEncode(result);
            // 新窗口下载
            const exportHref = Const.HOST + `/${dataType}/${encrypted}`;
            console.log(exportHref);
            window.open(exportHref);
          } else {
            message.error('请登录');
          }

          resolve();
        }, 500);
      });
    };
  };
}
// async function qrscofi(date, dateString) {
//   console.log(time);
//   let prema = {
//     beginTime: time[0],
//     endTime: time[1]
//   }
//   console.log(prema, '要传的值')
//   const cateList: any = await pickGoods(prema);
//   console.log(cateList)
// }

const styles = {
  nvaitme: {
    margin: 20,
    background: '#FFF',
    padding: 20
  },
  tile: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20
  },
  navti: {
    display: 'flex'
  },
  botn: {
    marginLeft: 20
  }
};
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
];
