import * as React from 'react';
import { Modal, Select } from 'antd';
import { Relax } from 'plume2';
import moment from 'moment';
import { noop, DataGrid, SelectGroup, Const } from 'qmkit';
import { List } from 'immutable';

type TList = List<any>;
const { Column } = DataGrid;
const Option = Select.Option;

@Relax
export default class SeeRecord extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      serviceModalVisible: boolean;
      serviceModal: Function;
      storeEvaluateNumList: TList;
      evaluateCount: number;
      compositeScore: number;
      storeTotal: number;
      storeDataList: TList;
      storePageSize: number;
      storeCurrentPage: number;
      initStoreEvaluate: Function;
      storeCycle: number;
      storeId: number;
      changeScoreCycle: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    serviceModalVisible: 'serviceModalVisible',
    // 关闭弹窗
    serviceModal: noop,
    storeEvaluateNumList: 'storeEvaluateNumList',
    evaluateCount: 'evaluateCount',
    compositeScore: 'compositeScore',
    storeTotal: 'storeTotal',
    storeDataList: 'storeDataList',
    storePageSize: 'storePageSize',
    storeCurrentPage: 'storeCurrentPage',
    initStoreEvaluate: noop,
    scoreCycle: 'scoreCycle',
    storeId: 'storeId',
    changeScoreCycle: noop
  };

  render() {
    const {
      serviceModalVisible,
      storeEvaluateNumList,
      evaluateCount,
      compositeScore,
      storeDataList,
      storeTotal,
      storePageSize,
      storeCurrentPage,
      initStoreEvaluate,
      scoreCycle,
      storeId,
      changeScoreCycle
    } = this.props.relaxProps as any;
    if (!serviceModalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            <div style={{ width: '12%', float: 'left' }}>店铺评分详情</div>
            <div style={{ fontSize: '13px', color: 'grey' }}>
              店铺评价数据次日进行统计更新
            </div>
          </div>
        }
        visible={serviceModalVisible}
        width={920}
        onCancel={this._handleModelCancel}
        footer={null}
      >
        <div className="see-service-record">
          <div className="up-content">
            <div className="personal">人数：{evaluateCount || 0}</div>
            <div className="score">
              综合评分：{compositeScore ? compositeScore.toFixed(2) : '-'}
            </div>
            <div className="select">
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="时间范围"
                style={{ width: 80 }}
                onChange={(value) => changeScoreCycle(value, storeId)}
                value={scoreCycle + ''}
              >
                <Option value="2">近180日</Option>
                <Option value="1">近90日</Option>
                <Option value="0">近30日</Option>
              </SelectGroup>
            </div>
          </div>
          <div className="center-table">
            <DataGrid dataSource={storeEvaluateNumList} pagination={false}>
              <Column
                title="评价详情"
                key="numType"
                dataIndex="numType"
                render={(value) => {
                  if (value == 0) {
                    return '商品评分';
                  } else if (value == 1) {
                    return '服务评分';
                  } else {
                    return '物流评分';
                  }
                }}
              />

              <Column
                title="4—5分"
                dataIndex="excellentNum"
                key="excellentNum"
              />
              <Column title="3分" dataIndex="mediumNum" key="mediumNum" />
              <Column
                title="1—2分"
                dataIndex="differenceNum"
                key="differenceNum"
              />
              <Column
                title="均分"
                dataIndex="sumCompositeScore"
                key="sumCompositeScore"
                render={(text) => parseFloat(text).toFixed(2)}
              />
            </DataGrid>
          </div>
          <div className="down-table">
            <label className="evalu-title">评价历史记录（{storeTotal}）</label>
            <DataGrid
              dataSource={storeDataList}
              pagination={{
                current: storeCurrentPage,
                pageSize: storePageSize,
                total: storeTotal,
                onChange: (pageNum, pageSize) => {
                  initStoreEvaluate({
                    pageNum: pageNum - 1,
                    pageSize: pageSize,
                    storeId: storeId,
                    scoreCycle: scoreCycle
                  });
                }
              }}
            >
              <Column
                title="会员名称"
                dataIndex="customerName"
                key="customerName"
              />
              <Column title="订单号" dataIndex="orderNo" key="orderNo" />
              <Column
                title="评价时间"
                dataIndex="createTime"
                key="createTime"
                render={(text) => moment(text).format(Const.TIME_FORMAT)}
              />
              <Column
                title="商品评价"
                dataIndex="goodsScore"
                key="goodsScore"
              />
              <Column
                title="服务评价"
                dataIndex="serverScore"
                key="serverScore"
              />
              <Column
                title="物流评价"
                dataIndex="logisticsScore"
                key="logisticsScore"
              />
              <Column
                title="综合"
                dataIndex="compositeScore"
                key="compositeScore"
                render={(text) => parseFloat(text).toFixed(2)}
              />
            </DataGrid>
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { serviceModal } = this.props.relaxProps;
    serviceModal(false);
  };
}
