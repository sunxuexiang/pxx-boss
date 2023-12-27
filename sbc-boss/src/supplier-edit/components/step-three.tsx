import React from 'react';
import { IMap, Relax } from 'plume2';

import { Modal, Button, DatePicker, Radio, Form, Input, Select } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid } from 'qmkit';
import moment from 'moment';
const FormItem = Form.Item;
import { IList } from '../../../typings/globalType';

const Option = Select.Option;

const RadioGroup = Radio.Group;
// @ts-ignore
const { Column } = DataGrid;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;

const formItemLayout = {
  labelCol: {
    span: 1,
    xs: { span: 1 },
    sm: { span: 2 }
  },
  wrapperCol: {
    span: 1,
    xs: { span: 1 },
    sm: { span: 6 }
  }
};

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
  font-size: 12px;
`;
const TableBox = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;

  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class StepThree extends React.Component<any, any> {
  props: {
    relaxProps?: {
      brandModal: Function;
      sortModal: Function;
      company: IMap;
      onChange: Function;
      renewStore: Function;
      storeId: number;
      fetchSignInfo: Function;
      selfWareHouses: IList;
      checkboxModal: Function;
      delMarket: Function;
      delStore: Function;
    };
  };

  static relaxProps = {
    brandModal: noop,
    sortModal: noop,
    company: 'company',
    onChange: noop,
    renewStore: noop,
    storeId: 'storeId',
    fetchSignInfo: noop,
    selfWareHouses: 'selfWareHouses',
    checkboxModal: noop,
    delMarket: noop,
    delStore: noop
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company, selfWareHouses, delMarket, delStore } = this.props
      .relaxProps as any;
    const cateList = company.get('cateList').toJS();
    const brandList = company.get('brandList').toJS();
    const marketList = company.get('marketList').toJS();
    const storeList = company.get('storeList').toJS();
    const storeInfo = company.get('storeInfo');
    let endDate = storeInfo.get('contractEndDate')
      ? storeInfo.get('contractEndDate').split(' ')[0]
      : null;

    const companyType = storeInfo.get('companyType');
    const chooseWareHouseIds = company.get('wareHourseIds'); //已选的分仓
    const erpId = company.get('info').get('erpId');

    let children = [];
    if (selfWareHouses && selfWareHouses.length > 0) {
      selfWareHouses.map((s) => {
        children.push(
          <Option key={s.get('wareId')} value={s.get('wareId')}>
            {s.get('wareName')}
          </Option>
        );
      });
    }
    return (
      <div>
        <Content>
          <div>
            <Red>*</Red>
            <H2>签约批发市场</H2>
            <GreyText>已签约{marketList.length}个类目</GreyText>
            <Button onClick={() => this._showCheckboxModal(0)}>
              编辑签约批发市场
            </Button>
          </div>
          <TableBox>
            <DataGrid
              // @ts-ignore
              dataSource={marketList}
              scroll={{ y: 240 }}
              pagination={false}
              rowKey="relationValue"
            >
              <Column
                title="批发市场名称"
                align="center"
                dataIndex="relationName"
                key="relationName"
                width="70%"
              />
              {/* <Column
                title="操作"
                align="left"
                dataIndex="opration"
                key="opration"
                width="30%"
                render={(_, rowInfo) => {
                  return (
                    <Button
                      style={{ paddingLeft: 0 }}
                      type="link"
                      onClick={() => delMarket(rowInfo)}
                    >
                      删除
                    </Button>
                  );
                }}
              /> */}
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约商城分类</H2>
            <GreyText>已签约{storeList.length}个商城分类</GreyText>
            <Button onClick={() => this._showCheckboxModal(1)}>
              编辑签约商城分类
            </Button>
          </div>
          <TableBox>
            <DataGrid
              // @ts-ignore
              dataSource={storeList}
              scroll={{ y: 240 }}
              pagination={false}
              rowKey="relationValue"
            >
              <Column
                title="商城分类"
                align="center"
                dataIndex="relationName"
                key="relationName"
                width="70%"
              />
              {/* <Column
                title="操作"
                align="left"
                dataIndex="opration"
                key="opration"
                width="30%"
                render={(_, rowInfo) => {
                  return (
                    <Button
                      style={{ paddingLeft: 0 }}
                      type="link"
                      onClick={() => delStore(rowInfo)}
                    >
                      删除
                    </Button>
                  );
                }}
              /> */}
            </DataGrid>
          </TableBox>
        </Content>
        <Content>
          <div>
            <Red>*</Red>
            <H2>签约类目</H2>
            <GreyText>
              已签约{cateList.length}个类目 最多可签约200个类目
            </GreyText>
            <Button onClick={this._showSortsModal}>编辑签约类目</Button>
          </div>
          <TableBox>
            <DataGrid
              // @ts-ignore
              rowKey="contractCateId"
              dataSource={cateList.length > 0 ? cateList : []}
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="类目"
                dataIndex="cateName"
                key="cateName"
                width="15%"
              />
              <Column
                title="上级类目"
                dataIndex="parentGoodCateNames"
                key="parentGoodCateNames"
                width="20%"
              />
              <Column
                title="类目扣率"
                dataIndex="cateRate"
                key="cateRate"
                width="15%"
                render={(text) => {
                  return (
                    <div>
                      <span style={{ width: 50 }}>{text}</span>&nbsp;%
                    </div>
                  );
                }}
              />
              <Column
                title="经营资质"
                dataIndex="qualificationPics"
                key="qualificationPics"
                width="50%"
                render={(text) => {
                  let images = text ? text.split(',') : [];
                  return images.length > 0 ? (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约品牌</H2>
            <GreyText>已签约{brandList.length}个品牌</GreyText>
            <Button onClick={this._showModal}>编辑签约品牌</Button>
          </div>
          <TableBox>
            <DataGrid
              // @ts-ignore
              dataSource={brandList}
              rowKey="contractBrandId"
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="品牌名称"
                dataIndex="brandName"
                key="brandName"
                width="15%"
              />
              <Column
                title="品牌别名"
                dataIndex="nickName"
                key="nickName"
                width="20%"
              />
              <Column
                title="品牌logo"
                dataIndex="logo"
                key="logo"
                width="15%"
                render={(text, _record, i) => {
                  return text ? (
                    <PicBox>
                      <img
                        src={text}
                        key={i}
                        alt=""
                        onClick={() =>
                          this.setState({ showImg: true, imgUrl: text })
                        }
                      />
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
              <Column
                title="授权文件"
                dataIndex="authorizePic"
                key="authorizePic"
                width="50%"
                render={(text) => {
                  let images = text ? text : [];
                  return (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v.url}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v.url })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>签约有效期</H2>
            <GreyText>商家店铺有效期</GreyText>
          </div>
          <DatePicker
            value={moment(storeInfo.get('contractStartDate'))}
            format="YYYY-MM-DD HH:mm:ss"
            disabled={true}
          />
          ~
          <DatePicker
            //defaultValue ={moment(storeInfo.get('contractEndDate'))}
            defaultValue={endDate ? moment(moment(endDate).valueOf()) : null}
            format="YYYY-MM-DD 23:59:59"
            onChange={(param) => this._changeCalender(param)}
            disabledDate={this.disabledDate}
            getCalendarContainer={() => document.getElementById('page-content')}
          />
        </Content>

        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>商家类型</H2>
          </div>
          <RadioGroup
            value={companyType != null ? companyType : 1}
            disabled={true}
          >
            <Radio value={0} disabled={true}>
              自营商家
            </Radio>
            <Radio value={1}>第三方商家</Radio>
            <Radio value={2}>统仓统配</Radio>
          </RadioGroup>
          <div style={{ marginTop: 25 }}>
            <Form>
              <FormItem required={true} {...formItemLayout} label="商家ID">
                <Input
                  allowClear
                  value={storeInfo.get('supplierCode')}
                  disabled={true}
                />
              </FormItem>
              {companyType != 1 && (
                <FormItem {...formItemLayout} label="选择仓库" required={true}>
                  <Select
                    mode={'multiple'}
                    allowClear
                    value={
                      chooseWareHouseIds && chooseWareHouseIds.length > 0
                        ? chooseWareHouseIds
                        : []
                    }
                    placeholder="请选择仓库"
                    disabled={true}
                  >
                    {children}
                  </Select>
                </FormItem>
              )}
            </Form>
          </div>
        </Content>

        <div className="bar-button">
          <Button type="primary" onClick={this._saveAll}>
            保存
          </Button>
        </div>
        <Modal
          maskClosable={false}
          visible={this.state.showImg}
          footer={null}
          onCancel={() => this._hideImgModal()}
        >
          <div>
            <div>
              <img
                style={{ width: '100%', height: '100%' }}
                src={this.state.imgUrl}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  /**
   * 显示品牌弹框
   */
  _showModal = () => {
    const { brandModal, fetchSignInfo, storeId } = this.props.relaxProps;
    fetchSignInfo(storeId);
    brandModal();
  };

  /**
   * 显示类目弹框
   */
  _showSortsModal = () => {
    const { sortModal } = this.props.relaxProps;
    sortModal();
  };

  /**
   * 显示批发市场/商城分类弹框
   */
  _showCheckboxModal = (modalType) => {
    const { checkboxModal } = this.props.relaxProps;
    checkboxModal(modalType);
  };

  /**
   * 编辑签约有效期
   * @param params
   * @private
   */
  _changeCalender = (params) => {
    const { onChange } = this.props.relaxProps;
    let endTime;
    if (params) {
      endTime = params.format('YYYY-MM-DD 23:59:59');
    }
    //改变签约终止日期
    onChange({ field: 'contractEndDate', value: endTime });
  };

  /**
   * 选择商家类型
   * @param e
   * @private
   */
  _chooseType = (e) => {
    const { onChange } = this.props.relaxProps;
    //改变商家类型
    onChange({ field: 'companyType', value: e.target.value });
  };

  /**
   * 签约日期和商家类型编辑
   * @private
   */
  _saveAll = () => {
    const { renewStore } = this.props.relaxProps;
    renewStore();
  };

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };

  /**
   * 禁选择的日期
   * @param current
   * @returns {any|boolean}
   */
  disabledDate(current) {
    return current && current <= new Date().getTime() - 1000 * 60 * 60 * 24;
  }
}
